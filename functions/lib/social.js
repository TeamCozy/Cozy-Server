const axios = require('axios');
const jwt = require('jsonwebtoken');
const { NOT_INCLUDE_EMAIL, INVALID_USER } = require('../constants/social');

const kakaoAuth = async (kakaoAccessToken) => {
  console.log('🔑 Kakao 토큰을 Kakao API server에 요청하여 유저 정보를 확인할게요.');

  try {
    const user = await axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
      },
    });
    console.log("제발ㅈ발~!~!~!!!!!!!!!!!!!!!!!")
    const kakaoUser = user.data.kakao_account;

    if (!kakaoUser) return NOT_INCLUDE_EMAIL;
    if (!kakaoUser.is_email_valid || !kakaoUser.is_email_verified) return INVALID_USER;

    return kakaoUser;
  } catch (err) {
    return null;
  }
};


module.exports = { kakaoAuth };