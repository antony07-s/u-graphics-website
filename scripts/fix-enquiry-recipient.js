require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const result = await db.collection("sitesettings").updateOne(
    { key: "primary" },
    { $set: { enquiryRecipientEmail: "ugraphicsadvertising@gmail.com" } }
  );
  console.log("Updated:", result.modifiedCount, "document(s).");
  const check = await db.collection("sitesettings").findOne({ key: "primary" });
  console.log("New value:", check?.enquiryRecipientEmail);
  process.exit(0);
})();
