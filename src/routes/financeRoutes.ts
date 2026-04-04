import type { FastifyInstance } from 'fastify';
import * as record from '../controllers/recordController.js';
import { authorize } from '../middilewares/authorize.js';

export default function recordRoutes(app: FastifyInstance) {
  // app.post('/', { preHandler: [authorize('admin')] }, record.createRecord);
  app.post('/', {
    preHandler: [authorize('admin')],
    schema: {
      tags: ['Records'],
      description: 'Create a new record. Requires role: admin',
      headers: {
        type: 'object',
        required: ['role'],
        properties: {
          role: { type: 'string', enum: ['admin', 'analyst', 'viewer'] },
        },
      },
      body: {
        type: 'object',
        required: ['amount', 'type', 'category'],
        properties: {
          amount: { type: 'number' },
          type: { type: 'string', enum: ['income', 'expense'] },
          category: { type: 'string' },
          description: { type: ['string', 'null'] },
          date: { type: 'string', format: 'date-time' },
        },
      },
      response: {
        201: {
          description: 'Record created successfully',
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                amount: { type: 'number' },
                type: { type: 'string' },
                category: { type: 'string' },
                description: { type: ['string', 'null'] },
                date: { type: 'string', format: 'date-time' },
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
  }, record.createRecord);

  // app.put('/:id', { preHandler: [authorize('admin')] }, record.updateRecord);
  app.put('/:id', {
    preHandler: [authorize('admin')],
    schema: {
      tags: ['Records'],
      description: 'Update a record. Requires role: admin',
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
        required: ['amount', 'type', 'category'],
        properties: {
          amount: { type: 'number' },
          type: { type: 'string', enum: ['income', 'expense'] },
          category: { type: 'string' },
          description: { type: ['string', 'null'] },
          date: { type: 'string', format: 'date-time' },
        },
      },
      response: {
        200: {
          description: 'Record updated successfully',
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                amount: { type: 'number' },
                type: { type: 'string' },
                category: { type: 'string' },
                description: { type: ['string', 'null'] },
                date: { type: 'string', format: 'date-time' },
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
          description: 'Record not found',
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
  }, record.updateRecord);

  // app.delete('/:id', { preHandler: [authorize('admin')] }, record.deleteRecord);
  app.delete('/:id', {
    preHandler: [authorize('admin')],
    schema: {
      tags: ['Records'],
      description: 'Delete a record. Requires role: admin',
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
          description: 'Record deleted successfully',
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
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
          description: 'Record not found',
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
  }, record.deleteRecord);

  // app.get('/:id', { preHandler: [authorize('admin', 'analyst', 'viewer')] }, record.getRecord);
  app.get('/:id', {
    preHandler: [authorize('admin', 'analyst', 'viewer')],
    schema: {
      tags: ['Records'],
      description: 'Get a record by ID. Requires role: admin, analyst, or viewer',
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
          description: 'Record retrieved successfully',
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                amount: { type: 'number' },
                type: { type: 'string' },
                category: { type: 'string' },
                description: { type: ['string', 'null'] },
                date: { type: 'string', format: 'date-time' },
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
          description: 'Record not found',
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
  }, record.getRecord);

  // app.get('/', { preHandler: [authorize('admin', 'analyst', 'viewer')] }, record.getRecords);
  app.get('/', {
    preHandler: [authorize('admin', 'analyst', 'viewer')],
    schema: {
      tags: ['Records'],
      description: 'Get all records with filters. Requires role: admin, analyst, or viewer',
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
          type: { type: 'string', enum: ['income', 'expense'] },
          pagination: { type: 'number', default: 1 },
          limit: { type: 'number', default: 10 },
        },
      },
      response: {
        200: {
          description: 'Records retrieved successfully',
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
                  amount: { type: 'number' },
                  type: { type: 'string' },
                  category: { type: 'string' },
                  description: { type: ['string', 'null'] },
                  date: { type: 'string', format: 'date-time' },
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
  }, record.getRecords);
}
