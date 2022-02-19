const functions = require('firebase-functions');
const { success, fail } = require('../../../lib/util');
const sc = require('../../../constants/statusCode');
const rm = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { clinicDB } = require('../../../db');

/**
* @route GET /clinic/search?keyword={}
* @desc 진료소를 키워드로 검색합니다.
*/
module.exports = async (req, res) => {
  const { keyword } = req.query;
  
  if (!keyword) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_KEYWORD));
  
  let client;
  
  try {
    client = await db.connect(req);

    const clinics = await clinicDB.searchClinic(client, keyword);

    if (!clinics) return res.status(sc.OK).send(success(sc.OK, rm.NO_SEARCH_RESULT, clinics));

    console.log(clinics)
    
    res.status(sc.OK).send(success(sc.OK, rm.SEARCH_CLINIC_SUCCESS, clinics));
  } catch (error) {
    console.log(error);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
