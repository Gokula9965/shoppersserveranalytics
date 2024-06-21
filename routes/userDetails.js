const express = require("express");
const { registerUser, loginUser, currentUser } = require("../controllers/userData");
const { registerValidation, loginValidation } = require("../middlewares/credentialValidation");
const validateToken = require("../middlewares/validateToken");
const userRouter = express.Router();

userRouter.post('/register', registerValidation, registerUser);
userRouter.post('/login', loginValidation, loginUser);
userRouter.get('/currentUser', validateToken, currentUser);

module.exports = userRouter;