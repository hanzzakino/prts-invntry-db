import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_CLOUD_URI) {
    throw new Error('Invalid environment variable: "MONGODB_CLOUD_URI"')
}

const cloud_uri = process.env.MONGODB_CLOUD_URI
const options = {}

let cloudClient
let cloudClientPromise

cloudClient = new MongoClient(cloud_uri, options)
cloudClientPromise = cloudClient.connect()

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the cloudClient can be shared across functions.
export default cloudClientPromise
