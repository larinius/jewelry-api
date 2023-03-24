const dotenv = require('dotenv');

dotenv.config();


const clientOriginUrl = process.env.CLIENT_ORIGIN_URL;


if (!clientOriginUrl) {
    throw new Error(
        '.env is missing the definition of a APP_ORIGIN environmental variable'
    );
}

const clientOrigins = ['http://localhost:3000'];

module.exports = {
    clientOriginUrl,
    clientOrigins,
};
