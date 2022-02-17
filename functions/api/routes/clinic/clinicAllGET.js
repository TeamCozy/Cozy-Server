const functions = require('firebase-functions');
const { success, fail } = require('../../../lib/util');
const sc = require('../../../constants/statusCode');
const rm = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { clinicDB } = require('../../../db');

/**
* @route GET /clinic
* @desc 전체 진료소를 조회합니다.
*/
module.exports = async (req, res) => {  
  let client;
  
  try {
    client = await db.connect(req);

    const clinics = await clinicDB.getAllClinics(client);

    if (!clinics) return res.status(sc.OK).send(success(sc.OK, rm.NO_CLINIC, clinics));
    
    res.status(sc.OK).send(success(sc.OK, rm.READ_ALL_CLINICS_SUCCESS, clinics));
  } catch (error) {
    console.log(error);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
