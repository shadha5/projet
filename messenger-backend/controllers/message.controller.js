const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

//  VALIDATIONS
const {
  validateMessageCreateRequest,
} = require("../validation/sys.validations");

//    LODASH
const _ = require("lodash");

// @desc    Send a message
// @route   POST /api/v1/messages
// @access  PRIVET
exports.sendMessage = asyncHandler(async (req, res, next) => {
  //  VALIDATION
  const errors = await validateMessageCreateRequest(
    { ...req.body },
    req.session.person_id._id
  );

  //  RETURN ERROR IN CASE
  if (errors.length > 0) {
    return next(new ErrorResponse(errors, 400));
  }

  //  ASSIGN DATA
  const { receiver, message } = req.body;

  //  VERIFY IF THERE IS A RELATION
  let relation = await global.Relation.findOne({
    persons: _.sortBy([req.session.person_id._id, receiver]),
  });

  //  IF NO RELATION CREATE ONE
  if (!relation) {
    relation = await global
      .Relation({
        persons: _.sortBy([req.session.person_id._id, receiver]),
        source: req.session.person_id._id,
        created: Math.floor(Date.now() / 1000),
      })
      .save();
  }

  //  VERIFY IF THERE IS A CONVERSATION
  let conversation = await global.Conversation.findOne({
    persons: _.sortBy([req.session.person_id._id, receiver]),
  });

  //  IF NO CONVERSATION CREATE ONE
  if (!conversation) {
    conversation = await global
      .Conversation({
        persons: _.sortBy([req.session.person_id._id, receiver]),
        created: Math.floor(Date.now() / 1000),
        updated: Math.floor(Date.now() / 1000),
      })
      .save();
  }

  //  CREATE NEW MESSAGE
  const messageData = await global
    .Message({
      conversation: conversation._id,
      created: Math.floor(Date.now() / 1000),
      sender: req.session.person_id._id,
      receiver,
      message,
    })
    .save();

  //   SOURCE DIFF FROM CURRENT PERSON SET RELTION TO
  //  FRIENDS
  if (relation.source.toString() !== req.session.person_id._id.toString()) {
    if (relation.type !== "friends") {
      await global.Relation.findOneAndUpdate(
        { _id: relation._id },
        { $set: { type: "friends" } }
      );
    }
  }

  //  PUSH IT TO CONVERSATION
  await global.Conversation.findOneAndUpdate(
    {
      _id: conversation._id,
    },
    {
      $set: {
        messages: [...conversation.messages, messageData._id],
        updated: Math.floor(Date.now() / 1000),
      },
    }
  );

  //  HTTP RESPONSE
  res.status(200).json({
    success: true,
    message: "Message has been successfully sent.",
    data: messageData,
  });
});

// @desc    Send a message
// @route   POST /api/v1/messages/:messageId
// @access  PRIVET
exports.deleteMessage = asyncHandler(async (req, res, next) => {
  //  DELETE MESSAGE
  await global.Message.findOneAndDelete({
    _id: conversation._id,
  });

  //  HTTP RESPONSE
  res.status(200).json({
    success: true,
    message: "Message has been successfully deleted.",
  });
});
