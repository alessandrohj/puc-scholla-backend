import jwt from "jsonwebtoken";

const jwtPrivateKey = "mySuperSecretKey"; //TODO: transform it into env variable

const parseToken = function (headerValue) {
  if (headerValue) {
    const [type, token] = headerValue.split(' ')
    if (type === 'Bearer' && typeof token !== 'undefined') {
      return token
    }
  }
  return undefined
}

export default function (req, res, next) {
  const token = parseToken(req.header("Authorization"));
  if (!token) {
    return res
      .status(401)
      .send({ status: "400", message: "Authentication failed" });
  }

  try {
    const payload = jwt.verify(token, jwtPrivateKey, {algorithms: ['HS256']});
    req.user = { _id: payload.uid };

    next();
  } catch (err) {
    res.status(400).json({
      status: "400",
      title: "Error while authenticating",
      message: "Invalid Bearer Token",
    });
  }
}
