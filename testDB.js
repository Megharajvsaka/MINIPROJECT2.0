const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://MiniProject:MiniProjectAtSuccess@fitnesstracker.oktdvrx.mongodb.net/?retryWrites=true&w=majority";

async function test() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected successfully!");
    await client.close();
  } catch (err) {
    console.error(err);
  }
}

test();
console.log("MONGODB_URI:", process.env.MONGODB_URI);