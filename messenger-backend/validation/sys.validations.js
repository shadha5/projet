//  VALIDATIONS
const validateSignupRequest = async ({
  username,
  first_name,
  last_name,
  password,
}) => {
  const errors = [];

  if (!username || (username && username.trim() === "")) {
    errors.push({
      errorName: "invalid_request_error",
      errorMessage: "A person's username is required for registration.",
      errorParam: "username",
    });
  } else {
    const usernameExists = await global.Person.findOne({
      username: username.toLowerCase(),
    });
    if (usernameExists) {
      errors.push({
        errorName: "invalid_request_error",
        errorMessage: "User name already exists.",
        errorParam: "username",
      });
    }
  }

  if (!first_name || (first_name && first_name.trim() === "")) {
    errors.push({
      errorName: "invalid_request_error",
      errorMessage: "A person's first name is required for registration.",
      errorParam: "first_name",
    });
  }

  if (!last_name || (last_name && last_name.trim() === "")) {
    errors.push({
      errorName: "invalid_request_error",
      errorMessage: "A person's last name is required for registration.",
      errorParam: "last_name",
    });
  }

  if (!password || (password && password.trim() === "")) {
    errors.push({
      errorName: "invalid_request_error",
      errorMessage: "Secret password is required for registration.",
      errorParam: "password",
    });
  }

  return errors;
};

const validateSigninRequest = async ({ username, password }) => {
  const errors = [];

  if (!username) {
    errors.push({
      errorName: "invalid_request_error",
      errorMessage: "A person's username is required for registration.",
      errorParam: "username",
    });
  }

  if (!password) {
    errors.push({
      errorName: "invalid_request_error",
      errorMessage: "Secret password is required for registration.",
      errorParam: "password",
    });
  }

  return errors;
};

const validateMessageCreateRequest = async ({ message, receiver }, sender) => {
  const errors = [];

  if (!message || (message && message.trim() === "")) {
    errors.push({
      errorName: "invalid_request_error",
      errorMessage: "A message to send is required.",
      errorParam: "message",
    });
  }

  if (!receiver || (receiver && receiver.trim() === "")) {
    errors.push({
      errorName: "invalid_request_error",
      errorMessage: "A message receiver is required.",
      errorParam: "receiver",
    });
  } else if (receiver === sender) {
    errors.push({
      errorName: "invalid_request_error",
      errorMessage:
        "A message receiver is required and it can not be your self.",
      errorParam: "receiver",
    });
  } else {
    const person = await global.Person.findOne({ _id: receiver });
    if (!person) {
      errors.push({
        errorName: "invalid_request_error",
        errorMessage: "Receiver is not found.",
        errorParam: "receiver",
      });
    }
  }

  return errors;
};
module.exports = {
  validateSignupRequest,
  validateSigninRequest,
  validateMessageCreateRequest,
};
