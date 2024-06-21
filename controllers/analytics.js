const asyncHandler = require("express-async-handler");
const { db } = require("../analyticsUserSchema");
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
const transformData = require("./csvContent");
const { ObjectId } = require("mongodb");
const orderAnalytics = asyncHandler(async (req, res, dbName) => {
    const ordersCount = await dbName?.collection('customerschemas').find().count();
    const inventoryCount = await dbName?.collection('products').find().count();
    const customersCount = await dbName?.collection('userschemas').find().count();
    const totalRevenue = await dbName?.collection('customerschemas').aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }, {
        $project: { _id: 0, total: 1 }
    }]).toArray();
    if (ordersCount && inventoryCount && customersCount && totalRevenue[0]?.total)
    {
        res.status(200).json({ ordersCount ,inventoryCount,customersCount,totalRevenue:totalRevenue[0].total});  
    }
    else {
        res.status(400)
        throw new Error("Cant reterive the metrics");
    }

});

const priceAnalytics = asyncHandler(async (req, res, dbName) => {
    let { from, to } = req?.query;
    from =from? new Date(from) : new Date();
    to = to?new Date(to) : new Date();
  
    if (isNaN(from.getTime()) || isNaN(to.getTime()))
    {
        return res.status(400).json({ msg: "date must be valid" }); 
    }
    if (from > to)
    {
        return res.status(400).json({ msg:"From date must be less than to date"}); 
    }
    from.setUTCHours(0, 0, 0, 0);
    to.setUTCHours(23, 59, 59, 999);
    const mensCategory = await dbName.collection("customerschemas").aggregate([
        {
            $match: {
                orderedAt: { $gte: from, $lte: to }
            }
        },
        {
            $unwind: '$customerItems'
        },
        {
            $match: { 'customerItems.category': 'mens' }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: { $multiply: ['$customerItems.price', '$customerItems.quantity'] } }
            }
        },
        {
            $project: {
                _id: 0,
                totalAmount:1
            }
        }
    ]).toArray();
    const womenCategory = await dbName.collection("customerschemas").aggregate([
        {
            $match: {
                orderedAt: { $gte: from, $lte: to }
            }
        },
        {
            $unwind: '$customerItems'
        },
        {
            $match: { 'customerItems.category': 'womens' }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: { $multiply: ['$customerItems.price', '$customerItems.quantity'] } }
            }
        },
        {
            $project: {
                _id: 0,
                totalAmount:1
            }
        }
    ]).toArray();
    const beauty = await dbName.collection("customerschemas").aggregate([
        {
            $match: {
                orderedAt: { $gte: from, $lte: to }
            }
        },
        {
            $unwind: '$customerItems'
        },
        {
            $match: { 'customerItems.category': 'beauty' }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: { $multiply: ['$customerItems.price', '$customerItems.quantity'] } }
            }
        },
        {
            $project: {
                _id: 0,
                totalAmount:1
            }
        }
    ]).toArray();
    const smartset = await dbName.collection("customerschemas").aggregate([
        {
            $match: {
                orderedAt: { $gte: from, $lte: to }
            }
        },
        {
            $unwind: '$customerItems'
        },
        {
            $match: { 'customerItems.category': 'smart' }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: { $multiply: ['$customerItems.price', '$customerItems.quantity'] } }
            }
        },
        {
            $project: {
                _id: 0,
                totalAmount:1
            }
        }
    ]).toArray();
    const sports = await dbName.collection("customerschemas").aggregate([
        {
            $match: {
                orderedAt: { $gte: from, $lte: to }
            }
        },
        {
            $unwind: '$customerItems'
        },
        {
            $match: { 'customerItems.category': 'sports' }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: { $multiply: ['$customerItems.price', '$customerItems.quantity'] } }
            }
        },
        {
            $project: {
                _id: 0,
                totalAmount:1
            }
        }
    ]).toArray();
    const groceries = await dbName.collection("customerschemas").aggregate([
        {
            $match: {
                orderedAt: { $gte: from, $lte: to }
            }
        },
        {
            $unwind: '$customerItems'
        },
        {
            $match: { 'customerItems.category': 'groceries' }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: { $multiply: ['$customerItems.price', '$customerItems.quantity'] } }
            }
        },
        {
            $project: {
                _id: 0,
                totalAmount:1
            }
        }
    ]).toArray();
    const decorify = await dbName.collection("customerschemas").aggregate([
        {
            $match: {
                orderedAt: { $gte: from, $lte: to }
            }
        },
        {
            $unwind: '$customerItems'
        },
        {
            $match: { 'customerItems.category': 'decorify' }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: { $multiply: ['$customerItems.price', '$customerItems.quantity'] } }
            }
        },
        {
            $project: {
                _id: 0,
                totalAmount:1
            }
        }
    ]).toArray();
    const homeAppliances = await dbName.collection("customerschemas").aggregate([
        {
            $match: {
                orderedAt: { $gte: from, $lte: to }
            }
        },
        {
            $unwind: '$customerItems'
        },
        {
            $match: { 'customerItems.category': 'appliances' }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: { $multiply: ['$customerItems.price', '$customerItems.quantity'] } }
            }
        },
        {
            $project: {
                _id: 0,
                totalAmount:1
            }
        }
    ]).toArray();
    res.status(200).send({ mens: mensCategory[0]?.totalAmount *84 , womens: womenCategory[0]?.totalAmount * 84 , beauty: beauty[0]?.totalAmount * 84, smart: smartset[0]?.totalAmount * 84, sports: sports[0]?.totalAmount * 84, groceries: groceries[0]?.totalAmount * 84, decorify: decorify[0]?.totalAmount * 84, homeAppliances: homeAppliances[0]?.totalAmount * 84 });
  });
  
