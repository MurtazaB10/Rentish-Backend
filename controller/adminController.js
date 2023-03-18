import db from "../models/index.js";
import uploader from "../middleware/upload.js";
import response from "../utils/response.js";
import product from "../models/product.js";
import * as fs from "fs";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
const cloudinaryy = cloudinary.v2;
cloudinaryy.config({
  cloud_name: "rentish",
  api_key: "396411645692974",
  api_secret: "S9ry8haZqfeJGJi1QdxBptOYrOs",
});

class AdminController {
  addProduct = async (req, res, next, callback) => {
    try {
      const path = "/public/static/uploads/product";
      await uploader.filesupload(req, res, path, next);

      const {
        name,
        rentalprice,
        costprice,
        deposit,
        description,
        manufacturer,
        coupon,
        quantity,
        category,
      } = req.body;
      console.log(category);
      // const check = await db["product"].find({
      //   name: name,
      //   manufacturer: manufacturer,
      //   rentalprice: rentalprice,
      //   categoryy: category,
      // });
      // if (check) {
      //   return callback(
      //     response(
      //       "error",
      //       "product already exist with same rental price update the quantity",
      //       {}
      //     )
      //   );
      // }
      console.log("c: " + category);
      console.log(req.file);
      let arr = [];

      // for (let index = 0; index < req.files.length; index++) {
      //   // cloudinary.v2.uploader.upload(
      //   //   req.files[index].path,
      //   //   async function (error, result) {
      //   //     console.log(result.url);
      //   //     await fs.unlinkSync(req.files[index].path);
      //   //     const Product = await db["product"].findOne({
      //   //       name: name,
      //   //       manufacturer: manufacturer,
      //   //       rentalprice: rentalprice,
      //   //     });
      //   //     Product.image[index] = result;
      //   //     await Product.save();
      //   //   }
      //   // );
      //   console.log(req.files[index]);
      //   arr.push(req.files[index].filename);
      // }
      console.log(arr);
      const newproduct = new db["product"]({
        name: name,
        rentalprice: rentalprice,
        costprice: costprice,
        deposit: deposit,
        description: description,
        manufacturer: manufacturer,
        categoryy: category,
        coupon: coupon,
        quantity: quantity,
        image: arr,
      });
      await newproduct.save();

      return callback(
        response("success", "product added succesfully", newproduct)
      );
    } catch (err) {
      return callback(response("error", "error in adding product", err));
    }
  };
  deleteProduct = async (req, callback) => {
    try {
      const { productId } = req.body;
      const product = await db["product"].findById(productId);
      if (!product) {
        return callback(response("error", "product not found", {}));
      }
      await db["product"].findByIdAndDelete(productId);
      // for (let i = 0; i < product.image.length; i++) {
      //   cloudinary.v2.api.delete_resources(
      //     product.image.public_id,
      //     (res) => {}
      //   );
      // }
      return callback(response("success", "product deleted succesfully", {}));
    } catch (err) {
      return callback(
        response("error", "error in deleting product try again later", err)
      );
    }
  };
  editProduct = async (req, res, next, callback) => {
    const path = "/public/static/uploads/product";
    await uploader.filesupload(req, res, path, next);
    const {
      name,
      rentalprice,
      costprice,
      deposit,
      description,
      manufacturer,
      coupon,
      category,
      quantity,
      id,
    } = req.body;
    const Product = await db["product"].findById({
      _id: id,
    });

    // if (!Product || Product == NaN) {
    //   return callback(
    //     response("error", "product doesn't exist create product first", {})
    //   );
    // }
    Product.name = name;
    Product.manufacturer = manufacturer;
    Product.rentalprice = rentalprice;
    Product.costprice = costprice;
    Product.deposit = deposit;
    Product.description = description;
    Product.coupon = coupon;
    Product.categoryy = category;
    Product.quantity = quantity;
    await Product.save();
    // console.log(req.files)
    // if (req.files.length != 0) {
    //   for (let index = 0; index < req.files.length; index++) {
    //     // cloudinary.v2.uploader.upload(
    //     //   req.files[index].path,
    //     //   async function (error, result) {
    //     //     console.log(result.url);
    //     //     await fs.unlinkSync(req.files[index].path);
    //     //     const Product1 = await db["product"].findOne({
    //     //       name: name,
    //     //       manufacturer: manufacturer,
    //     //       rentalprice: rentalprice,
    //     //     });
    //     //     Product1.image[index] = result;
    //     //     await Product1.save();
    //     //   }
    //     // );
    //     console.log(req.files[index]);
    //   }
    // }

    return callback(response("success", "product edited succesfully", Product));
  };

  getorder = async (req, callback) => {
    try {
      const order = await db["order"].find().populate("user");

      return callback(
        response("success", "order retrieved succesfully", order)
      );
    } catch (err) {
      return callback(response("error", "error in extracting orders", err));
    }
  };

  getquery = async (req, callback) => {
    try {
      const query = await db["query"].find().populate("user");

      return callback(
        response("success", "query retrieved succesfully", query)
      );
    } catch (err) {
      return callback(response("error", "error in extracting query", err));
    }
  };
  getfeedback = async (req, callback) => {
    try {
      const feedback = await db["feedback"].find().populate("user");

      return callback(
        response("success", "feedback retrieved succesfully", feedback)
      );
    } catch (err) {
      return callback(response("error", "error in extracting query", err));
    }
  };
  getdashboard = async (req, callback) => {
    try {
      const numOfUser = await db["user"].count();
      const numOfOrders = await db["order"].count();
      const order = await db["order"].find();
      let totalsum = 0;
      order.forEach((e) => {
        totalsum += e.amount;
      });

      return callback(
        response("success", "dashboard data retrieved succesfully", {
          customers: numOfUser,
          numoforders: numOfOrders,
          totalAmount: totalsum,
        })
      );
    } catch (err) {
      return callback(response("error", "error in extracting query", err));
    }
  };
}
export default AdminController;
