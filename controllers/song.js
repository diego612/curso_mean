const fs = require("fs");
const path = require("path");
const mongoosePaginate = require("mongoose-pagination");

const Artist = require("../models/artist");
const Song = require("../models/song");
const Album = require("../models/album");

getSong = (req, res) => {
  const songId = req.params.id;

  Song.findById(songId)
    .populate({ path: "album" })
    .exec((err, song) => {
      if (err) {
        res.status(500).send({ message: "Error en el servidor" });
      } else {
        if (!song) {
          res.status(404).send({ message: "La cancion no ha sido encontrada" });
        } else {
          res.send({ song });
        }
      }
    });
};

saveSong = (req, res) => {
  var song = new Song();
  const params = req.body;

  song.number = params.number;
  song.name = params.name;
  song.duration = params.duration;
  song.file = "null";
  song.album = params.album;

  song.save((err, songStored) => {
    if (err) {
      res.status(500).send({ message: "Error en el servidor" });
    } else {
      if (!songStored) {
        res.status(404).send({ message: "No se ha guardado la cantion" });
      } else {
        res.send({ song: songStored });
      }
    }
  });
};

getSongs = (req, res) => {
  const albumId = req.params.album;

  if (!albumId) {
    var find = Song.find({}).sort("number");
  } else {
    var find = Song.find({ album: albumId }).sort("number");
  }

  find
    .populate({
      path: "album",
      populate: {
        path: "artist",
        model: "Artist"
      }
    })
    .exec((err, songs) => {
      if (err) {
        res.status(500).send({ message: "Error en el servidor" });
      } else {
        if (!songs) {
          res.status(404).send({ message: "No se encontraron canciones" });
        } else {
          res.send({ songs });
        }
      }
    });
};

updateSong = (req, res) => {
  const songId = req.params.id;
  const update = req.body;

  Song.findByIdAndUpdate(songId, update, { new: true }, (err, songUpdated) => {
    if (err) {
      res.status(500).send({ message: "Error en el servidor" });
    } else {
      if (!songUpdated) {
        res.status(404).send({ message: "No se ha actualizado la cancion" });
      } else {
        res.send({ song: songUpdated });
      }
    }
  });
};

deleteSong = (req, res) => {
  const songId = req.params.id;

  Song.findByIdAndRemove(songId, (err, songRemoved) => {
    if (err) {
      res.status(500).send({ message: "Error en el servidor" });
    } else {
      if (!songRemoved) {
        res
          .status(404)
          .send({ message: "No se ha encontrado la cancion para borrarla" });
      } else {
        res.send({ song: songRemoved });
      }
    }
  });
};

uploadFile = (req, res) => {
  const songId = req.params.id;
  const fileName = "Not uploaded";

  if (req.files) {
    var file_path = req.files.file.path;
    var fileSplit = file_path.split("\\");
    const fileName = fileSplit[2];

    const fileExt = fileName.split(".")[1];

    const options = { new: true };

    if (fileExt === "mp3") {
      Song.findByIdAndUpdate(
        songId,
        { file: fileName },
        options,
        (err, songUpdated) => {
          if (err) {
            res
              .status(500)
              .send({ message: "Error al agregar archivo a la cancion" });
          } else {
            res.status(200).send({ song: songUpdated });
          }
        }
      );
    } else {
      res.status(200).send({ message: "Extension del archivo no valida" });
    }
  } else {
    res.status(200).send({ message: "No has subido ningun archivo" });
  }
};

getSongFile = (req, res) => {
  const songFile = req.params.file;

  fs.exists(`./upload/songs/${songFile}`, exists => {
    if (exists) {
      res.sendFile(path.resolve(`./upload/songs/${songFile}`));
    } else {
      res.status(404).send({ message: "File doesn't exist" });
    }
  });
};

module.exports = {
  getSong,
  saveSong,
  getSongs,
  updateSong,
  deleteSong,
  uploadFile,
  getSongFile
};
