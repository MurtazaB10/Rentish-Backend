import { hash } from "bcrypt";
import auth from "./authController.js";
import db from "../models/index.js";
import uploader from "../middleware/upload.js";
import response from "../utils/response.js";
import helper from "../utils/helper.js";
import mongoose from "mongoose";
import { pan, aadhaar } from "validate-india";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import { compare } from "bcrypt";
dotenv.config();

class UserController {
  updateUser = async (req, callback) => {
    const id = req.user._id;
    const user = await db["user"].findOne({ _id: id });
    console.log(req.body.name);
    user.username = req.body.firstname + " " + req.body.lastname;
    user.address = req.body.address;
    if (req.body.email) {
      user.email.value = req.body.email;
      user.email.isVer = false;
    }
    if (req.body.phonenumber) {
      user.phonenumber.value = req.body.phonenumber;
      user.phonenumber.isVer = false;
    }
    await user.save();
    console.log(user);
    callback(response("success", "user updated", user));
  };

  getUser = async (req, callback) => {
    try {
      const user = await db.user
        .findById(req.user._id)
        .populate("cart.items.productId")
        .populate("favouriteProducts.items.productId");
      return callback(response("success", "user retrieved successfully", user));
    } catch (error) {
      console.log(error);
      callback(response("error", "error while fetching user", error));
    }
  };

  generateemailotp = async (req, callback) => {
    console.log("in genaratadu");
    const id = req.user._id;
    const OTP = helper.generateOtp();
    const token = await hash(OTP, 10);
    const user = await db["user"].findById(id);
    if (user.email.isVerified)
      callback(response("error", "already verified ", {}));
    const newemailverificationtoken = new db["verificationToken"]({
      owner: id,
      token: token,
    });
    await newemailverificationtoken.save();
    helper.sendMail(
      user.email.value,
      "email Verification",
      "verify your email by entering the OTP given below in verfication panel",
      `<h1>${OTP}</h1>`
    );
    callback(response("success", "Token sent successfully", { _id: id }));
  };
  verifyEmail = async (req, callback) => {
    const { OTP } = req.body;
    const id = req.user._id;
    console.log(OTP);
    if (!id || !OTP.trim())
      callback(response("invalid request", " missing parameters!", {}));
    if (!mongoose.isValidObjectId(id))
      callback(response("invalid request", " invalid userId!", {}));
    const user = await db["user"].findById(id);
    if (!user) {
      console.log("in user");
      callback(response("error", "invalid OTP ", {}));
    }
    if (user.email.isVerified)
      callback(response("error", "already verified ", {}));
    const token = await db["verificationToken"].findOne({ owner: id });
    if (!token && token === null)
      callback(response("error", "otp not genrerated yet ", {}));
    console.log(token);
    const isVerified = await compare(OTP, token.token);
    if (!isVerified) callback(response("error", "invalid OTP ", {}));
    user.email.isVer = true;
    await user.save();
    await db["verificationToken"].deleteMany({ owner: id });
    helper.sendMail(
      user.email.value,
      "email Verified",
      "Welcome to Rentish Family",
      `<h1>                     OUR MOJO</h1>
           <h2>                     GO RENTAL</h2>`
    );
    callback(response("success", "User Verified", user));
  };

