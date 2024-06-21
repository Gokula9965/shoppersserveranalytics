const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const client = await mongoose.connection.getClient();
        const db =await client.db();
        return db;
    }
    catch (error)
    {
        console.log('Error in connecting the DB', error);
        process?.exit(1);
    }
}

module.exports = connectDB;