const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { userDB } = require('../../../db');
const { NOT_INCLUDE_EMAIL, INVALID_USER } = require('../../../constants/social');
const axios = require('axios');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {

const {token, idKey} = req.body;
if (!idKey || !token) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
let client;

try {
client = await db.connect(req);


const kakaoAuth = async (kakaoAccessToken) => {
  try {
    const user = await axios({
      method: 'POST',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
      },
    });
    const kakaoUser = user.data.kakao_account;
    if (!kakaoUser) return NOT_INCLUDE_EMAIL;
    if (!kakaoUser.is_email_valid || !kakaoUser.is_email_verified) return INVALID_USER;
    return kakaoUser;
  } catch (err) {
    return null;
  }
};
let user;
let type = 'Login';
user = kakaoAuth(token);

if (user === INVALID_USER) res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, responseMessage.UNAUTHORIZED_SOCIAL));

if (!user) res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, responseMessage.UNAUTHORIZED_SOCIAL));

const existedUser = await userDB.checkAlreadyUser(client, idKey);

if (!existedUser) {
  type = 'Signup';
  //const { refreshToken } = jwt.createRefresh();
  let nickname = "촉촉한 초코칩";
  const newUser = await userDB.addUser(client, token, idKey, nickname);
  //const { accessToken } = jwt.sign(newUser);
  res.status(statusCode.CREATED).send(util.success(statusCode.CREATED, responseMessage.CREATED_USER_SUCCESS, {type, newUser})); 
}
if (existedUser.isDeleted) await userDB.updateIsDeleted(client, existedUser.id);


res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.LOGIN_SUCCESS, { type, existedUser }));

} catch (error) {
functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] error`);
console.log(error);

res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));

} finally {
client.release();
}
};