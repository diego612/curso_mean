const mongoose = require("mongoose");
const mongoURI = require("./config/config");

const app = require("./app");
const port = process.env.port || 5000;

mongoose.connect(
  mongoURI.mongoURI,
  { useNewUrlParser: true },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    }
  }
);
