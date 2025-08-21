const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const passwordHash = await bcrypt.hash("salasana123", 10);

  const user = new User({
    companyId: "company123",
    email: "asiakas@firma.fi",
    passwordHash
  });

  await user.save();
  console.log("✅ User created");
  mongoose.disconnect();
});