const app = require("./src/app");
const connectToDB = require("./src/config/database.js");

connectToDB()
  .then(() => {
    console.log("Connected to DB");
    app.listen(3000, () => {
      console.log("Server is running on the port 3000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });