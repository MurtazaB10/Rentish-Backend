import Authentication from "../middleware/authentication.js";
import PostController from "../controller/PostController.js";

class PostRoutes extends PostController {
  constructor(router) {
    super();
    router.route("/post/getAll").get(Authentication, (req, res) => {
      this.getUserPosts(req, (response) => {
        res.status(response.status).send(response.data);
      });
    });
    router.route("/post/get").get(Authentication, (req, res) => {
      this.getPost(req, (response) => {
        res.status(response.status).send(response.data);
      });
    });
    router.route("/post/update").post(Authentication, (req, res) => {
      this.updatePost(req, (response) => {
        res.status(response.status).send(response.data);
      });
    });
    router.route("/post/add").post(Authentication, (req, res) => {
      this.createPost(req, (response) => {
        res.status(response.status).send(response.data);
      });
    });
    router.route("/post/accept/reject").post(Authentication, (req, res) => {
      this.acceptOrReject(req, (response) => {
        res.status(response.status).send(response.data);
      });
    });
    router.route("/post/apply").post(Authentication, (req, res) => {
      this.applyForPost(req, (response) => {
        res.status(response.status).send(response.data);
      });
    });
    router.route("/post/search").post(Authentication, (req, res) => {
      this.searchUsingKeyword(req, (response) => {
        res.status(response.status).send(response.data);
      });
    });
  }
}
export default PostRoutes;
