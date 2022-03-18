const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

// 전체 유저 조회
const getAllUsers = async (client) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "user" u
    WHERE is_deleted = FALSE
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

// Id로 특정 유저 조회
const getUserById = async (client, userId) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "user" u
    WHERE id = $1
      AND is_deleted = FALSE
    `,
    [userId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// refreshToken으로 특정 유저 조회
const getUserByRfToken = async (client, refreshToken) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "user" u
    WHERE refresh_token = $1
      AND is_deleted = FALSE
    `,
    [refreshToken],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// 유저 존재 유무 판별
const checkAlreadyUser = async (client, idKey, token) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "user" u
    WHERE id_key = $1 AND refresh_token = $2
    `,
    [idKey, token],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// 특정 유저 refreshToken 조회
const getUserRefreshToken = async (client, userId) => {
  const { rows } = await client.query(
    `
    SELECT refresh_token FROM "user" u
    WHERE user_id = $1
      AND is_deleted = FALSE
    `,
    [userId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// 유저 재가입
const updateIsDeleted = async (client, userId) => {
  const { rows } = await client.query(
    `
    UPDATE "user" u
    SET is_deleted = FALSE, updated_at = now()
    WHERE id = $1
    RETURNING *
    `,
    [userId],
  );

  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// 유저 refreshToken 업데이트
const updateRefreshToken = async (client, userId, refreshToken) => {
  const { rows } = await client.query(
    `
    UPDATE "user" u
    SET refresh_token = $2, updated_at = now()
    WHERE id = $1
    RETURNING * 
    `,
    [userId, refreshToken],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// 특정 유저 삭제
const deleteUser = async (client, userId) => {
  const { rows } = await client.query(
    `
    UPDATE "user" u
    SET is_deleted = TRUE, updated_at = now()
    WHERE id = $1
    RETURNING *
    `,
    [userId],
  );

  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// 유저 가입
const addUser = async (client, refreshToken, idKey, nickname) => {
  const { rows } = await client.query(
    `
    INSERT INTO "user"
    (refresh_token, id_key, nickname)
    VALUES
    ($1, $2, $3)
    RETURNING *
    `,

    [refreshToken, idKey, nickname],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const updateUserNickname = async (client, userId, nickname) => {
  const { rows: existingRows } = await client.query(
    `
    SELECT * FROM "user"
    WHERE id = $1
       AND is_deleted = FALSE
    `,
    [userId],
  );

  if (existingRows.length === 0) return false;

  const { rows } = await client.query(
    `
    UPDATE "user" u
    SET nickname = $2, updated_at = now()
    WHERE id = $1
    RETURNING * 
    `,
    [userId, nickname],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const getUserInfo = async (client, token) => {
  const { rows } = await client.query(
    `
    SELECT id, nickname, image_url
    FROM "user" u
    WHERE refresh_token = $1
    `,

    [token],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByRfToken,
  checkAlreadyUser,
  getUserRefreshToken,
  updateIsDeleted,
  updateRefreshToken,
  deleteUser,
  addUser,
  updateUserNickname,
  getUserInfo,
};