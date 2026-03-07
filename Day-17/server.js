const app = require("./src/app"); // or wherever your app is
const connectToDb = require("./src/config/database");


connectToDb();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});