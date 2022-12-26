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

// 내 리뷰 조회
const getMyReviews = async (client, userId) => {
  const { rows } = await client.query(
    `
    SELECT r.id, r.user_id, r.created_at, r.content, r.emoji, u.nickname, u.image_url FROM "review" r
    INNER JOIN "user" u on u.id = r.user_id
    WHERE r.user_id = $1
      AND r.is_deleted = FALSE
      AND u.is_deleted = FALSE
    ORDER BY r.created_at DESC
    `,
    [userId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

// 리뷰 삭제
const deleteReview = async (client, reviewId) => {
  await client.query(
    `
    UPDATE "review"
    SET is_deleted = TRUE
    WHERE id = $1
    `,
    [reviewId],
  );
};

// 리뷰 작성
const createReview = async (client, userId, clinicId, emojiId, content) => {
  const { rows } = await client.query(
    `
    INSERT INTO review
    (user_id, clinic_id, emoji_id, content)
    VALUES
    ($1, $2, $3, $4)
    RETURNING id
    `,
    [userId, clinicId, emojiId, content],
  );

  return convertSnakeToCamel.keysToCamel(rows[0]);
};

module.exports = { getClinicReviews, getMyReviews, deleteReview, createReview };
