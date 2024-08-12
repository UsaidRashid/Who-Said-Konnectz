const mongoose = require("mongoose");
const mongoUrl = "mongodb+srv://usaid786:kjkszpj786@cluster0.psy0ody.mongodb.net/Who-Said-Konnectz?retryWrites=true&w=majority&appName=Cluster0";

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