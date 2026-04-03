import { FastifyRequest, FastifyReply } from 'fastify';
import { hash } from 'bcrypt';
import * as queries from '../drizzle/queries.js';

import { createUserSchema, updateUserSchema, idParamSchema, userFilterSchema, formatZodIssues } from '../utilities/zod.js';

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const parsed = createUserSchema.safeParse(request.body);
  if (!parsed.success) {
    const message = formatZodIssues(parsed.error.issues);
    console.error(message);
    return reply.code(400).send({
      message,
      status: false
    });
  }
  try {
    const hashedPassword = await hash(parsed.data.password, 10);
    const newUser = await queries.insertUser(parsed.data, hashedPassword);
    return reply.code(201).send({
      message: 'User created successfully',
      status: true,
      data: newUser
    });
  } catch (error: any) {
    if (error.cause?.code === '23505') {
      return reply.code(409).send({
        message: 'Username already exists',
        status: false
      });
    }
    console.error(error);
    return reply.code(500).send({
      message: 'Internal server error',
      status: false
    });
  }
}

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const paramParsed = idParamSchema.safeParse(request.params);
  if (!paramParsed.success) {
    const message = formatZodIssues(paramParsed.error.issues);
    console.error(message);
    return reply.code(400).send({
      message,
      status: false
    });
  }
  const bodyParsed = updateUserSchema.safeParse(request.body);
  if (!bodyParsed.success) {
    const message = formatZodIssues(bodyParsed.error.issues);
    console.error(message);
    return reply.code(400).send({
      message,
      status: false
    });
  }
  try {
    const updated = await queries.updateUser(paramParsed.data.id, bodyParsed.data);
    return reply.code(200).send({
      message: 'User updated successfully',
      status: true,
      data: updated
    });
  } catch (error: any) {
    if (error.message === 'User not found') {
      return reply.code(404).send({
        message: 'User not found',
        status: false
      });
    }
    console.error(error);
    return reply.code(500).send({
      message: 'Internal server error',
      status: false
    });
  }
}

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const parsed = idParamSchema.safeParse(request.params);
  if (!parsed.success) {
    const message = formatZodIssues(parsed.error.issues);
    console.error(message);
    return reply.code(400).send({
      message,
      status: false
    });
  }
  try {
    await queries.deleteUser(parsed.data.id);
    return reply.code(200).send({
      message: 'User deleted successfully',
      status: true
    });
  } catch (error: any) {
    console.error(error);
    if (error.message === 'User not found') {
      return reply.code(404).send({
        message: 'User not found',
        status: false
      });
    }
    return reply.code(500).send({
      message: 'Internal server error',
      status: false
    });
  }
}

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
  const parsed = idParamSchema.safeParse(request.params);
  if (!parsed.success) {
    const message = formatZodIssues(parsed.error.issues);
    console.error(message);
    return reply.code(400).send({
      message,
      status: false
    });
  }
  try {
    const user = await queries.getUser(parsed.data.id);
    if (!user) {
      return reply.code(404).send({
        message: 'User not found',
        status: false
      });
    }
    return reply.code(200).send({
      message: 'User retrieved successfully',
      status: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({
      message: 'Internal server error',
      status: false
    });
  }
}

export async function getUsers(request: FastifyRequest, reply: FastifyReply) {
  const parsed = userFilterSchema.safeParse(request.query);
  if (!parsed.success) {
    const message = formatZodIssues(parsed.error.issues);
    return reply.code(400).send({
      message,
      status: false
    });
  }
  try {
    const users = await queries.getUsers(parsed.data);
    return reply.code(200).send({
      message: 'Users retrieved successfully',
      status: true,
      data: users
    });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({
      message: 'Internal server error',
      status: false
    });
  }
}