const customersAnalytics = asyncHandler(async (req, res, dbName) => {
    let { from, to } = req?.query;
    from =from? new Date(from) : new Date("2024-06-01");
    to = to?new Date(to) : new Date();
  
    if (isNaN(from.getTime()) || isNaN(to.getTime()))
    {
        return res.status(400).json({ msg: "date must be valid" }); 
    }
    if (from > to)
    {
        return res.status(400).json({ msg:"From date must be less than to date"}); 
    }
    from.setUTCHours(0, 0, 0, 0);
    to.setUTCHours(23, 59, 59, 999);
    const customerDatas = await dbName?.collection('customerschemas').find({
        orderedAt: {
            $gte: from,
            $lte:to
        }
    }, { projection: {  customerId: 0, __v: 0, tax: 0 } }).toArray();
    if (customerDatas) {
        return res.status(200).json({ customerDatas });
    }
    else {
      
      return  res.status(400).json({ msg:"No data found"}); 
    }
});

const productsAnalytics = asyncHandler(async (req, res,dbName) => {
    const productsData = await dbName?.collection('products')?.find({}, { projection: { title: 1, category: 1, price: 1, rating: 1, stock: 1, brand: 1, thumbnail: 1,_id:1 } })?.toArray();
    if (productsData)
    {
       return res.status(200).json({productsData})
    }
    else {
        return res.status(400).json({ message: "No data is found related to products" }); 
    }
});

const customerOrdersAnalytics = asyncHandler(async (req, res, dbName) => {
    let { from, to } = req?.query;
    from =from? new Date(from) : new Date();
    to = to?new Date(to) : new Date();
  
    if (isNaN(from.getTime()) || isNaN(to.getTime()))
    {
        return res.status(400).json({ msg: "date must be valid" }); 
    }
    if (from > to)
    {
        return res.status(400).json({ msg:"From date must be less than to date"}); 
    }
    from.setUTCHours(0, 0, 0, 0);
    to.setUTCHours(23, 59, 59, 999);
    const customerDatas = await dbName?.collection('customerschemas').find({
        orderedAt: {
            $gte: from,
            $lte:to
        }
    }, { projection: {orderId:1,customerItems:1} }).toArray();
    if (customerDatas) {
        return res.status(200).json({ customerDatas });
    }
    else {
      
      return  res.status(400).json({ msg:"No data found"}); 
    }   
});

const downLoadCsv = asyncHandler(async (req, res, dbName) => {
    let { from, to } = req?.query;
    from =from? new Date(from) : new Date("2024-06-01");
    to = to?new Date(to) : new Date();
  
    if (isNaN(from.getTime()) || isNaN(to.getTime()))
    {
        return res.status(400).json({ msg: "date must be valid" }); 
    }
    if (from > to)
    {
        return res.status(400).json({ msg:"From date must be less than to date"}); 
    }
    from.setUTCHours(0, 0, 0, 0);
    to.setUTCHours(23, 59, 59, 999);
    const customerDatas = await dbName?.collection('customerschemas').find({
        orderedAt: {
            $gte: from,
            $lte:to
        }
    }, { projection: { customerId: 0, __v: 0, tax: 0 } }).toArray();
    const transformedData = transformData(customerDatas);
    const fields = [
        'orderId', 
        'Name', 
        'Address', 
        'Email', 
        'PhoneNumber', 
        {
            label: 'OrderDetails.OrderedAt',
            value: 'OrderDetails.OrderedAt'
        },
        {
            label: 'OrderDetails.ProductName',
            value: 'OrderDetails.ProductName'
        },
        {
            label: 'OrderDetails.Quantity',
            value: 'OrderDetails.Quantity'
        },
        {
            label: 'OrderDetails.Price',
            value: 'OrderDetails.Price'
        },
        'TotalAmount'
    ];
    const opts = { fields };

    try {
        const parser = new Parser(opts);
        const csv = parser.parse(transformedData);

 
        const filePath = path.join(__dirname, 'orders.csv');
        fs.writeFileSync(filePath, csv);

        res.download(filePath, 'orders.csv', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                return res.status(500).send('Error downloading file');
            }
           
            fs.unlinkSync(filePath);
        });
    } catch (err) {
        console.error('Error creating CSV:', err);
        return res.status(500).send('Error creating CSV');
    }
});

const updateStock = asyncHandler(async (req, res, dbName) => {
    const { id } = req.params;
    const newStock = req?.body?.newStock;
    
    try {
    
        const result = await dbName.collection("products").updateOne(
            { _id: new ObjectId(id) },
            { $set: { stock: newStock } }
        );

        if (result.modifiedCount === 1) {
            console.log("Stock updated successfully");
            return res.status(200).json({ message: "Stock updated successfully" });
        } else {
            console.error("Failed to update stock");
            return res.status(500).json({ message: "Failed to update stock" });
        }
    } catch (err) {
        console.error("Error updating stock:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = { orderAnalytics ,customersAnalytics,productsAnalytics,customerOrdersAnalytics,priceAnalytics,downLoadCsv,updateStock};