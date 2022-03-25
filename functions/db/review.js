const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

// 특정 진료소 리뷰 조회
const getClinicReviews = async (client, clinicId) => {
  const { rows } = await client.query(
    `
    SELECT r.id, r.user_id, r.created_at, r.content, r.emoji, u.nickname, u.image_url FROM "review" r
    INNER JOIN "user" u on u.id = r.user_id
    WHERE clinic_id = $1
      AND r.is_deleted = FALSE
      AND u.is_deleted = FALSE
    ORDER BY r.created_at DESC
    `,
    [clinicId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = { getClinicReviews };
