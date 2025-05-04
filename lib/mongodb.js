import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development, it's safe to use a global variable to store the MongoDB client.
  // This is to prevent the MongoClient from being reinitialized during hot reloading.
  clientPromise = global._mongoClientPromise || (global._mongoClientPromise = client.connect());
} else {
  // In production, it's safe to directly return the promise from client.connect()
  clientPromise = client.connect();
}

export default clientPromise;
