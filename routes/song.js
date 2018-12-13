const express = require("express");
const multipart = require("connect-multiparty");
const SongController = require("../controllers/song");

const api = express.Router();
const md_auth = require("../middleware/authenticate");
const md_upload = multipart({ uploadDir: "./upload/songs" });

api.get("/song/:id", md_auth.ensureAuth, SongController.getSong);

api.post("/song", md_auth.ensureAuth, SongController.saveSong);

api.get("/songs/:album?", md_auth.ensureAuth, SongController.getSongs);

api.put("/song/:id", md_auth.ensureAuth, SongController.updateSong);

api.delete("/song/:id", md_auth.ensureAuth, SongController.deleteSong);

api.post(
  "/uploadSongFile/:id",
  [md_auth.ensureAuth, md_upload],
  SongController.uploadFile
);

api.get("/getSongFile/:file", md_auth.ensureAuth, SongController.getSongFile);

module.exports = api;
