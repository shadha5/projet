const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

//  VALIDATIONS
const {
  validateMessageCreateRequest,
} = require("../validation/sys.validations");

//    LODASH
const _ = require("lodash");

// @desc    GET ALL Conversation
// @route   GET /api/v1/conversations
// @access  PRIVET
exports.getAllConversations = asyncHandler(async (req, res, next) => {
  //  GET ALL conversationS
  const conversations = await global.Conversation.find({
    persons: { $in: [req.session.person_id._id] },
  })
    .populate("persons")
    .populate("messages");

  //  HTTP RESPONSE
  res.status(200).json({
    success: true,
    message: "Conversations has been successfully fetched.",
    data: conversations,
  });
});

// @desc    GET conversation BY ID
// @route   GET /api/v1/conversations/:conversationId
// @access  PRIVET
exports.getConversationById = asyncHandler(async (req, res, next) => {
  //  GET ALL conversationS
  const conversation = await global.Conversation.findOne({
    persons: _.sortBy([req.session.person_id._id, req.params.conversationId]),
  })
    .populate("persons")
    .populate("messages");

  //  RETURN ERROR IF NO DATA
  if (!conversation) {
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
    message: "Conversation has been successfully fetched.",
    data: conversation,
  });
});

// @desc    DELETE conversation BY ID
// @route   GET /api/v1/conversations/:conversationId
// @access  PRIVET
exports.deleteConversationById = asyncHandler(async (req, res, next) => {
  //  DELETE conversation
  await global.Conversation.findOneAndDelete({
    persons: _.sortBy([req.session.person_id._id, req.params.conversationId]),
  });

  //  HTTP RESPONSE
  res.status(200).json({
    success: true,
    message: "Conversation has been successfully deleted.",
  });
});
