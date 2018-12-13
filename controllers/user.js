const User = require("../models/user");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");

const fs = require("fs");
const path = require("path");

pruebas = (req, res) => {
  res.status(200).send({
    message:
      "Probando una accion del controlador de usuarios del API REST con Node"
  });
};

saveUser = (req, res) => {
  var user = new User();

  var params = req.body;

  user.name = params.name;
  user.surname = params.surname;
  user.email = params.email;
  user.role = "ROLE_ADMIN";
  user.image = "null";

  if (params.password) {
    // Encriptar contraseña y guardar datos
    bcrypt.hash(params.password, null, null, (err, hash) => {
      user.password = hash;
      if (user.name != null && user.surname != null && user.email != null) {
        // Guarda el usuario
        user.save((err, userStored) => {
          if (err) {
            res.status(500).send({ message: "Error al guardar el usuario" });
          } else {
            if (!userStored) {
              res
                .status(404)
                .send({ message: "No se ha registrado el usuario" });
            } else {
              res.status(200).send({ user: userStored });
            }
          }
        });
      } else {
        res.status(200).send({ message: "Introduce todos los campos" });
      }
    });
  } else {
    res.status(200).send({ message: "Introduce la contraseña" });
  }
};

loginUser = (req, res) => {
  const params = req.body;

  const email = params.email;
  const password = params.password;

  if (!email && !password) {
    res.status(200).send({ message: "Rellena los campos" });
  }

  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) {
      res.status(500).send({ message: "Error en la peticion" });
    } else {
      if (!user) {
        res.status(404).send({ message: "El usuario no existe" });
      } else {
        // Comprobar la contraseña
        bcrypt.compare(password, user.password, (err, check) => {
          if (check) {
            // Devolver los datos del usuario loggeado
            if (params.gethash) {
              // Devolver un token de JWT
              res.status(200).send({ token: jwt.createToken(user) });
            } else {
              res.status(200).send({ user });
            }
          } else {
            res
              .status(404)
              .send({ message: "El usuario no ha podido loggearse" });
          }
        });
      }
    }
  });
};

updateUser = (req, res) => {
  const userId = req.params.id;
  const update = req.body;

  if (userId !== req.user.sub) {
    return res
      .status(500)
      .send({ message: "You do not have the permissions to modify this user" });
  }

  User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
    if (err) {
      res.status(500).send({ message: "Error while updating the user" });
    } else {
      if (!userUpdated) {
        res.status(404).send({ message: "User could not be updated" });
      } else {
        res.status(200).send({ user: userUpdated });
      }
    }
  });
};

uploadImage = (req, res) => {
  const UserId = req.params.id;
  const fileName = "Not uploaded";

  if (req.files) {
    var file_path = req.files.image.path;
    var fileSplit = file_path.split("\\");
    const fileName = fileSplit[2];

    const fileExt = fileName.split(".")[1];

    if (fileExt === "png" || fileExt === "jpg") {
      User.findByIdAndUpdate(
        UserId,
        { image: fileName },
        { new: true },
        (err, userUpdated) => {
          if (err) {
            res
              .status(500)
              .send({ message: "Error al agregar avatar al usuario" });
          } else {
            res.status(200).send({ user: userUpdated });
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

  fs.exists(`./upload/users/${imageFile}`, exists => {
    if (exists) {
      res.sendFile(path.resolve(`./upload/users/${imageFile}`));
    } else {
      res.status(404).send({ message: "Image doesn't exist" });
    }
  });
};

module.exports = {
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  uploadImage,
  getImageFile
};
