import express from 'express';
import dotenv from 'dotenv';
import usersRouter from './routes/users.js';
dotenv.config();
const app = express();
app.use(express.json());
app.use('/users', usersRouter);
app.get('/', (req, res) => {
    res.send('Servidor en funcionamiento...');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
//# sourceMappingURL=index.js.map