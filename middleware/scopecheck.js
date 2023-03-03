import response from "../utils/response.js";

import db from "../models/index.js";
import constant from "../constant.js";

const scopeCheck = {
  async user(req, res, next) {
    try {
      const bearerToken = req.headers["authorization"];
      let accessToken;
      if (bearerToken) {
        accessToken = bearerToken.split(" ")[1];
      }
      console.log(accessToken);
      const Accesstoken = await db["accessToken"].findOne({
        accessToken: accessToken,
      });
      if (!Accesstoken) {
        return res.status(401).send({
          mesage: "token expired",
          type: "invalid request",
          statusCode: 401,
          data: {},
        });
      }

      let userId = Accesstoken.userId;

      let user = await db["user"].findById(userId);
      if (!user) {
        return res.status(401).send({
          mesage: "Invalid user",
          type: "invalid request",
          statusCode: 401,
          data: {},
        });
      }
      if (user.scope == constant.scope.user) {
        next();
      } else {
        return res.status(401).send({
          mesage: "not authorized to view this content",
          type: "invalid request",
          statusCode: 401,
          data: {},
        });
      }
    } catch (err) {
      return res.status(500).send({
        mesage: "Someting went wrong",
        type: "error",
        statusCode: 500,
        data: err,
      });
    }
  },
  async admin(req, res, next) {
    try {
      const bearerToken = req.headers["authorization"];
      let accessToken;
      if (bearerToken) {
        accessToken = bearerToken.split(" ")[1];
      }

      const Accesstoken = await db["accessToken"].findOne({
        accessToken: accessToken,
      });

      if (!Accesstoken) {
        return res.status(401).send({
          mesage: "token expired",
          type: "invalid request",
          statusCode: 401,
          data: {},
        });
      }

      let userId = Accesstoken.userId;
      let user = await db["user"].findById(userId);
      if (!user) {
        return res.status(401).send({
          mesage: "Invalid user",
          type: "invalid request",
          statusCode: 401,
          data: {},
        });
      }
      if (user.scope == constant.scope.admin) {
        next();
      } else {
        return res.status(401).send({
          mesage: "not authorized to view this content",
          type: "invalid request",
          statusCode: 401,
          data: {},
        });
      }
    } catch (err) {
      return res.status(500).send({
        mesage: "Someting went wrong",
        type: "error",
        statusCode: 500,
        data: err,
      });
    }
  },
};
export default scopeCheck;
