const joi = require("joi");
const asyncHandler = require("express-async-handler");

const registerValidation = asyncHandler(async (req, res, next) => {
    const registerSchema = joi.object({
        userName: joi.string().required(),
        emailId: joi.string().email().required(),
        password: joi.string().required()
    });
    const { error } = registerSchema.validate(req?.body);
    if (error) {
        res.status(400)
        throw new Error(error?.details[0]?.message);
    }
    next();
});

const loginValidation = asyncHandler(async (req, res, next) => {
    const loginSchema = joi.object({
        emailId: joi.string().email().required(),
        password: joi.string().required()
    });
    const { error } = loginSchema.validate(req?.body);
    if (error) {
        res.status(400)
        throw new Error(error?.details[0]?.message);
    }
    next();
});

module.exports = { registerValidation, loginValidation };