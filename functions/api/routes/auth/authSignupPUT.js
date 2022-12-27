const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { userDB } = require('../../../db');
const jwtHandlers = require('../../../lib/jwtHandlers');

/**
 *  이름과 아이디(닉네임) 입력
 */

module.exports = async (req, res) => {
  const { accesstoken } = req.headers;
  const { name, nickname } = req.body;
  if (!accesstoken || !name || !nickname) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  let client;
  const decodedToken = jwtHandlers.verify(accesstoken);
  const userId = decodedToken.id;
  try {
    client = await db.connect(req);

    //닉네임 중복 검사
    const checkUser = await userDB.checkUserInfo(client, nickname);
    if (checkUser) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.ALREADY_NICKNAME));
    }
    const user = await userDB.addUserInfo(client, userId, name, nickname);
    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_ALL_USERS_SUCCESS, user));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] error`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
