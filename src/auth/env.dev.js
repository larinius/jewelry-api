const dotenv = require('dotenv');

dotenv.config();


const clientOriginUrl = process.env.CLIENT_ORIGIN_URL;


if (!clientOriginUrl) {
    throw new Error(
        '.env is missing the definition of a APP_ORIGIN environmental variable'
    );
}

const clientOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  "http://192.168.0.4",
  "https://jevelry-store-av12.vercel.app",
  "https://jevelry-store-av12-3rn8h3fs3-larinius.vercel.app"
];

module.exports = {
    clientOriginUrl,
    clientOrigins,
};
