import Authentication from "../middleware/authentication.js";
import FreelancerController from "../controller/FreelancerController.js";

class FreelancerRoutes extends FreelancerController {
  constructor(router) {
    super();
    router.route("/user/freelancer/getAll").get(Authentication, (req, res) => {
      this.getFreelancers(req, (response) => {
        res.status(response.status).send(response.data);
      });
    });
    router.route("/user/freelancer/get").get(Authentication, (req, res) => {
      this.getFreelancer(req, (response) => {
        res.status(response.status).send(response.data);
      });
    });
    router.route("/user/freelancer/update").post(Authentication, (req, res) => {
      this.updateFreelancer(req, (response) => {
        res.status(response.status).send(response.data);
      });
    });
  }
}
export default FreelancerRoutes;