  //------------------------------------------------------------------------------------------------------
  generatephonenumberotp = async (req, callback) => {
    const id = req.user._id;
    const OTP = helper.generateOtp();
    console.log(OTP);
    const token = await hash(OTP, 10);
    const newphoneverificationtoken = new db["verificationToken"]({
      owner: id,
      token: token,
    });
    const user = await db["user"].findById(id);
    if (user.phonenumber.isVer)
      callback(response("invalidRequest", "account already verified", {}));
    await newphoneverificationtoken.save();
    console.log(newphoneverificationtoken);

    helper.sendSMS(
      user.phonenumber.value,
      ` your Rentish verification token is ${OTP}`
    );
    callback(response("success", "Token sent successfully", { _id: id }));
  };
  verifyPhonenumber = async (req, callback) => {
    const { OTP } = req.body;
    const id = req.user._id;
    if (!id || !OTP.trim())
      callback(response("invalid request", " missing parameters!", {}));
    if (!mongoose.isValidObjectId(id))
      callback(response("invalid request", " invalid userId!", {}));
    const user = await db["user"].findById(id);
    if (!user) {
      callback(response("invalid request", " user not found", {}));
    }
    if (user.phonenumber.isVer)
      callback(response("invalid request", " account already verified", {}));
    const token = await db["verificationToken"].findOne({ owner: id });
    console.log("====================================");
    console.log(token);
    console.log("====================================");
    if (!token) callback(response("error", "invalid OTP ", {}));
    const isVerified = await compare(OTP, token.token);
    if (!isVerified) callback(response("error", "invalid OTP ", {}));
    user.phonenumber.isVer = true;
    await user.save();
    await db["verificationToken"].deleteMany({ owner: id });
    helper.sendSMS(
      user.phonenumber.value,
      ` your phonenumber verified Thanks for becoming a part of rentish. Go Rental!!`
    );
    callback(response("success", "User Verified", user));
  };
  addQuery = async (req, callback) => {
    try {
      const { query, email } = req.body;
      const user = req.user._id;
      const newproduct = new db["query"]({
        user: user,
        querymessage: query,
        email: email,
      });
      newproduct.save();
      return callback(response("success", "added your query", newproduct));
    } catch (err) {
      return callback(response("error", "unable to add your query", err));
    }
  };
  getrazorpaykey = async (req, callback) => {
    try {
      return callback(
        response("success", "razorpaykey extracted", {
          KEY: process.env.RAZORPAY_KEY_ID,
        })
      );
    } catch (err) {
      return callback(response("error", "unable to extract razorpaykey", err));
    }
  };
  payorder = async (req, callback) => {
    try {
      const { amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
        req.body;
      let user = await db["user"].findOne({ _id: req.user._id });
      let duration = user.cart.items[0].duration;
      const createdate = new Date();
      var newDate = new Date(
        createdate.setMonth(createdate.getMonth() + duration)
      );
      const newOrder = new db["order"]({
        user: req.user._id,
        isPaid: true,
        amount: amount,
        razorpay: {
          orderId: razorpayOrderId,
          paymentId: razorpayPaymentId,
          signature: razorpaySignature,
        },
        cart: req.user.cart,
        address: req.user.address,
        returndate: newDate,
      });
      await newOrder.save();
      user.cart.items = [];
      await user.save();
      return callback(response("success", "payment successfull", newOrder));
    } catch (err) {
      return callback(response("error", "unable to make order", err));
    }
  };
  createorder = async (req, callback) => {
    try {
      console.log(process.env.RAZORPAY_KEY_ID);
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
      });
      const options = {
        amount: req.body.amount,
        currency: "INR",
      };
      const order = await instance.orders.create(options);
      if (!order) return callback(response("error", "Some error occured", {}));

      return callback(
        response("success", "order extracted", {
          order,
        })
      );
    } catch (err) {
      return callback(response("error", "unable to extract order", err));
    }
  };
  getCart = async (req, callback) => {
    try {
      console.log(req.user);
      let user = await db["user"]
        .findById(req.user._id)
        .populate("cart.items.productId")
        .populate("favouriteProducts.items.productId");
      console.log(user);
      let total = 0;
      // console.log("here" + user.cart.items[0].productId.rentalprice);
      // for (let i = 0; i < user.cart.items.length-1; i++) {
      //   total +=
      //     user.cart.items[i].productId.rentalprice *
      //     user.cart.items[i].quantity;
      // }

      console.log(user.cart.items[0]);
      if (user.cart.items[0]) {
        console.log(user.cart.items[0].p + "hello");
        return callback(
          response("success", " cart retrieved", { user, total })
        );
      } else {
        return callback(response("success", " cart empty", user));
      }
    } catch (err) {
      return callback(response("error", "cart not retrieved", err));
    }
  };
  addToCart = async (req, res, next, callback) => {
    try {
      let { productId } = req.body;
      let product = await db["product"].findById(productId);
      let user = await db["user"].findById(req.user._id);
      const cartProductIndex = user.cart.items.findIndex((cp) => {
        return cp.productId.toString() === productId.toString();
      });
      let newQuantity = 1;
      const updatedCartItems = [...user.cart.items];

      if (cartProductIndex >= 0) {
        newQuantity = user.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
      } else {
        updatedCartItems.push({
          productId: productId,
          quantity: newQuantity,
        });
      }
      const updatedCart = {
        items: updatedCartItems,
      };
      user.cart = updatedCart;

      await user.save();
      return callback(response("success", "product added to cart", product));
    } catch (err) {
      return callback(response("error", "unable to add to cart", { err }));
    }
  };
  removeCart = async (req, callback) => {
    try {
      let { productId } = req.body;
      let user = await db["user"].findById(req.user._id);
      for (let i = 0; i < user.cart.items.length; i++) {
        if (user.cart.items[i].productId == productId) {
          if (user.cart.items[i].quantity > 1) {
            user.cart.items[i].quantity = user.cart.items[i].quantity - 1;
          } else {
            const updatedCartItems = user.cart.items.filter((item) => {
              return item.productId.toString() !== productId.toString();
            });
            user.cart.items = updatedCartItems;
          }
        }
      }
      await user.save();
      return callback(response("success", "product removed from cart", {}));
    } catch (err) {
      return callback(response("error", "unable to remove from  cart", err));
    }
  };
  validateDocument = async (req, res, next, callback) => {
    try {
      console.log("in validate doc");
      const path = "/public/static/uploads/userdocuments";
      await uploader.fileupload(req, res, path, next);
      console.log("in validate doc 2");
      const documenttype = req.body.documenttype;
      const documentnumber = req.body.documentnumber;
      const id = req.user._id;
      console.log("id " + id);
      const user = await db["user"].findById(id);
      if (!user) callback(response("invalidRequest", "cant find user", {}));
      if (user.validation.documenttype)
        callback(response("invalidRequest", "User already validated ", {}));
      console.log("reached ");
      console.log(documenttype + documentnumber + user);
      if (aadhaar.isValid(documentnumber) || pan.isValid(documentnumber)) {
        user.validation.documenttype = documenttype;
        console.log("reached to updating values");
        user.validation.documentnumber = documentnumber;

        // if (!req.document) {
        //   callback(
        //     response("error", "please upload document in image format", {})
        //   );
        // }
        // console.log(req.document);
        // user.validation.path = req.document.path;
        await user.save();
        callback(response("success", "User Validated", user));
      } else {
        callback(response("error", "invalid document number", {}));
      }
    } catch (err) {
      if (err.code == "LIMIT_FILE_SIZE")
        return callback(
          response("error", "file size can not be larger than 2mb", {})
        );
      return callback(response("error", "unable to validate", { err }));
    }
  };
  getorder = async (req, callback) => {
    try {
      const order = await db["order"]
        .find({ user: req.user._id })
        .populate("user")
        .populate("favouriteProducts.items.productId");

      return callback(
        response("success", "order retrieved succesfully", order)
      );
    } catch (err) {
      return callback(response("error", "error in extracting orders", err));
    }
  };
  duration = async (req, callback) => {
    try {
      const user = await db["user"].findById(req.user._id);
      const isdurationincreased = req.body.isdurationincreased;
      const productId = req.body.productId;
      for (let index = 0; index < user.cart.items.length; index++) {
        if (user.cart.items[index].productId == productId) {
          if (isdurationincreased) {
            user.cart.items[index].duration =
              user.cart.items[index].duration + 1;
          } else {
            user.cart.items[index].duration =
              user.cart.items[index].duration - 1;
            if (user.cart.items[index].duration == 0) {
              const productId = user.cart.items[index].productId._id;
              const updatedCartItems = user.cart.items.filter((item) => {
                return item.productId.toString() !== productId.toString();
              });
              user.cart.items = updatedCartItems;
            }
          }
        }
      }
      await user.save();

      return callback(response("success", "order retrieved succesfully", user));
    } catch (err) {
      return callback(response("error", "error in extracting orders", err));
    }
  };
  // getCart = async (req, callback) => {
  //   let products;
  //   let total = 0;
  //   const user = await db["user"]
  //     .findById(req.user._id)
  //     .populate("cart.items.productId")
  //     .execPopulate();

  //   products = user.cart.items;
  //   total = 0;
  //   products.forEach((p) => {
  //     total += p.quantity * p.productId.price;
  //   });

  //   const session = await stripe.checkout.sessions.create({
  //     payment_method_types: ["card"],
  //     line_items: products.map((p) => {
  //       return {
  //         name: p.productId.title,
  //         description: p.productId.description,
  //         amount: p.productId.price * 100,
  //         currency: "usd",
  //         quantity: p.quantity,
  //       };
  //     }),
  //     success_url:
  //       req.protocol + "://" + req.get("host") + "/checkout/success", // => http://localhost:3000
  //     cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",
  //   });

  //   res
  //     .render("shop/checkout", {
  //       path: "/checkout",
  //       pageTitle: "Checkout",
  //       products: products,
  //       totalSum: total,
  //       sessionId: session.id,
  //     })
  //     .catch((err) => {
  //       const error = new Error(err);
  //       error.httpStatusCode = 500;
  //       return next(error);
  //     });
  // };

  // addQuery = async (req, callback) => {
  //   try {
  //     const { query, email ,id} = req.body;
  //     const user = id;
  //     const newproduct = new db["query"]({
  //       user: user,
  //       querymessage: query,
  //       email: email,
  //     });
  //     newproduct.save();
  //   } catch (err) {
  //     return callback(response("error", "unable to add your query", err));
  //   }
  // };
  addFeedback = async (req, callback) => {
    try {
      const { feedback, email } = req.body;
      const user = req.user._id;
      console.log({
        user: user,
        querymessage: feedback,
        email: email,
      });
      const newproduct = new db["feedback"]({
        user: user,
        querymessage: feedback,
        email: email,
      });
      newproduct.save();
      return callback(
        response("success", "feedback added succesfully", newproduct)
      );
    } catch (err) {
      return callback(response("error", "unable to add your query", err));
    }
  };

  addFavourite = async (req, callback) => {
    try {
      const user = await db.user.findById(req.user._id);
      user.favouriteProducts.items.push({ productId: req.body.productId });
      await user.save();
      return callback(
        response("success", "product added to favourite succesfully", user)
      );
    } catch (error) {
      return callback(
        response("error", "error while adding product to favourite", error)
      );
    }
  };

  removeFavourite = async (req, callback) => {
    try {
      const user = await db.user.findById(req.user._id);
      console.log(user.favouriteProducts.items);
      user.favouriteProducts.items = user.favouriteProducts.items.filter(
        (val) => val?.productId?.toString() !== req.body.productId.toString()
      );
      await user.save();
      return callback(
        response("success", "product deleted from favourite succesfully", user)
      );
    } catch (error) {
      return callback(
        response("error", "error while deleting product from favourite", error)
      );
    }
  };
}

export default UserController;
