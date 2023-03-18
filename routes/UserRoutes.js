import scopeCheck from "../middleware/scopecheck.js";
import user from "../middleware/user.js";
import Authentication from "../middleware/authentication.js";
import Google from "passport-google-oauth20";
import passport from "passport";
import AuthController from "../controller/authController.js";

import userController from "../controller/userController.js";

class UserRoutes extends userController {
  constructor(router) {
    super();
    router.route("/user/updateuser").post(Authentication, (req, res) => {
      this.updateUser(req, (response) => {
        res.status(response.status).send(response.data);
      });
    }),
      router.route("/user/get").get(Authentication, (req, res) => {
        this.getUser(req, (response) => {
          res.status(response.status).send(response.data);
        });
      }),
      router.route("/user/add/favourite").post(Authentication, (req, res) => {
        this.addFavourite(req, (response) => {
          res.status(response.status).send(response.data);
        });
      }),
      router
        .route("/user/remove/favourite")
        .post(Authentication, (req, res) => {
          this.removeFavourite(req, (response) => {
            res.status(response.status).send(response.data);
          });
        }),
      router.route("/user/add-query").post(Authentication, (req, res) => {
        console.log("in addqueryreq");
        this.addQuery(req, (response) => {
          res.status(response.status).send(response.data);
        });
      }),
      router
        .route("/user/generate-email-otp")
        .post(Authentication, (req, res) => {
          this.generateemailotp(req, (response) => {
            res.status(response.status).send(response.data);
          });
        }),
      router
        .route("/user/generate-number-otp")
        .post(Authentication, (req, res) => {
          this.generatephonenumberotp(req, (response) => {
            res.status(response.status).send(response.data);
          });
        }),
      router.route("/user/add-feedback").post(Authentication, (req, res) => {
        this.addFeedback(req, (response) => {
          res.status(response.status).send(response.data);
        });
      }),
      router
        .route("/user/verify-number-otp")
        .post(Authentication, (req, res) => {
          this.verifyPhonenumber(req, (response) => {
            res.status(response.status).send(response.data);
          });
        }),
      router
        .route("/user/document-validation")
        .post(Authentication, (req, res, next) => {
          this.validateDocument(req, res, next, (response) => {
            res.status(response.status).send(response.data);
          });
        }),
      router.route("/user/addtocart").post(Authentication, (req, res, next) => {
        this.addToCart(req, res, next, (response) => {
          res.status(response.status).send(response.data);
        });
      }),
      router
        .route("/user/verify-email-otp")
        .post(Authentication, (req, res) => {
          this.verifyEmail(req, (response) => {
            res.status(response.status).send(response.data);
          });
        }),
      router
        .route("/user/removecart")
        .post(Authentication, (req, res, next) => {
          this.removeCart(req, (response) => {
            res.status(response.status).send(response.data);
          });
        }),
      router.route("/user/getcart").get(Authentication, (req, res) => {
        this.getCart(req, (response) => {
          res.status(response.status).send(response.data);
        });
      });
    router.route("/get-razorpay-key").get(Authentication, (req, res) => {
      this.getrazorpaykey(req, (response) => {
        res.status(response.status).send(response.data);
      });
    });
    router.route("/create-order").post(Authentication, (req, res) => {
      this.createorder(req, (response) => {
        res.status(response.status).send(response.data);
      });
    });
    router.route("/user/order").get(Authentication, (req, res, next) => {
      this.getorder(req, (response) => {
        res.status(response.status).send(response.data);
      });
    });
    router.route("/pay-order").post(Authentication, (req, res) => {
      this.payorder(req, (response) => {
        res.status(response.status).send(response.data);
      });
    });
    router.route("/duration").post(Authentication, (req, res) => {
      this.duration(req, (response) => {
        res.status(response.status).send(response.data);
      });
    });
  }
}
export default UserRoutes;
