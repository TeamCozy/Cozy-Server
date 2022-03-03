const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { userDB } = require('../../../db');
module.exports = async (req, res) => {
const{accesstoken}=req.headers;

if (!accesstoken) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
let client;

try {

client = await db.connect(req);
const users = await userDB.getUserInfo(client);
// 성공적으로 users를 가져왔다면, response를 보내줍니다.
res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_ALL_USERS_SUCCESS, users));

} catch (error) {
functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] error`);
console.log(error);
// 그리고 역시 response 객체를 보내줍니다.
res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));

} finally {
client.release();
}
};