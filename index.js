import express from 'express';
import userRouter from './src/routes/user.js';
import api from  './src/routes/api.js';

const app = express();

app.use(express.json());

app.use(userRouter);
app.use(api);
//run port 3000
const PORT = process.env.PORT || 3000;
app.listen( PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

