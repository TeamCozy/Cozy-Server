const _ = require('lodash');
const functions = require('firebase-functions');
const { success, fail } = require('../../../lib/util');
const sc = require('../../../constants/statusCode');
const rm = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { reviewDB } = require('../../../db');

/**
 * @route DELETE /review/:reviewId
 * @desc 후기 삭제
 */
module.exports = async (req, res) => {
  const { reviewId } = req.params;

  if (!reviewId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);

    await reviewDB.deleteReview(client, reviewId);
    return res.status(sc.OK).send(success(sc.OK, rm.DELETE_REVIEW_SUCCESS));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
