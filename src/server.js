const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
const HttpException = require('./utils/HttpException.utils');
const errorMiddleware = require('./middleware/error.middleware');
const userRouter = require('./routes/user.route');
const stockMovementRouter = require('./routes/stockMovement.route');
const currentStockRouter=require('./routes/currentStock.route');
const categoryRouter=require('./routes/category.route');
const productRouter=require('./routes/product.route');
const regionRouter = require('./routes/region.route');

// Init express
const app = express();
// Init environment
dotenv.config();
// parse requests of content-type: application/json
app.use(express.json());
// enabling cors for all requests by using cors middleware
app.use(cors());
// Enable pre-flight
app.options("*", cors());

const port = Number(process.env.PORT || 3331);

// Mount user routes
app.use('/api/v1/users', userRouter);

// Mount stock movement routes
app.use('/api/v1/stock_movements/', stockMovementRouter);

app.use('/api/v1/current_stock',currentStockRouter);

app.use('/api/v1/categories/',categoryRouter);

app.use('/api/v1/products',productRouter);

// Mount region routes
app.use('/api/v1/regions', regionRouter);


// 404 error
app.all('*', (req, res, next) => {
    const err = new HttpException(404, 'Endpoint Not Found');
    next(err);
});

// Error middleware
app.use(errorMiddleware);

// starting the server
app.listen(port, () =>
    console.log(`🚀 Server running on port ${port}!`)
);

module.exports = app;