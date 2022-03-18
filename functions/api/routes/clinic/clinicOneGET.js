const _ = require('lodash');
const functions = require('firebase-functions');
const { success, fail } = require('../../../lib/util');
const sc = require('../../../constants/statusCode');
const rm = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { clinicDB, reviewDB } = require('../../../db');
const dayjs = require('dayjs');

/**
* @route GET /clinic/:clinicId
* @desc 특정 진료소의 상세 정보를 조회합니다.
*/
module.exports = async (req, res) => {
  const { clinicId } = req.params;
  const userId = 1;
  
  if (!clinicId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  
  let client;
  
  try {
    client = await db.connect(req);

    const clinic = await clinicDB.getClinicById(client, clinicId);

    if (!clinic) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_CLINIC));

    const reviews = await reviewDB.getClinicReviews(client, clinicId);

    if (!reviews) return res.status(sc.OK).send(success(sc.OK, rm.READ_ONE_CLINIC_SUCCESS, _.merge(clinic, { reviews })));

    const data = _.merge(clinic, { 
      reviews: reviews.map(o => ({
        id: o.id,
        nickname: o.nickname,
        profileImage: o.imageUrl,
        date: dayjs(o.createdAt).format('YYYY.MM.DD'),
        content: o.content,
        emoji: o.emoji,
        isRemovable: (userId === o.userId) ? true : false,
      }))
    });

    res.status(sc.OK).send(success(sc.OK, rm.READ_ONE_CLINIC_SUCCESS, data));
  } catch (error) {
    console.log(error);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
