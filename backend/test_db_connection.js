require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("No MONGO_URI found in .env file!");
  process.exit(1);
}

const safeUri = uri.replace(/:([^:@]+)@/, ':****@');
console.log(`Testing MongoDB connection to: ${safeUri} ...\n`);

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Success! Authentication and connection passed.");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Failed to connect!");
    if (err.message.includes("bad auth")) {
      console.error("Reason: Incorrect username or password.");
    } else {
      console.error(`Reason: ${err.message}`);
    }
    process.exit(1);
  });
