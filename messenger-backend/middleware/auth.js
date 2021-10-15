const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

//  TOKENS
const { decodePersonJwt } = require("../utils/tokens");

// Check if session is active
exports.isActive = asyncHandler(async (req, res, next) => {
  //  VERIFY SESSION
  let token = await decodePersonJwt(req.cookies.token);

  if (!token) {
    return next(
      new ErrorResponse(
        [
          {
            errorName: "authentication_error",
            errorMessage: "Please sign in.",
            requiredAction: "login",
          },
        ],
        401
      )
    );
  }

  //  Fetch new session
  const session = await global.Session.findOne({
    _id: token.session_id,
  }).populate("person_id");

  if (!session) {
    //  ONCE HEADER IS SET THERE ARE NO CHANCE THAT SESSIONID TO BE UNDEFINED OR EMPTY
    //  ACTION WILL BE UNDER INVESTIGATION
    //  EXECUTE...
    return next(
      new ErrorResponse(
        [
          {
            errorName: "authentication_error",
            errorMessage: "Session expired please login.",
            requiredAction: "login",
          },
        ],
        401
      )
    );
  } else if (!session.active) {
    return next(
      new ErrorResponse(
        [
          {
            errorName: "authentication_error",
            errorMessage: "Session expired please login.",
            requiredAction: "login",
          },
        ],
        401
      )
    );
  }

  req.session = session;
  return next();
});
