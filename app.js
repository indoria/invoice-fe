import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import errorHandler from './middleware/errorHandler.js';
import connectDB from './config/db.js';

//import { getAllRoutes } from './utils/routeInspector.js';

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

const staticFilesPath = path.join(__dirname, 'public');
app.use(async (req, res, next) => {
    if (!path.extname(req.path)) {
        const possibleFile = path.join(staticFilesPath, req.path + '.html');
        try {
            await fs.access(possibleFile);
            req.url += '.html';
        } catch (err) {
        }
    }
    next();
});

app.use(express.static(staticFilesPath));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

import indexRouter from './routes/index.js';
app.use('/', indexRouter);



app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

//console.table(getAllRoutes(app));

export default app;
