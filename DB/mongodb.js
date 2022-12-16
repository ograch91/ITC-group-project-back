const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
// const { v4: uuidv4 } = require('uuid');

const user = process.env.NODE_JS_MONGODB_user;
const pass = process.env.NODE_JS_MONGODB_pass;
const cluster = process.env.NODE_JS_MONGODB_clust;
const uri=`mongodb+srv://${user}:${pass}@${cluster}/?retryWrites=true&w=majority`
;
console.log(uri);

let client = new MongoClient(uri);
let database = client.db('messaging-app');

// Ensures that the client will close when you finish/error
// await client.close();
class DbCollection {
  constructor(name) {
    this.collection = database.collection(name);
  }

  getByFilterEQ = async (key, value) => {
   return await this.collection.find({ [key]: value }).toArray();
  }

  get = async () => {
    try {
      return await this.collection.find().toArray();
    } catch (err) {
      return [];
    }
  };

  getById = async id => {
    const found = await this.collection.findOne({ _id: ObjectId(id) });
    return found;
  };

  add = async json => {
    // const newItem = {
      // ...json,
      // id: uuidv4(),
    // };
    const added = await this.collection.insertOne(json);
    return added;
  };

  deleteById = async id => {
    const deleted = await this.collection.deleteOne({ _id: ObjectId(id) });
    return deleted;
  };

  //!! json must be an object with the key to update not just value EG string
  updateItem = async (id, json) => {
    const found = await this.collection.findOne({ _id: ObjectId(id) });
    if (!found) {
      return;
    }
    await this.collection.updateOne({ _id: ObjectId(id) }, { $set: json });
    const updated = await this.collection.findOne({ _id: ObjectId(id) });
    return updated;
  };
}

module.exports = DbCollection;
