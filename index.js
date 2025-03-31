import express from 'express';
import userRouter from './src/routes/user.js';


const app = express();

app.use(express.json());

app.use(userRouter);
const PORT = 3000;
app.listen( PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(express.json());
