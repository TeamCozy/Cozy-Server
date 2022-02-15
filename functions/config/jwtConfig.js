const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  secretKey: process.env.JWT_SECRET,
  options: {
    algorithm: process.env.JWT_ALGORITHM,
    expiresIn: process.env.JWT_EXPIRES,
    issuer: 'cozy',
  },
  refreshOptions: {
    algorithm: process.env.JWT_ALGORITHM,
    expiresIn: process.env.JWT_REFRESH_EXPIRES,
    issuer: 'cozy',
  },
};
