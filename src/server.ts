
import fastify from 'fastify';
import 'dotenv/config';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyRateLimit from '@fastify/rate-limit';
import userRoutes from './routes/userRoutes.js';
import recordRoutes from './routes/financeRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import authRoutes from './routes/authRoutes.js';
const app = fastify({ logger: true });

app.addContentTypeParser('application/json', { parseAs: 'string' }, (_req, body, done) => {
  if (!body || (body as string).length === 0) {
    done(null, null);
    return;
  }
  try {
    done(null, JSON.parse(body as string));
  } catch (err) {
    done(err as Error, undefined);
  }
});

app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
});

app.register(fastifySwagger, {
    openapi: { 
        info: {
            title: 'My API',
            description: 'My API description',
            version: '2.0.0' 
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
});
      
app.register(fastifySwaggerUi, { routePrefix: '/docs' });
// we can also apply rate limiting to each and individual routes too 
// if we enter config: {} in below code it applies to all specific endpoints but in each endpoint also we can add 
app.register(authRoutes, { config: { rateLimit: { max: 10, timeWindow: '1 minute' }} });
app.register(userRoutes, { prefix: '/users', config: { rateLimit: { max: 10, timeWindow: '1 minute' } }});
app.register(recordRoutes, { prefix: '/records', config: { rateLimit: { max: 10, timeWindow: '1 minute'} } });
app.register(dashboardRoutes, { prefix: '/dashboard', config: { rateLimit: { max: 10, timeWindow: '1 minute'} } });


app.listen({ port: Number(process.env.PORT!), host: process.env.HOST! }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening on ${address}`);
});


export default app;
