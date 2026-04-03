import { FastifyRequest, FastifyReply } from 'fastify';
import { payloadSchema } from '../utilities/zod.js';

export function authorize(...allowedRoles: ('admin' | 'analyst' | 'viewer')[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const role = request.headers['role'];
    const parsed = payloadSchema.pick({ role: true }).safeParse({ role });
    if (!parsed.success) {
      return reply.code(400).send({ 
        message: 'Invalid or missing role header', 
        status: false 
    });
    }
    if (!allowedRoles.includes(parsed.data.role)) {
      return reply.code(403).send({ 
        message: 'Forbidden', 
        status: false 
    });
    }
  };
}
