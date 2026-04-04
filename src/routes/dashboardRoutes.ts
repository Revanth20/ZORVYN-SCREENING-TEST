import type { FastifyInstance } from 'fastify';
import * as dashboard from '../controllers/dashboardController.js';
import { authorize } from '../middilewares/authorize.js';

export default function dashboardRoutes(app: FastifyInstance) {
  // app.get('/summary', { preHandler: [authorize('admin', 'analyst', 'viewer')] }, dashboard.getDashboard);
  app.get('/summary', {
    preHandler: [authorize('admin', 'analyst', 'viewer')],
    schema: {
      tags: ['Dashboard'],
      description: 'Get dashboard summary - total income, expense and net balance. Requires role: admin or analyst',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                totalIncome: { type: 'number' },
                totalExpense: { type: 'number' },
                netBalance: { type: 'number' },
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
  }, dashboard.getDashboard);

  // app.get('/categories', { preHandler: [authorize('admin', 'analyst', 'viewer')] }, dashboard.getCategoryWiseTotals);
  app.get('/categories', {
    preHandler: [authorize('admin', 'analyst')],
    schema: {
      tags: ['Dashboard'],
      description: 'Get category wise income and expense totals. Requires role: admin or analyst',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  category: { type: 'string' },
                  income: { type: 'number' },
                  expense: { type: 'number' },
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
  }, dashboard.getCategoryWiseTotals);

  // app.get('/recent', { preHandler: [authorize('admin', 'analyst', 'viewer')] }, dashboard.getRecentActivity);
  app.get('/recent', {
    preHandler: [authorize('admin', 'analyst')],
    schema: {
      tags: ['Dashboard'],
      description: 'Get recent records with pagination. Requires role: admin or analyst',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          pagination: { type: 'number', default: 1 },
          limit: { type: 'number', default: 10 },
        },
      },
      response: {
        200: {
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
  }, dashboard.getRecentActivity);

  // app.get('/trends', { preHandler: [authorize('admin', 'analyst', 'viewer')] }, dashboard.getTrends);
  app.get('/trends', {
    preHandler: [authorize('admin', 'analyst')],
    schema: {
      tags: ['Dashboard'],
      description: 'Get income and expense trends grouped by period (e.g. 1d, 2w, 3m, 1y). Requires role: admin or analyst',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          trend: { type: 'string', default: '1w' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'boolean' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  period: { type: 'string' },
                  income: { type: 'number' },
                  expense: { type: 'number' },
                },
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
  }, dashboard.getTrends);
}
