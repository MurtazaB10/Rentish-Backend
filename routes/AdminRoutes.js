import scopeCheck from "../middleware/scopecheck.js";
import user from "../middleware/user.js";
import Authentication from "../middleware/authentication.js";
// import Google from'passport-google-oauth20';
// import passport from 'passport';
// import AuthController from "../controller/authController.js";
import adminController from "../controller/adminController.js";
import helper from "../utils/helper.js";
import uploader from "../middleware/upload.js";

class adminRoutes extends adminController {
  constructor(router) {
    super();
    router
      .route("/admin/add-product")
      .post(uploader.filesupload, (req, res, next) => {
        this.addProduct(req, res, next, (response) => {
          res.status(response.status).send(response.data);
        });
      });
    router.route("/admin/delete-product").post((req, res, next) => {
      this.deleteProduct(req, (response) => {
        res.status(response.status).send(response.data);
      });
    });
    router.route("/admin/edit-product").post((req, res, next) => {
      this.editProduct(req, res, next, (response) => {
        res.status(response.status).send(response.data);
      });
    });
    router.route("/admin/order").get((req, res, next) => {
      this.getorder(req, (response) => {
        res.status(response.status).send(response.data);
      });
    });
    router.route("/admin/query").get((req, res, next) => {
      this.getquery(req, (response) => {
        res.status(response.status).send(response.data);
      });
    });
    router.route("/admin/feedback").get((req, res, next) => {
      this.getfeedback(req, (response) => {
        res.status(response.status).send(response.data);
      });
    });
    router.route("/admin/dashboard").get((req, res, next) => {
      this.getdashboard(req, (response) => {
        res.status(response.status).send(response.data);
      });
    });
  }
}
export default adminRoutes;
