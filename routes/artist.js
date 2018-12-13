const express = require("express");
const multipart = require("connect-multiparty");
const ArtistController = require("../controllers/artist");

const api = express.Router();
const md_auth = require("../middleware/authenticate");
const md_upload = multipart({ uploadDir: "./upload/artists" });

api.get("/artist/:id", md_auth.ensureAuth, ArtistController.getArtist);

api.post("/artist", md_auth.ensureAuth, ArtistController.saveArtist);

api.get("/artists/:page?", md_auth.ensureAuth, ArtistController.getArtists);

api.put("/artist/:id", md_auth.ensureAuth, ArtistController.updateArtist);

api.delete("/artist/:id", md_auth.ensureAuth, ArtistController.deleteArtist);

api.post(
  "/uploadArtistImage/:id",
  [md_auth.ensureAuth, md_upload],
  ArtistController.uploadImage
);

api.get(
  "/getArtistImage/:imageFile",
  md_auth.ensureAuth,
  ArtistController.getImageFile
);

module.exports = api;
