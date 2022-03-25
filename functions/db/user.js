const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');


// 유저 존재 유무 판별
const checkAlreadyUser = async (client, idKey) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "user" u
    WHERE id_key = $1
    `,
    [idKey],
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

const getUserInfo = async (client, idKey) => {
  const { rows } = await client.query(
    `
    SELECT *
    FROM "user"
    WHERE id_key=$1
    `,

    [idKey],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};


module.exports = {
  checkAlreadyUser,
  updateIsDeleted,
  addUser,
  getUserInfo
};