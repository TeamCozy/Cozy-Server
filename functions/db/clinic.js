const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

// 전체 진료소 조회
const getAllClinics = async (client) => {
  const { rows } = await client.query(
    `
    SELECT id, lati, long FROM "clinic" c
    WHERE is_deleted = FALSE
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

// 특정 진료소 조회
const getClinicById = async (client, clinicId) => {
  const { rows } = await client.query(
    `
    SELECT id, name, location, time, cost, tel, status, emoji FROM "clinic" c
    WHERE id = $1
      AND is_deleted = FALSE
    `,
    [clinicId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// 진료소 검색
const searchClinic = async (client, keyword) => {
  const { rows } = await client.query(
    `
    SELECT id, name, location, status, emoji FROM "clinic" c
    WHERE name LIKE '%${keyword}%' OR location LIKE '%${keyword}%'
      AND is_deleted = FALSE
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = { getAllClinics, getClinicById, searchClinic };
