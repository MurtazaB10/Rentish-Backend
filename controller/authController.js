import { randomBytes } from "crypto";
import { ObjectId } from "mongodb";
import { compare, hash } from "bcrypt";
import db from "../models/index.js";
import response from "../utils/response.js";
import helper from "../utils/helper.js";
import constant from "../constant.js";
import mongoose from "mongoose";

class auth {
  constructor() {}

  signUp = async (req, callback) => {
    try {
      let scope;
      // console.log("body=   " + req);
      const email = req.body.email;
      const name = req.body.username;
      const password = await hash(req.body.password, 10);
      const phonenumber = req.body.phonenumber;
      const address = req.body.address;

      if (req.body.scope == "user") {
        scope = constant.scope.user;
      } else if (req.body.scope == "admin") {
        scope = constant.scope.admin;
      }
console.log(req.username);
      let user = await db["user"].findOne({ email: email });

      if (user) {
        throw Error("email already exist");
      }

      const newuser = new db["user"]({
        username: name,
        email: {
          value: email,
          isVer: false,
        },
        password: password,
        phonenumber: {
          value: phonenumber,
          isVer: false,
        },
        address: address,
        scope: scope,
      });
      await newuser.save();

      callback(response("success", "user created", newuser));
    } catch (err) {
      callback(response("error", "something went wrong", err));
    }
  };
  login = async (req, callback) => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      let user = await (
        await db["user"].find()
      ).find((user) => {
        return user.email.value == email;
      });
      if (!user) {
        callback(response("error", "Email does not exist", {}));
      }
      let isPasswordRight = await this.comparePassword(password, user.password);

      if (isPasswordRight) {
        console.log("rigyht pass");
        const accessToken = this.createToken();
        const refreshToken = this.createToken();
        const userId = user._id;
        db["accessToken"].deleteMany({ userId: userId });
        db["refreshToken"].deleteMany({ userId: userId });
        console.log("going in saveaccesstoken");
        this.saveAccessToken(accessToken, userId);
        this.saveRefreshToken(refreshToken, userId);
        callback(
          response("success", "Login successfully", {
            accessToken: "bearer " + accessToken,
            refreshToken: "bearer " + refreshToken,
          })
        );
      } else {
        return callback(response("error", "Wrong Password", {}));
      }
    } catch (err) {
      callback(response("error", "something went wrong", { err }));
    }
  };
  logout = async (req, callback) => {
    try {
      console.log("in log");
      const bearerToken = req.headers["authorization"];

      let accessToken;
      if (bearerToken) {
        accessToken = bearerToken.split(" ")[1];
      }
      let Accesstoken = await db["accessToken"].findOne({
        accessToken: accessToken,
      });
      let userId = Accesstoken?.userId;
      await db["accessToken"].deleteOne({ userId: userId });
      await db["refreshToken"].deleteOne({ userId: userId });

      callback(response("success", "Logout successfully", {}));
    } catch (err) {
      callback(response("error", "something went wrong", { err }));
    }
  };

  createGoogleuser = async (accessToken, refreshToken, profile, cb) => {
    let name = profile._json.name;
    let email = profile._json.email;
    let emailisverified = profile._json.email_verified;
    const newuser = new db["user"]({
      username: name,
      email: email,
      // password: password,
      // phonenumber:phonenumber,
      // address:address,
      scope: constant.scope.user,
    });

    cb(newuser);
  };
  checkRefreshToken = async (req, callback) => {
    try {
      const bearerToken = req.headers["authorization"];
      console.log(bearerToken);
      let refreshtoken;
      if (bearerToken) {
        refreshtoken = bearerToken.split(" ")[2];
      }
      console.log("rt" + refreshtoken);
      let Refreshtoken = await db["refreshToken"].findOne({
        refreshToken: refreshtoken,
      });
      console.log("RT" + Refreshtoken);
      if (!Refreshtoken) {
        return callback(response("error", "token expired", {}));
      }
      let userId = Refreshtoken.userId;
      await db["accessToken"].deleteOne({ userId: userId });
      await db["refreshToken"].deleteOne({ userId: userId });
      let accessToken = this.createToken();
      let refreshToken = this.createToken();
      this.saveAccessToken(accessToken, userId);
      callback(
        response("success", "Tokens Revoked", {
          accessToken: "bearer " + accessToken,
          refreshToken: "bearer  " + refreshToken,
        })
      );
    } catch (err) {
      callback(response("error", "something went wrong", err));
    }
  };

  //------------------------------------------------------------------------------------------------------
  createToken = () => {
    return randomBytes(50).toString("base64");
  };

  forgotPassword = async (req, callback) => {
    const { email } = req.body;
    if (!email) throw Error("please provide valid email");
    const user1 = await db["user"].find();
    console.log(user1+"hey56");
    let user ={};
    for (let index = 0; index < user1.length; index++) {
      if(user1[index].email.value==email){
        user=user1[index];
        break;
      }
      
    }
    // console.log(user._id+"het45");
    if (user==undefined) throw Error("user not found");
    const token = await db["resetToken"].findOne({ owner: user._id });
    if (token) throw Error("you can request token after an hour");
    const token2 = this.createToken();
    console.log(user._id+"hey")
    const resettoken = new db["resetToken"]({
      owner: user._id,
      token: token2,
    });
    await resettoken.save();
    const url = `http://localhost:3000/reset/${token2}/${user._id}`;
    helper.sendMail(
      user.email.value,
      "update password ",
      "click on the below given url to create new  password",
      `<p>click <a href=${url}>here</a>
      </p>`
      );
      callback(
        response("success", "reset password link sent to your email", user._id)
    );
  };

  resetPassword = async (req, callback) => {
    console.log("in auth resset");
    const { password, id } = req.body;
    if (!password || !id) throw Error("password or id param not found");
    const user = await db["user"].findById(id);
    if (!user) throw Error("user not found");
    user.password = await hash(password, 10);
    await user.save();
    const url = "";
    console.log(id,password)
    helper.sendMail(
      user.email.value,
      "password updated ",
      `  mr ${user.name} your account Password changed at ${Date.now()}`,
      `<p>if you havent changed the password report to ${url}
    </p>`
    );
    callback(response("success", "password changed", user._id));
  };

  saveAccessToken = async (accessToken, userId) => {
    console.log("in saveaccesstoken");
    const ex = Date.now() + 1000 * 60 * 60;
    const Token = new db["accessToken"]({
      accessToken: accessToken,
      expiry: ex,
      userId: userId,
    });

    await Token.save();
  };
  saveRefreshToken = (refreshToken, userId) => {
    const ex = Date.now() + 1000 * 60 * 60 * 24 * 7;
    const Token = new db["refreshToken"]({
      refreshToken: refreshToken,
      expiry: ex,
      userId: userId,
    });
    return Token.save();
  };
  comparePassword = async (password, hash) => {
    try {
      return await compare(password, hash);
    } catch (error) {
      console.log(error);
    }

    return false;
  };
}

export default auth;
