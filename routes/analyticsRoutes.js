const express = require("express");
const connectDB = require("../connectionDB");
const validateToken = require("../middlewares/validateToken");
const { orderAnalytics, customersAnalytics, productsAnalytics, customerOrdersAnalytics, priceAnalytics, downLoadCsv, updateStock } = require("../controllers/analytics");
const analyticRouter = express.Router();
let dbName;
(async () => {
    try {
        dbName = await connectDB();
        console.log("Databse connected sucessfully")
    }
    catch (error) {
        console.log(error);
    }
})();

analyticRouter.get("/orders",validateToken, (req, res) => orderAnalytics(req, res, dbName))
analyticRouter.get("/categorySums",validateToken, (req, res) => priceAnalytics(req, res, dbName));
analyticRouter.get("/customer?", validateToken,(req, res) => customersAnalytics(req, res, dbName));
analyticRouter.get("/customer/orderAnalytics", validateToken, (req, res) => customerOrdersAnalytics(req, res, dbName));
analyticRouter.get("/products", validateToken,(req, res) => productsAnalytics(req, res, dbName))
analyticRouter.get("/download-csv", validateToken,(req, res) => downLoadCsv(req, res, dbName));
analyticRouter.patch("/products/:id",validateToken,(req, res) => updateStock(req, res, dbName));
module.exports = analyticRouter;    