const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI must be set in the service environment.');

const client = new MongoClient(uri, { maxPoolSize: 10 });
const databaseName = process.env.MONGODB_DATABASE || 'startup';
let collections;

async function connect() {
  await client.connect();
  const db = client.db(databaseName);
  await db.command({ ping: 1 });
  collections = {
    users: db.collection('user'),
    art: db.collection('portfolio'),
    chat: db.collection('chat'),
  };
  await collections.users.createIndex({ email: 1 }, { unique: true });
  await collections.art.createIndex({ userName: 1, title: 1 });
  await collections.chat.createIndex({ roomId: 1, createdAt: 1 });
  console.log(`Connected to MongoDB database ${databaseName}`);
}

function getUserByEmail(email) { return collections.users.findOne({ email }); }
function getUserByToken(token) { return collections.users.findOne({ token }); }
function addUser(user) { return collections.users.insertOne(user); }
function updateUser(user) {
  const { _id, ...fields } = user;
  return collections.users.updateOne({ _id }, { $set: fields });
}

function serializeArt(art) {
  if (!art) return null;
  const { _id, ...record } = art;
  return { ...record, id: _id.toString() };
}

async function getAllArt() {
  const arts = await collections.art.find({}).sort({ updated: -1 }).toArray();
  return arts.map(serializeArt);
}

async function getArt(id) {
  if (!ObjectId.isValid(id)) return null;
  return serializeArt(await collections.art.findOne({ _id: new ObjectId(id) }));
}

async function saveArt({ id, userName, title, artCsv }) {
  const now = new Date();
  if (ObjectId.isValid(id)) {
    const result = await collections.art.findOneAndUpdate(
      { _id: new ObjectId(id), userName },
      { $set: { title, artCsv, updated: now } },
      { returnDocument: 'after' },
    );
    return serializeArt(result);
  }
  const art = { userName, title, artCsv, created: now, updated: now };
  const result = await collections.art.insertOne(art);
  return serializeArt({ ...art, _id: result.insertedId });
}

async function deleteArt(id, userName) {
  if (!ObjectId.isValid(id)) return false;
  const result = await collections.art.deleteOne({ _id: new ObjectId(id), userName });
  await collections.chat.deleteMany({ roomId: id });
  return result.deletedCount === 1;
}

function getChat(roomId) {
  return collections.chat.find({ roomId }).sort({ createdAt: 1 }).limit(100).toArray();
}

async function addChat(message) {
  await collections.chat.insertOne(message);
  const excess = await collections.chat.find({ roomId: message.roomId })
    .sort({ createdAt: -1 }).skip(100).project({ _id: 1 }).toArray();
  if (excess.length) await collections.chat.deleteMany({ _id: { $in: excess.map((item) => item._id) } });
  return message;
}

module.exports = { connect, getUserByEmail, getUserByToken, addUser, updateUser, getAllArt, getArt, saveArt, deleteArt, getChat, addChat };
