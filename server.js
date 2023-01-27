const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require('./app');

dotenv.config(); 
mongoose.set("strictQuery", false);

const { URI_DB } = process.env;

async function main() {
  try {
    await mongoose.connect(URI_DB);
    console.log("connected to db");

    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  } catch (error) {
    console.error("main failed:", error.message);
  }
}
main();

