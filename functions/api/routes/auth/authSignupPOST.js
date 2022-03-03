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

const existedUser = await userDB.checkAlreadyUser(client, idKey, token);


if (!existedUser) {
  type = 'Signup';
  //const { refreshToken } = jwt.createRefresh();
  const newUser = await userDB.addUser(client, token, idKey);
  //const { accessToken } = jwt.sign(newUser);
  res.status(statusCode.CREATED).send(util.success(statusCode.CREATED, responseMessage.CREATED_USER_SUCCESS, { type, token}));
  
}
//const { refreshToken } = jwt.createRefresh();
//const { accessToken } = jwt.sign(existedUser);

//if (existedUser.isDeleted) await userDB.updateIsDeleted(client, existedUser.id);
//await userDB.updateRefreshToken(client, existedUser.id, refreshToken);



res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.LOGIN_SUCCESS, { type, token }));

} catch (error) {
functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] error`);
console.log(error);
// 그리고 역시 response 객체를 보내줍니다.
res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
// finally문은 try문이 끝나든 catch문이 끝나든 반드시 실행되는 블록입니다.
// 여기서는 db.connect(req)를 통해 빌려온 connection을 connection pool에 되돌려줍니다.
// connection을 되돌려주는 작업은 반드시 이루어져야 합니다.
// 그렇지 않으면 요청의 양이 일정 수준을 넘어갈 경우 쌓이기만 하고 해결되지 않는 문제가 발생합니다.
} finally {
client.release();
}
};