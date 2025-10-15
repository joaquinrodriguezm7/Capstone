import express from 'express';
import dotenv from 'dotenv';
import usersRouter from './routes/user.js';
import preferencesRouter from './routes/preference.js';
import usersTypeRouter from './routes/user_type.js';
import loginRouter from './routes/auth.js';
import usersPhotosRouter from './routes/user_photos.js';
import profileRouter from './routes/profile.js';
import matchRouter from './routes/match.js';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { csrfMiddleware, verifyCsrfToken } from './middleware/csrfMiddleware.js';
import helmetConfig from './config/helmetConfig.js';

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: [
        "http://localhost:8081",
        "https://127.0.0.1:8081"
    ],
    credentials: true
}));

app.use(helmetConfig);

app.use(csrfMiddleware);

app.use((req, res, next) => {
    const publicPaths = [
        "/auth/login"
    ];

    const isPublic = publicPaths.some(path => req.path.startsWith(path));

    if (isPublic) return next();
    verifyCsrfToken(req, res, next);
})

app.use('/user', usersRouter);
app.use('/auth', loginRouter);
app.use('/user_photos', usersPhotosRouter);
app.use('/profile', profileRouter);
app.use('/preference', preferencesRouter);
app.use('/user_type', usersTypeRouter);
app.use('/match', matchRouter);

app.get('/', (req, res) => {
    res.send('Servidor en funcionamiento...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});