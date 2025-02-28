import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cluster from "cluster";
import swagger from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';

if(cluster.isPrimary){
    cluster.fork();
    cluster.fork();
} else{
    const app = express();
    const PORT = process.env.PORT||8080;
    mongoose.set('strictQuery', true);
    const connection = mongoose.connect(`mongodb://127.0.0.1:27017/Adoptions`);

    app.use(express.json());
    app.use(cookieParser());

    const options={
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Documentacion abm users",
                version: "1.0.0",
                description: "Documentación abm users"
            },
        },
        apis: ["./src/docs/*.yaml"]
    };
    
    const spec=swagger(options);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

    app.use('/api/users',usersRouter);
    app.use('/api/pets',petsRouter);
    app.use('/api/adoptions',adoptionsRouter);
    app.use('/api/sessions',sessionsRouter);
    app.use('/api/mocks', mocksRouter);

    app.listen(PORT,()=>console.log(`Listening on ${PORT} - pid: ${process.pid} - worker: ${cluster.worker.id}`));
};