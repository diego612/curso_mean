const express = require("express");
const multipart = require("connect-multiparty");
const AlbumController = require("../controllers/album");

const api = express.Router();
const md_auth = require("../middleware/authenticate");
const md_upload = multipart({ uploadDir: "./upload/albums" });

api.get("/album/:id", md_auth.ensureAuth, AlbumController.getAlbum);

api.post("/album", md_auth.ensureAuth, AlbumController.saveAlbum);

api.get("/albums/:artist?", md_auth.ensureAuth, AlbumController.getAlbums);

api.put("/album/:id", md_auth.ensureAuth, AlbumController.updateAlbum);

api.delete("/album/:id", md_auth.ensureAuth, AlbumController.deleteAlbum);

api.post(
  "/uploadAlbumImage/:id",
  [md_auth.ensureAuth, md_upload],
  AlbumController.uploadImage
);

api.get(
  "/getAlbumImage/:imageFile",
  md_auth.ensureAuth,
  AlbumController.getImageFile
);

module.exports = api;
