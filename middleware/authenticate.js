const jwt = require("jwt-simple");
const moment = require("moment");
const secret = "clave_secreta_curso";

exports.ensureAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "Request lacks authorization header" });
  }

  var token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    var payload = jwt.decode(token, secret);

    if (payload.exp <= moment().unix()) {
      return res.status(401).send({ message: "The token has expired" });
    }
  } catch (ex) {
    console.log(ex);
    return res.status(404).send({ message: "Token not valid" });
  }

  req.user = payload;

  next();
};
