const _ = require('lodash');
const functions = require('firebase-functions');
const { success, fail } = require('../../../lib/util');
const sc = require('../../../constants/statusCode');
const rm = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { reviewDB } = require('../../../db');
const dayjs = require('dayjs');

/**
 * @route GET /review
 * @desc 내가 작성한 후기를 조회합니다.
 */
module.exports = async (req, res) => {
  const userId = req.user.id;

  let client;

  try {
    client = await db.connect(req);

    const data = await reviewDB.getMyReviews(client, userId);
    res.status(sc.OK).send(success(sc.OK, rm.READ_MY_REVIEWS_SUCCESS, data));
  } catch (error) {
    console.log(error);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
