const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Search Persons
// @route   POST /api/v1/search
// @access  PRIVET
exports.searchPersons = asyncHandler(async (req, res, next) => {
  //  SEARCH PERSONS
  const result = await global.Person.find({
    $text: { $search: req.body.words },
  });

  //  HTTP RESPONSE
  res.status(200).json({
    success: true,
    message: "Successful search.",
    data: result,
  });
});

// @desc    Search Persons
// @route   POST /api/v1/persons/:personId
// @access  PRIVET
exports.getPersonById = asyncHandler(async (req, res, next) => {
  //  GET PERSON BY ID
  const person = await global.Person.findOne({
    _id: req.params.personId,
  });

  //  RETURN ERROR IF NO DATA
  if (!person) {
    return next(
      new ErrorResponse(
        [
          {
            errorName: "invalid_request_error",
            errorMessage: "No such data exists.",
          },
        ],
        404
      )
    );
  }

  //  HTTP RESPONSE
  res.status(200).json({
    success: true,
    message: "Person has been successfully fetched.",
    data: person,
  });
});
