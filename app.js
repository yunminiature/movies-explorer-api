require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const cors = require('./middlewares/cors');
const errorHandler = require('./errors/errorHandler');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

app.use(helmet());
app.use(express.json());
app.use(requestLogger);
app.use(cors);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
