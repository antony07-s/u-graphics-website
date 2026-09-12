require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const product = await db.collection("products").findOne({ title: "3D Printing Signage" });
  console.log("image field value:", JSON.stringify(product?.image));
  process.exit(0);
})();
