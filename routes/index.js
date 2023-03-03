import * as express from "express";
import auth_routes from "./OAuthRoutes.js";
import user_routes from "./UserRoutes.js";
import admin_routes from "./AdminRoutes.js";
import product_routes from "./ProductRoutes.js";
class Routes {
  constructor(app) {
    const router = express.Router();
    // const lga_route = new lga_routes(router);
    // const parties_route = new parties_routes(router);
    // const states_route = new states_routes(router);
    // const ward_route = new ward_routes(router);
    const user_route = new user_routes(router);
    const auth_route = new auth_routes(router);
    const admin_route = new admin_routes(router);
    const product_route = new product_routes(router);
    // const pollingunit_route= new pollingunit_routes(router);
    app.use("/app/v1/", router);
  }
}

export default Routes;
