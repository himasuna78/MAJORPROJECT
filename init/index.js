const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/StaxAxis";

main()
  .then(() => {
    console.log("connected to DB");
    initDB();
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  console.log("✅ Old data deleted");

  const listingsWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: "68cef9f4fb5e4d8bdbc82036",
  }));

  await Listing.insertMany(listingsWithOwner);

  console.log("✅ Data was initialized successfully!");

  mongoose.connection.close();
};
