const fs = require("fs");
const path = require("path");
const mongoosePaginate = require("mongoose-pagination");

const Artist = require("../models/artist");
const Song = require("../models/song");
const Album = require("../models/album");

getAlbum = (req, res) => {
  var albumId = req.params.id;

  Album.findById(albumId)
    .populate({ path: "artist" })
    .exec((err, album) => {
      if (err) {
        res.status(500).send({ message: "Error en el servidor" });
      } else {
        if (!album) {
          res.status(404).send({ message: "Album no encontrado" });
        } else {
          res.status(200).send({ album });
        }
      }
    });
};

saveAlbum = (req, res) => {
  var album = new Album();
  var params = req.body;

  album.title = params.title;
  album.description = params.description;
  album.year = params.year;
  album.image = "null";
  album.artist = params.artist;

  album.save((err, albumStored) => {
    if (err) {
      res.status(500).send({ message: "Error en la peticion" });
    } else {
      if (!albumStored) {
        res.status(404).send({ message: "No se ha guardado el album" });
      } else {
        res.status(200).send({ album: albumStored });
      }
    }
  });
};

getAlbums = (req, res) => {
  const artistId = req.params.artist;

  if (!artistId) {
    // Sacar todos los albums de la base de datos
    var find = Album.find({}).sort("title");
  } else {
    // Sacar todos los albums de ese artista
    var find = Album.find({ artist: artistId }).sort("year");
  }

  find.populate({ path: "artist" }).exec((err, albums) => {
    if (err) {
      res.status(500).send({ message: "Error en la peticion" });
    } else {
      if (!albums) {
        res.status(404).send({ message: "No se encontraron albums" });
      } else {
        res.status(200).send({ albums });
      }
    }
  });
};

updateAlbum = (req, res) => {
  const albumId = req.params.id;
  const update = req.body;

  const options = { new: true };

  Album.findByIdAndUpdate(albumId, update, options, (err, albumUpdated) => {
    if (err) {
      res.status(500).send({ message: "Error en la peticion" });
    } else {
      if (!albumUpdated) {
        res.status(404).send({ message: "Album no encontrado" });
      } else {
        res.status(200).send({ album: albumUpdated });
      }
    }
  });
};

deleteAlbum = (req, res) => {
  const albumId = req.params.id;

  Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
    if (err) {
      res.status(500).send({ message: "Error al eliminar el album" });
    } else {
      if (!albumRemoved) {
        res.status(404).send({ message: "El album no encontrado" });
      } else {
        Song.find({ album: albumRemoved._id }).remove((err, songRemoved) => {
          if (err) {
            res.status(500).send({ message: "Error al eliminar la cancion" });
          } else {
            if (!songRemoved) {
              res.status(404).send({
                message: "La cancion no ha sido eliminada"
              });
            } else {
              res.status(200).send({ album: albumRemoved });
            }
          }
        });
      }
    }
  });
};

uploadImage = (req, res) => {
  const albumId = req.params.id;
  const fileName = "Not uploaded";

  if (req.files) {
    var file_path = req.files.image.path;
    var fileSplit = file_path.split("\\");
    const fileName = fileSplit[2];

    const fileExt = fileName.split(".")[1];

    const options = { new: true };

    if (fileExt === "png" || fileExt === "jpg") {
      Album.findByIdAndUpdate(
        albumId,
        { image: fileName },
        options,
        (err, albumUpdated) => {
          if (err) {
            res.status(500).send({ message: "Error al agregar foto al album" });
          } else {
            res.status(200).send({ album: albumUpdated });
          }
        }
      );
    } else {
      res.status(200).send({ message: "Extension del archivo no valida" });
    }
  } else {
    res.status(200).send({ message: "No has subido ninguna imagen" });
  }
};

getImageFile = (req, res) => {
  const imageFile = req.params.imageFile;

  fs.exists(`./upload/albums/${imageFile}`, exists => {
    if (exists) {
      res.sendFile(path.resolve(`./upload/albums/${imageFile}`));
    } else {
      res.status(404).send({ message: "Image doesn't exist" });
    }
  });
};

module.exports = {
  getAlbum,
  saveAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  getImageFile
};
