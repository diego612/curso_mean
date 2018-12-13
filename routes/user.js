const express = require("express");
const UserController = require("../controllers/user");

const api = express.Router();
const md_auth = require("../middleware/authenticate");

const multipart = require("connect-multiparty");
const md_upload = multipart({ uploadDir: "./upload/users" });

api.get("/probandoControlador", md_auth.ensureAuth, UserController.pruebas);

api.post("/register", UserController.saveUser);

api.post("/login", UserController.loginUser);

api.put("/updateUser/:id", md_auth.ensureAuth, UserController.updateUser);

api.post(
  "/uploadUserImage/:id",
  [md_auth.ensureAuth, md_upload],
  UserController.uploadImage
);

api.get("/getImageFile/:imageFile", UserController.getImageFile);

module.exports = api;
