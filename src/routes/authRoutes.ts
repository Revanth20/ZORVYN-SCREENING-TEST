import { FastifyInstance } from 'fastify';
import { signup, login } from '../controllers/authController.js';

export default async function authRoutes(app: FastifyInstance) {
    app.post('/signup', {
        schema: {
            tags: ['Auth'],
            description: 'Register a new user with a username and password',
            body: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                    username: { type: 'string' },
                    password: { type: 'string', minLength: 6 },
                },
            },
            response: {
                201: {
                    description: 'User registered successfully',
                    type: 'object',
                    properties: {
                        status: { type: 'boolean' },
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                id: { type: 'number' },
                                username: { type: 'string' },
                                role: { type: 'string' },
                                status: { type: 'string' },
                            },
                        },
                    },
                },
                400: {
                    description: 'Bad request',
                    type: 'object',
                    properties: {
                        status: { type: 'boolean' },
                        message: { type: 'string' },
                    },
                },
                409: {
                    description: 'Username already taken',
                    type: 'object',
                    properties: {
                        status: { type: 'boolean' },
                        message: { type: 'string' },
                    },
                },
                500: {
                    description: 'Internal server error',
                    type: 'object',
                    properties: {
                        status: { type: 'boolean' },
                        message: { type: 'string' },
                    },
                },
            },
        },
    }, signup);

    app.post('/login', {
        schema: {
            tags: ['Auth'],
            description: 'Login with username and password. Returns JWT in Authorization response header',
            body: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                    username: { type: 'string' },
                    password: { type: 'string', minLength: 6 },
                },
            },
            response: {
                200: {
                    description: 'Login successful. JWT token is in the Authorization response header',
                    type: 'object',
                    properties: {
                        status: { type: 'boolean' },
                        message: { type: 'string' },
                    },
                },
                400: {
                    description: 'Bad request',
                    type: 'object',
                    properties: {
                        status: { type: 'boolean' },
                        message: { type: 'string' },
                    },
                },
                401: {
                    description: 'Invalid username or password',
                    type: 'object',
                    properties: {
                        status: { type: 'boolean' },
                        message: { type: 'string' },
                    },
                },
                403: {
                    description: 'Account is inactive',
                    type: 'object',
                    properties: {
                        status: { type: 'boolean' },
                        message: { type: 'string' },
                    },
                },
                404: {
                    description: 'User not found',
                    type: 'object',
                    properties: {
                        status: { type: 'boolean' },
                        message: { type: 'string' },
                    },
                },
                500: {
                    description: 'Internal server error',
                    type: 'object',
                    properties: {
                        status: { type: 'boolean' },
                        message: { type: 'string' },
                    },
                },
            },
        },
    }, login);
}
