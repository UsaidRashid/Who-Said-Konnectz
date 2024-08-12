const mongoose = require("mongoose");
const mongoUrl = "mongodb://127.0.0.1:27017/Who-Said-Konnectz";

main()
  .then(() => {
    console.log("Successfully connected to Who-Said Konnectz Database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongoUrl);
}

module.exports = main;