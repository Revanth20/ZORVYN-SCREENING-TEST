import { FastifyRequest, FastifyReply } from 'fastify';
import { financeRecordSchema, idParamSchema, recordFilterSchema } from '../utilities/zod.js';
import * as queries from '../drizzle/queries.js';

export async function createRecord(request: FastifyRequest, reply: FastifyReply) {
  const parsed = financeRecordSchema.safeParse(request.body);
  if (!parsed.success) {
    console.error(parsed.error.issues);
    return reply.code(400).send({
      message: parsed.error.issues[0]?.message ?? 'Invalid request',
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
    console.error(paramParsed.error.issues);
    return reply.code(400).send({
      message: paramParsed.error.issues[0]?.message ?? 'Invalid request',
      status: false
    });
  }
  const bodyParsed = financeRecordSchema.safeParse(request.body);
  if (!bodyParsed.success) {
    console.error(bodyParsed.error.issues);
    return reply.code(400).send({
      message: bodyParsed.error.issues[0]?.message ?? 'Invalid request',
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
    console.error(parsed.error.issues);
    return reply.code(400).send({
      message: parsed.error.issues[0]?.message ?? 'Invalid request',
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
    console.error(parsed.error.issues);
    return reply.code(400).send({
      message: parsed.error.issues[0]?.message ?? 'Invalid request',
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
    return reply.code(400).send({
      message: parsed.error.issues[0]?.message ?? 'Invalid request',
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
