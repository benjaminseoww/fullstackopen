require('dotenv').config();

const MONGO_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;
const PORT = process.env.PORT;
const SECRET = process.env.SECRET;

module.exports = {
    MONGO_URI,
    PORT,
    SECRET
}