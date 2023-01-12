import express, { json, urlencoded } from 'express';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { serve, setup } from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import mongoose from 'mongoose';
import cors from 'cors';
import indexRouter from './routes/index.js';
import { swaggerSchema } from './db/models/swaggerSchema.js';

export const app = express();
dotenv.config();

mongoose.connect(`mongodb+srv://${process.env.MONGODB}&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StudyBuddy API',
      version: '1.0.0',
      description: 'A REST API for a StudyBuddy',
    },
    components: {
      schemas: swaggerSchema,
    },
    servers: [
      {
        url: 'http://localhost:4200',
      },
    ],
  },
  apis: ['src/db/models/swaggerSchema.js', 'src/controllers/*.js'],
};

const specs = swaggerJsDoc(swaggerOptions);
const PORT = process.env.PORT || 4200;

app.use('/api-docs', serve, setup(specs));
app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', indexRouter);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.listen(PORT);

export default app;
