import { FastifyRequest, FastifyReply } from 'fastify';
import { payloadSchema } from '../utilities/zod.js';
import { verifyToken } from '../utilities/jwt.js';

export function authorize(...allowedRoles: ('admin' | 'analyst' | 'viewer')[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ status: false, message: 'Authorization token required' });
    }
    const token = authHeader.slice(7);
    try {
      const payload = verifyToken(token);
      const parsed = payloadSchema.safeParse(payload);
      if (!parsed.success) {
        return reply.code(401).send({ status: false, message: 'Invalid token payload' });
      }
      if (!allowedRoles.includes(parsed.data.role)) {
        return reply.code(403).send({ status: false, message: 'Forbidden' });
      }
    } catch {
      return reply.code(401).send({ status: false, message: 'Invalid or expired token' });
    }
  };
}
