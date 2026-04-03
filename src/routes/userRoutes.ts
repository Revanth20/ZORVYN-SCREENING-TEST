import type { FastifyInstance } from 'fastify';
import * as user from '../controllers/userController.js';
import { authorize } from '../middilewares/authorize.js';

export default function userRoutes(app: FastifyInstance) {
  // app.post('/', { preHandler: [authorize('admin')] }, user.createUser);
  app.post('/', {
    preHandler: [authorize('admin')],
    schema: {
      tags: ['Users'],
      description: 'Create a new user. Requires role: admin',
      headers: {
        type: 'object',
        required: ['role'],
        properties: {
          role: { type: 'string', enum: ['admin', 'analyst', 'viewer'] },
        },
      },
      body: {
        type: 'object',
        required: ['username', 'role', 'status'],
        properties: {
          username: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'viewer', 'analyst'] },
          status: { type: 'string', enum: ['active', 'inactive'] },
        },
      },
      response: {
        201: {
          description: 'User created successfully',
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
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
            message: { type: 'string' },
            status: { type: 'boolean' },
          },
        },
        403: {
          description: 'Forbidden',
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
          },
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
          },
        },
      },
    },
  }, user.createUser);

  // app.put('/:id', { preHandler: [authorize('admin')] }, user.updateUser);
  app.put('/:id', {
    preHandler: [authorize('admin')],
    schema: {
      tags: ['Users'],
      description: 'Update a user. Requires role: admin',
      headers: {
        type: 'object',
        required: ['role'],
        properties: {
          role: { type: 'string', enum: ['admin', 'analyst', 'viewer'] },
        },
      },
      params: { type: 'object', properties: { id: { type: 'number' } } },
      body: {
        type: 'object',
        required: ['username', 'role', 'status'],
        properties: {
          username: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'viewer', 'analyst'] },
          status: { type: 'string', enum: ['active', 'inactive'] },
        },
      },
      response: {
        200: {
          description: 'User updated successfully',
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
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
            message: { type: 'string' },
            status: { type: 'boolean' },
          },
        },
        403: {
          description: 'Forbidden',
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
          },
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
          },
        },
      },
    },
  }, user.updateUser);

  // app.delete('/:id', { preHandler: [authorize('admin')] }, user.deleteUser);
  app.delete('/:id', {
    preHandler: [authorize('admin')],
    schema: {
      tags: ['Users'],
      description: 'Delete a user. Requires role: admin',
      headers: {
        type: 'object',
        required: ['role'],
        properties: {
          role: { type: 'string', enum: ['admin', 'analyst', 'viewer'] },
        },
      },
      params: { type: 'object', properties: { id: { type: 'number' } } },
      response: {
        204: { description: 'User deleted successfully', type: 'null' },
        400: {
          description: 'Bad request',
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
          },
        },
        403: {
          description: 'Forbidden',
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
          },
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
          },
        },
      },
    },
  }, user.deleteUser);

  // app.get('/:id', { preHandler: [authorize('admin')] }, user.getUser);
  app.get('/:id', {
    preHandler: [authorize('admin')],
    schema: {
      tags: ['Users'],
      description: 'Get a user by ID. Requires role: admin',
      headers: {
        type: 'object',
        required: ['role'],
        properties: {
          role: { type: 'string', enum: ['admin', 'analyst', 'viewer'] },
        },
      },
      params: { type: 'object', properties: { id: { type: 'number' } } },
      response: {
        200: {
          description: 'User retrieved successfully',
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
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
            message: { type: 'string' },
            status: { type: 'boolean' },
          },
        },
        403: {
          description: 'Forbidden',
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
          },
        },
        404: {
          description: 'User not found',
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
          },
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
          },
        },
      },
    },
  }, user.getUser);

  // app.get('/', { preHandler: [authorize('admin')] }, user.getUsers);
  app.get('/', {
    preHandler: [authorize('admin')],
    schema: {
      tags: ['Users'],
      description: 'Get all users with filters. Requires role: admin',
      headers: {
        type: 'object',
        required: ['role'],
        properties: {
          role: { type: 'string', enum: ['admin', 'analyst', 'viewer'] },
        },
      },
      querystring: {
        type: 'object',
        properties: {
          search: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'analyst', 'viewer'] },
          status: { type: 'string', enum: ['active', 'inactive'] },
          pagination: { type: 'number', default: 1 },
          limit: { type: 'number', default: 10 },
        },
      },
      response: {
        200: {
          description: 'Users retrieved successfully',
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
            data: {
              type: 'array',
              items: {
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
        },
        403: {
          description: 'Forbidden',
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
          },
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
          },
        },
      },
    },
  }, user.getUsers);
}
