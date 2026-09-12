require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const settings = await db.collection("sitesettings").findOne({ key: "primary" });
  console.log("Stored enquiryRecipientEmail:", settings?.enquiryRecipientEmail || "(not set in database)");
  process.exit(0);
})();
