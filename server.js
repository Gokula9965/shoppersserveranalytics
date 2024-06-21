const express = require('express');
const analyticRouter = require('./routes/analyticsRoutes');
const errorHandler = require('./middlewares/errorHandler');
const userRouter = require('./routes/userDetails');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors({ origin:process.env.FRONT_END_URI }));
app.use('/analytics',analyticRouter);
app.use('/user',userRouter);
app.use(errorHandler);
app.listen(process.env.PORT ?? 5000, () => {
    console.log(`server is listening on ${process.env.PORT ?? 5000}`);
})
