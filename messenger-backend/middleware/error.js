const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  if (process.env.NODE_ENV === "development") {
    console.log("ERROR: ", err);
    console.log("ERROR-JSON: ", { ...err });
  }

  let errorToSend = {
    errorCode: error.errorCode || 500,
    errorContent: error.errorContent || [
      {
        errorName: "internal_error",
        errorMessage: "Somthing went wrong, please report the incedance.",
      },
    ],
  };

  if (err.kind === "ObjectId") {
    errorToSend = {
      errorCode: 404,
      errorContent: [
        {
          errorName: "invalid_request_error",
          errorMessage: "No such data exists.",
        },
      ],
    };
  }

  res.status(errorToSend.errorCode).json({
    success: false,
    errors: errorToSend.errorContent,
  });
};

module.exports = errorHandler;
