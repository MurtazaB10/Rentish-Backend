import db from "../models/index.js";
import response from "../utils/response.js";
import dotenv from "dotenv";
dotenv.config();

class PostController {
  getUserPosts = async (req, callback) => {
    try {
      const posts = await db.Post.find({ userId: req.user._id })
        .populate("userId")
        .populate("status.items.user");
      console.log(posts);
      callback(response("success", "fetched posts successfully!", posts));
    } catch (error) {
      console.log(error);
      callback(response("error", "error while fetching posts", error));
    }
  };

  getPost = async (req, callback) => {
    try {
      const post = await db.Post.find({ _id: req.query.id })
        .populate("userId")
        .populate("status.items.user");
      console.log(post);
      callback(response("success", "fetched post successfully!", post));
    } catch (error) {
      console.log(error);
      callback(response("error", "error while fetching post", error));
    }
  };

  updatePost = async (req, callback) => {
    try {
      const postId = req.body._id;
      //   const path = "/public/static/uploads/userdocuments";
      //   await uploader.filesupload(req, res, path, next);
      const post = await db["Post"].findOneAndUpdate(
        { _id: postId },
        {
          title: req.body.title,
          description: req.body.description,
          pricePerHour: req.body.pricePerHour,
          pricePerDay: req.body.pricePerDay,
          //   image: req.image,
        },
        {
          new: true,
        }
      );
      console.log(post);
      callback(response("success", "post updated", post));
    } catch (error) {
      console.log(error);
      callback(response("error", "error while updating post", error));
    }
  };

  createPost = async (req, callback) => {
    try {
      const userId = req.user._id;
      //   const path = "/public/static/uploads/userdocuments";
      //   await uploader.filesupload(req, res, path, next);
      const post = await db["Post"].insertMany([
        {
          userId: userId,
          title: req.body.title,
          description: req.body.description,
          pricePerHour: req.body.pricePerHour,
          pricePerDay: req.body.pricePerDay,
          //   image: req.image,
        },
      ]);
      console.log(post);
      callback(response("success", "post created", post));
    } catch (error) {
      console.log(error);
      callback(response("error", "error while creating post", error));
    }
  };

  acceptOrReject = async (req, callback) => {
    try {
      const postId = req.body._id;
      const userId = req.body.userId;
      const acceptOrReject = req.body.acceptOrReject;
      const post = await db["Post"].findById(postId);
      if (!post) callback(response("invalidRequest", "cant find post", {}));
      let status = post.status.items;
      if (acceptOrReject == 0) {
        status = status.filter(
          (val) => val.user.toString() !== userId.toString()
        );
      } else {
        status = status.filter(
          (val) => val.user.toString() === userId.toString()
        );
        status[0].isAccepted = true;
        post.isValid = false;
      }
      const updatedPost = await db["Post"].findOneAndUpdate(
        { _id: postId },
        {
          status: { items: status },
          isValid: post.isValid,
        },
        {
          new: true,
        }
      );
      console.log(updatedPost);
      callback(response("success", "post updated", updatedPost));
    } catch (error) {
      console.log(error);
      callback(
        response("error", "error while accepting or rejecting post", error)
      );
    }
  };

  applyForPost = async (req, callback) => {
    try {
      const postId = req.body._id;
      const userId = req.user._id;
      const post = await db["Post"].findById(postId);
      if (!post) callback(response("invalidRequest", "cant find post", {}));
      post.status.items.push({ user: userId });
      const updatedPost = await db["Post"].findOneAndUpdate(
        { _id: postId },
        {
          status: { items: post.status.items },
        },
        {
          new: true,
        }
      );
      console.log(updatedPost);
      callback(response("success", "post updated", updatedPost));
    } catch (error) {
      console.log(error);
      callback(response("error", "error while applying for the post", error));
    }
  };

  searchUsingKeyword = async (req, callback) => {
    try {
      const keyword = req.body.search;
      const products = await db.Post.find({
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
        userId: req.user._id,
      }).catch((err) => {
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

export default PostController;
