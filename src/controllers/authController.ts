import { FastifyRequest, FastifyReply } from 'fastify';
import { hash, compare } from 'bcrypt';
import { signupSchema, loginSchema, formatZodIssues } from '../utilities/zod.js';
import { insertUser, getUserByUsername, getPasswordByUserId } from '../drizzle/queries.js';
import { generateToken } from '../utilities/jwt.js';

export async function signup(request: FastifyRequest, reply: FastifyReply) {
    const parsed = signupSchema.safeParse(request.body);
    if (!parsed.success) {
        const message = formatZodIssues(parsed.error.issues);
        return reply.code(400).send({ 
            status: false, 
            message
        });
    }
    const { username, password } = parsed.data;

    const existing = await getUserByUsername(username);
    if (existing) {
        return reply.code(409).send({
            status: false,
            message: 'Username already taken'
        });
    }

    const hashedPassword = await hash(password, 10);
    const user = await insertUser({ username, role: 'viewer', status: 'active' }, hashedPassword);

    return reply.code(201).send({ 
        status: true, 
        message: 'User registered successfully', 
        data: user });
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
        const message = formatZodIssues(parsed.error.issues);
        return reply.code(400).send({ 
            status: false, 
            message
        });
    }
    const { username, password } = parsed.data;

    const user = await getUserByUsername(username);
    if (!user) {
        return reply.code(404).send({ 
            status: false, 
            message: 'User not found' 
        });
    }

    if (user.status === 'inactive') {
        return reply.code(403).send({ 
            status: false, 
            message: 'Account is inactive' 
        });
    }

    const storedPassword = await getPasswordByUserId(user.id);
    if (!storedPassword) {
        return reply.code(500).send({ 
            status: false, 
            message: 'Error fetching credentials' 
        });
    }

    const isValid = await compare(password, storedPassword);
    if (!isValid) {
        return reply.code(401).send({ 
            status: false, 
            message: 'Invalid username or password' 
        });
    }

    const token = generateToken({ id: user.id, username: user.username, role: user.role });
    return reply.code(200)
    .header('Authorization', `Bearer ${token}`)
    .send({
        status: true,
        message: 'Login successful'
    });
}
