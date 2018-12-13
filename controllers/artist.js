const fs = require("fs");
const path = require("path");
const mongoosePaginate = require("mongoose-pagination");

const Artist = require("../models/artist");
const Song = require("../models/song");
const Album = require("../models/album");

getArtist = (req, res) => {
  var artistId = req.params.id;

  Artist.findById(artistId, (err, artist) => {
    if (err) {
      res.status(500).send({ message: "Error en la peticion" });
    } else {
      if (!artist) {
        res.status(404).send({ message: "Artista no existe" });
      } else {
        res.status(200).send({ artist });
      }
    }
  });
};

saveArtist = (req, res) => {
  var artist = new Artist();

  var params = req.body;
  artist.name = params.name;
  artist.description = params.description;
  artist.image = "null";

  artist.save((err, artistStored) => {
    if (err) {
      res.status(500).send({ message: "Error al guardar el artista" });
    } else {
      if (!artistStored) {
        res.status(404).send({ message: "El artista no ha sido guardado" });
      } else {
        res.status(200).send({ artist: artistStored });
      }
    }
  });
};

getArtists = (req, res) => {
  if (req.params.page) {
    var page = req.params.page;
  } else {
    var page = 1;
  }

  var itemsPerPage = 2;

  Artist.find()
    .sort("name")
    .paginate(page, itemsPerPage, (err, artists, totalItems) => {
      if (err) {
        res.status(500).send({ message: "Error en la peticion" });
      } else {
        if (!artists) {
          res.status(404).send({ message: "No hay artistas" });
        } else {
          res.status(200).send({ totalItems: totalItems, artists: artists });
        }
      }
    });
};

updateArtist = (req, res) => {
  var artistId = req.params.id;
  var update = req.body;

  Artist.findByIdAndUpdate(
    artistId,
    update,
    { new: true },
    (err, artistUpdated) => {
      if (err) {
        res.status(500).send({ message: "Error al guardar el artista" });
      } else {
        if (!artistUpdated) {
          res.status(404).send({ message: "El artista no se ha encontrado" });
        } else {
          res.status(200).send({ artist: artistUpdated });
        }
      }
    }
  );
};

deleteArtist = (req, res) => {
  const artistId = req.params.id;

  Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
    if (err) {
      res.status(500).send({ message: "Error al borrar el artista" });
    } else {
      if (!artistRemoved) {
        res.status(404).send({ message: "El artista no se ha eliminado" });
      } else {
        Album.find({ artist: artistRemoved._id }).remove(
          (err, albumRemoved) => {
            if (err) {
              res.status(500).send({ message: "Error al eliminar el album" });
            } else {
              if (!albumRemoved) {
                res
                  .status(404)
                  .send({ message: "El album no ha sido eliminado" });
              } else {
                Song.find({ album: albumRemoved._id }).remove(
                  (err, songRemoved) => {
                    if (err) {
                      res
                        .status(500)
                        .send({ message: "Error al eliminar la cancion" });
                    } else {
                      if (!songRemoved) {
                        res.status(404).send({
                          message: "La cancion no ha sido eliminada"
                        });
                      } else {
                        res.status(200).send({ artist: artistRemoved });
                      }
                    }
                  }
                );
              }
            }
          }
        );
      }
    }
  });
};

uploadImage = (req, res) => {
  const artistId = req.params.id;
  const fileName = "Not uploaded";

  if (req.files) {
    var file_path = req.files.image.path;
    var fileSplit = file_path.split("\\");
    const fileName = fileSplit[2];

    const fileExt = fileName.split(".")[1];

    if (fileExt === "png" || fileExt === "jpg") {
      Artist.findByIdAndUpdate(
        artistId,
        { image: fileName },
        (err, artistUpdated) => {
          if (err) {
            res
              .status(500)
              .send({ message: "Error al agregar avatar al artista" });
          } else {
            res.status(200).send({ artist: artistUpdated });
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

  fs.exists(`./upload/artists/${imageFile}`, exists => {
    if (exists) {
      res.sendFile(path.resolve(`./upload/artists/${imageFile}`));
    } else {
      res.status(404).send({ message: "Image doesn't exist" });
    }
  });
};

module.exports = {
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile
};
