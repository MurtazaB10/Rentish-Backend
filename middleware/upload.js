// const util = require("util");

import util from "util";
// const multer = require("multer");
import multer from "multer";
const uploader = {
  fileupload: async (req, res, path, next) => {
    try {
      const maxSize = 2 * 1024 * 1024;
      let storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, __dirname + path);
        },
        filename: (req, file, cb) => {
          console.log(file.originalname);
          cb(null, file.originalname);
        },
      });
      const fileFilter = (req, file, cb) => {
        if (
          file.mimetype === "image/png" ||
          file.mimetype === "image/jpg" ||
          file.mimetype === "image/jpeg"
        ) {
          // check file type to be pdf, doc, or docx
          cb(null, true);
        } else {
          cb(null, false); // else fails
        }
      };
      let uploadFile = await multer({
        storage: storage,
        limits: { fileSize: maxSize },
        fileFilter: fileFilter,
      }).single("document");

      const uploadfile = util.promisify(uploadFile);
      console.log("in uplod doc");
      return uploadfile(req, next);
    } catch (err) {
      console.log(err);
    }
  },

  filesupload: async (req, res, path, next) => {
    try {
      const maxSize = 2 * 1024 * 1024;
      let storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, __dirname + "/public/static/uploads/products");
        },
        filename: (req, file, cb) => {
          console.log(file.originalname);
          cb(null, file.originalname);
        },
      });
      const fileFilter = (req, file, cb) => {
        if (
          file.mimetype === "image/png" ||
          file.mimetype === "image/jpg" ||
          file.mimetype === "image/jpeg"
        ) {
          // check file type to be pdf, doc, or docx
          cb(null, true);
        } else {
          cb(null, false); // else fails
        }
      };
      let uploadFile = await multer({
        storage: storage,
        limits: { fileSize: maxSize },
        fileFilter: fileFilter,
      }).array("file", 4);

      const uploadfile = util.promisify(uploadFile);
      console.log("in uplod doc");
      return uploadfile(req, next);
    } catch (err) {
      console.log(err);
    }
  },
};
export default uploader;
