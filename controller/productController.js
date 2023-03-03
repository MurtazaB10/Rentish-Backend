import { randomBytes } from "crypto";
import { ObjectId } from "mongodb";
import { compare, hash } from "bcrypt";
import db from "../models/index.js";
import response from "../utils/response.js";
import helper from "../utils/helper.js";
import constant from "../constant.js";
import mongoose from "mongoose";
class ProductController {
  constructor() {}
  productFeed = async (req, callback) => {
    // const categoryy = req.body.category;

    // const filters = {}
    // if (categoryy) {
    //     filters.categoryy = categoryy;

    // }
    // // put filters here in filters obj

    const product = await db["product"].find();
    //     let products;
    //     if (req.body.search_field)
    //     {
    //     for (let i = 0; i < product.length; i++)
    //     {
    //             if (product[i].name == new RegExp(req.query.search_field, "i") || product[i].description == new RegExp(req.query.search_field, "i") || product[i].category == new RegExp(req.query.search_field, "i") || product[i].manufacturer == new RegExp(req.query.search_field, "i"))
    //             {
    //                 products[k] = product[i];
    //                 k++;
    //             }
    //     }

    //     }
    //  else {
    //         products=[...product];
    //     }

    console.log("====================================");
    console.log(product.image);
    console.log("====================================");

    callback(response("success", "product sent successfully", product));
  };
}
export default ProductController;
