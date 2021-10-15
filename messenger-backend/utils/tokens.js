const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");

const getPersonToken = async (session_id) => {
  let token = jwt.sign(
    {
      session_id,
    },
    process.env.SECRET,
    {
      expiresIn: "350d",
    }
  );

  return token;
};

const decodePersonJwt = async (token) => {
  if (!token) {
    return false;
  }

  const decode = jwt.verify(token, process.env.SECRET);

  if (!decode) {
    return false;
  }

  const verifyAlg = jwt_decode(token, { header: true });

  if (verifyAlg.alg !== "HS256") {
    return false;
  }

  return decode;
};

module.exports = {
  getPersonToken,
  decodePersonJwt,
};
