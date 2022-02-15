const jwt = require('jsonwebtoken');
const { secretKey, options, refreshOptions } = require('../config/jwtConfig');
const { TOKEN_EXPIRED, TOKEN_INVALID } = require('../constants/jwt');

module.exports = {
  sign: user => {
    const payload = {
      id: user.id,
    };
    const result = {
      accessToken: jwt.sign(payload, secretKey, options),
    };

    return result;
  },
  verify: token => {
    let decoded;

    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error) {
      if (error.message === 'jwt expired') {
        return TOKEN_EXPIRED;
      } else if (error.message === 'invalid token') {
        return TOKEN_INVALID;
      } else {
        return TOKEN_INVALID;
      }
    }

    return decoded;
  },
  createRefresh: () => {
    const result = {
      refreshToken: jwt.sign({}, secretKey, refreshOptions),
    };

    return result;
  },
};
