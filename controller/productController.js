import db from "../models/index.js";
import response from "../utils/response.js";

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

  searchUsingKeyword = async (req, callback) => {
    try {
      const keyword = req.body.search;
      const products = await db.product
        .find({
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
            { categoryy: { $regex: keyword, $options: "i" } },
            { manufacturer: { $regex: keyword, $options: "i" } },
          ],
        })
        .catch((err) => {
          console.error(err);
          throw err;
        });
      callback(response("success", "products sent successfully", products));
    } catch (error) {
      console.log(error);
      callback(response("error", "error while searching for products", error));
    }
  };
}
export default ProductController;
