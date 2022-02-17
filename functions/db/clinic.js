const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

// 전체 진료소 조회
const getAllClinics = async (client) => {
  const { rows } = await client.query(
    `
    SELECT id, lati, long FROM clinic c
    WHERE is_deleted = FALSE
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = { getAllClinics };
