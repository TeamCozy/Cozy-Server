const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const jwtHandlers = require('../../../lib/jwtHandlers');
const { firebaseAuth } = require('../../../config/firebaseClient');
const { signInWithEmailAndPassword } = require('firebase/auth');
const { userDB } = require('../../../db');
const { send } = require('../../../lib/slack');

//지윤 애플테스트
const axios = require('axios');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  const { socialtoken, provider, name } = req.body; //아 이름 어차피 앱에서 다시 받기로했나??
  // if (!provider || !name) {
  //   await send(`provider : ${provider}\nname : ${name}`);
  //   return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  // }
  let client;

  try {
    client = await db.connect(req);

    if (provider == 'kakao') {
      const userData = await userDB.getKakaoUserBySocialtoken(client, socialtoken);
      const exuser = await userDB.getUserBySocialId(client, userData.id);
      if (exuser) {
        const user = exuser;
        const accesstoken = jwtHandlers.socialSign(exuser);
        res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.LOGIN_SUCCESS, { user, accesstoken }));
      } else {
        const user = await userDB.addSocialUser(client, userData.properties.nickname, provider, userData.id);
        const accesstoken = jwtHandlers.socialSign(user);
        res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.CREATED_USER, { user, accesstoken }));
      }
    }

    if (provider == 'apple') {
      const getAppleUserBySocialtoken = async (appleAccessToken) => {
        //애플 토큰 해독해서 유저정보 확인
        try {
          const appleUser = jwt.decode(appleAccessToken);
          if (appleUser.email_verified == 'false') return null;
          return appleUser;
        } catch (err) {
          return null;
        }
      };
      const userData = await getAppleUserBySocialtoken(socialtoken);
      const exuser = await userDB.getUserBySocialId(client, userData.sub);
      if (exuser) {
        const user = exuser;
        const accesstoken = jwtHandlers.socialSign(exuser);
        res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.LOGIN_SUCCESS, { user, accesstoken }));
      } else {
        const user = await userDB.addSocialUser(client, name, provider, userData.sub);
        const accesstoken = jwtHandlers.socialSign(user);
        res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.CREATED_USER, { user, accesstoken }));
      }
    }
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);
    await send(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
