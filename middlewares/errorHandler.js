const constants = require("../errorCodes");

const errorHandler = async (error,req, res, next) => {
    const statusCode = res?.statusCode ?? 500;
    switch (statusCode) {
        case constants.UNAUTHORIZED:
            res.json({
                title: "Unauthorized error",
                message: error?.message
            });
            break;
        case constants.VALIDATION_ERROR: 
            res.json({
                title: "Validation Error",
                message: error?.message
            });
            break;
        case constants.FORBIDDEN:
            res.json({
                title: 'Forbidden',
                message: error?.message
            });
            break;
        case constants.NOT_FOUND:
            res.json({
                title: 'Not Found',
                message: error?.message
            });
            break;
        case constants.INTERNAL_SERVER_ERROR:
            res.json({
                title: "Internal server error",
                message: error?.message
            });
            break;
        default:
            console.log("All fine no issues");
            break;
   
    }
}
module.exports = errorHandler;