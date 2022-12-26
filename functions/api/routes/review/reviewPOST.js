const functions = require('firebase-functions');
const { success, fail } = require('../../../lib/util');
const sc = require('../../../constants/statusCode');
const rm = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { clinicDB, reviewDB } = require('../../../db');

/**
 * @route POST /review
 * @desc 후기를 작성합니다.
 */
module.exports = async (req, res) => {
  const userId = req.user.id;
  const { clinicId, emojiId, content } = req.body;

  if (!clinicId || !emojiId || !content) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);

    const existedClinic = await clinicDB.getClinicById(client, clinicId);

    if (!existedClinic) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_CLINIC));
    }

    await reviewDB.createReview(client, userId, clinicId, emojiId, content);
    return res.status(sc.CREATED).send(success(sc.CREATED, rm.CREATE_REVIEW_SUCCESS));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
