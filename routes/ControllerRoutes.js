
import scopeCheck from "../middleware/scopecheck.js";
import user from "../middleware/user.js";
import Authentication from "../middleware/authentication.js"
// import Google from'passport-google-oauth20';
// import passport from 'passport';
// import AuthController from "../controller/authController.js";

import productController from "../controller/productController.js";
import helper from "../utils/helper.js";


class productRoutes extends productController {
    constructor(router) {
        super();
        router.route('/product/:category')
        .post((req, res) => {
            this.productFeed(req,(response) => {
                res.status(response.status).send(response.data);
            })
        })
    
    
    
    }}