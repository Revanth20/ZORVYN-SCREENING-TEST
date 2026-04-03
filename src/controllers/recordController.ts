import { FastifyRequest, FastifyReply } from 'fastify';
import { financeRecordSchema, updateRecordSchema, idParamSchema, recordFilterSchema, formatZodIssues } from '../utilities/zod.js';
import * as queries from '../drizzle/queries.js';

export async function createRecord(request: FastifyRequest, reply: FastifyReply) {
  const parsed = financeRecordSchema.safeParse(request.body);
  if (!parsed.success) {
    const message = formatZodIssues(parsed.error.issues);
    console.error(message);
    return reply.code(400).send({
      message,
      status: false
    });
  }
  try {
    const newRecord = await queries.insertRecord(parsed.data);
    return reply.code(201).send({
      message: 'Record created successfully',
      status: true,
      data: newRecord
    });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({
      message: 'Internal server error',
      status: false
    });
  }
}

export async function updateRecord(request: FastifyRequest, reply: FastifyReply) {
  const paramParsed = idParamSchema.safeParse(request.params);
  if (!paramParsed.success) {
    const message = formatZodIssues(paramParsed.error.issues);
    console.error(message);
    return reply.code(400).send({
      message,
      status: false
    });
  }
  const bodyParsed = updateRecordSchema.safeParse(request.body);
  if (!bodyParsed.success) {
    const message = formatZodIssues(bodyParsed.error.issues);
    console.error(message);
    return reply.code(400).send({
      message,
      status: false
    });
  }
  try {
    const updated = await queries.updateRecord(paramParsed.data.id, bodyParsed.data);
    return reply.code(200).send({
      message: 'Record updated successfully',
      status: true,
      data: updated
    });
  } catch (error: any) {
    if (error.message === 'Record not found') {
      return reply.code(404).send({
        message: 'Record not found',
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

export async function deleteRecord(request: FastifyRequest, reply: FastifyReply) {
  const parsed = idParamSchema.safeParse(request.params);
  if (!parsed.success) {
    const message = formatZodIssues(parsed.error.issues);
    console.error(message);
    return reply.code(400).send({
      message,
      status: false
    });
  }
  try{
    await queries.deleteRecord(parsed.data.id);
    return reply.code(200).send({
        message: 'Record deleted successfully',
        status: true
    });
  } catch(error: any) {
    console.error(error);
    if (error.message === 'Record not found') {
        return reply.code(404).send({
            message: 'Record not found',
            status: false
        });
    }
    return reply.code(500).send({
        message: 'Internal server error',
        status: false
    })
  }
}

export async function getRecord(request: FastifyRequest, reply: FastifyReply) {
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
    const record = await queries.getRecord(parsed.data.id);
    if (!record) {
      return reply.code(404).send({
        message: 'Record not found',
        status: false
      });
    }
    return reply.code(200).send({
      message: 'Record retrieved successfully',
      status: true,
      data: record
    });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({
      message: 'Internal server error',
      status: false
    });
  }
}

export async function getRecords(request: FastifyRequest, reply: FastifyReply) {
  const parsed = recordFilterSchema.safeParse(request.query);
  if (!parsed.success) {
    const message = formatZodIssues(parsed.error.issues);
    return reply.code(400).send({
      message,
      status: false
    });
  }
  try {
    const Records = await queries.getRecords(parsed.data);
    return reply.code(200).send({
      message: 'Records retrieved successfully',
      status: true,
      data: Records
    });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({
      message: 'Internal server error',
      status: false
    });
  }
}
