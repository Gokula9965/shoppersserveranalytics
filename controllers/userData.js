const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const analyticsUserSchema = require("../analyticsUserSchema");
const jwt = require("jsonwebtoken");
const registerUser = asyncHandler(async (req, res) => {
    const { userName, emailId, password } = req?.body;
    if (!userName || !emailId || !password) {
        res.status(400)
        throw new Error("All fields are username,emailId and password are required");
    }
    const userResponse = await analyticsUserSchema.findOne({ emailId });
    if (userResponse && userResponse?.emailId === emailId)
    {
        res.status(400)
        throw new Error("Already an user exist");  
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await analyticsUserSchema.create({
        userName,
        emailId,
        password: hashedPassword
    });
    res.status(200).json({ message: "New user created successfully", newUser });
});
const loginUser = asyncHandler(async (req, res) => {
    const { emailId, password } = req?.body;
    if (!emailId || !password) {
        res.status(400)
        throw new Error("All fields emailId and password are required");
    }
    const userResponse = await analyticsUserSchema.findOne({ emailId });
    if ((userResponse) && (userResponse?.emailId === emailId) && (await bcrypt.compare(password, userResponse?.password)))
    {
        const accessToken = jwt.sign({
        user: {
            userName: userResponse.userName,
            emailId: userResponse.emailId,
            id: userResponse.id
        }
    }, process.env.ACCESS_TOKEN_SCERET, { expiresIn: "60m" });
    res.status(200).json({ accessToken }); 
    }
    else {
        res.status(400)
        throw new Error("Incorrect email or password");
    }
})
const currentUser = asyncHandler(async (req, res) => {
    res.status(200).send(req?.user);
})
module.exports = {registerUser,loginUser,currentUser};