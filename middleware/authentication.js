import response from "../utils/response.js";

import db from "../models/index.js";

const Authentication = async (req, res, next) => {
  try {
    const bearerToken = req.headers["authorization"];
    let accessToken;
    if (bearerToken) {
      accessToken = bearerToken.split(" ")[1];
    }
    const Accesstoken = await db["accessToken"].findOne({
      accessToken: accessToken,
    });
    if (Accesstoken) {
      // console.log(Accesstoken)
      req.user = await db["user"].findById(Accesstoken.userId);
      // console.log(req.user);
      next();
    } else {
      res.status(401).send({
        mesage: "token expired",
        type: "invalid request",
        statusCode: 401,
        data: {},
      });
    }
  } catch (err) {
    console.log(err);
  }
};
export default Authentication;
