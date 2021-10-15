const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

//  VALIDATIONS
const {
  validateMessageCreateRequest,
} = require("../validation/sys.validations");

//    LODASH
const _ = require("lodash");

// @desc    GET ALL CONTACTS
// @route   GET /api/v1/contacts
// @access  PRIVET
exports.getAllContacts = asyncHandler(async (req, res, next) => {
  //  GET ALL CONTACTS
  const contacts = await global.Relation.find({
    persons: { $in: [req.session.person_id._id] },
  }).populate("persons");

  //  HTTP RESPONSE
  res.status(200).json({
    success: true,
    message: "Contacts has been successfully fetched.",
    data: contacts,
  });
});

// @desc    GET CONTACT BY ID
// @route   GET /api/v1/contacts/:contactId
// @access  PRIVET
exports.getContactById = asyncHandler(async (req, res, next) => {
  //  GET ALL CONTACTS
  const contact = await global.Relation.findOne({
    persons: _.sortBy([req.session.person_id._id, req.params.contactId]),
  }).populate("persons");

  //  RETURN ERROR IF NO DATA
  if (!contact) {
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
    message: "Contact has been successfully fetched.",
    data: contact,
  });
});

// @desc    DELETE CONTACT BY ID
// @route   GET /api/v1/contacts/:contactId
// @access  PRIVET
exports.deleteContactById = asyncHandler(async (req, res, next) => {
  //  DELETE CONTACT
  await global.Relation.findOneAndDelete({
    persons: _.sortBy([req.session.person_id._id, req.params.contactId]),
  });

  //  HTTP RESPONSE
  res.status(200).json({
    success: true,
    message: "Contact has been successfully deleted.",
  });
});
