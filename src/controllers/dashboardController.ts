import { FastifyRequest, FastifyReply } from 'fastify';
import * as queries from '../drizzle/queries.js';
import { filterInputSchema } from '../utilities/zod.js';

export async function getDashboard(request: FastifyRequest, reply: FastifyReply) {
  try {
    const data = await queries.getDashboardDetails();
    return reply.code(200).send({
      message: 'Dashboard retrieved successfully',
      status: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ 
        message: 'Internal server error', 
        status: false 
    });
  }
}

export async function getCategoryWiseTotals(_request: FastifyRequest, reply: FastifyReply) {
  try {
    const data = await queries.getCategoryWiseTotals();
    return reply.code(200).send({
      message: 'Category totals retrieved successfully',
      status: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ 
        message: 'Internal server error', 
        status: false 
    });
  }
}

export async function getRecentActivity(request: FastifyRequest, reply: FastifyReply) {
  const parsed = filterInputSchema.pick({ pagination: true, limit: true }).safeParse(request.query);
  if (!parsed.success) {
    return reply.code(400).send({ 
        message: parsed.error.issues, 
        status: false
    });
  }
  try {
    const data = await queries.getRecentActivity(parsed.data);
    return reply.code(200).send({
      message: 'Recent records retrieved successfully',
      status: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ 
        message: 'Internal server error', 
        status: false 
    });
  }
}

export async function getTrends(request: FastifyRequest, reply: FastifyReply) {
  const parsed = filterInputSchema.pick({ trend: true }).safeParse(request.query);
  if (!parsed.success) {
    return reply.code(400).send({ 
        message: parsed.error.issues, 
        status: false 
    });
  }
  try {
    const data = await queries.getTrends(parsed.data);
    return reply.code(200).send({
      message: 'Trends retrieved successfully',
      status: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ 
        message: 'Internal server error', 
        status: false 
    });
  }
}
