import jwt from 'jsonwebtoken';
import config from '../config.js';
import { getCookie, setCookieDay } from './cookiesHelper';

/*
	JWT 토큰관련 라이브러리

	// 사용 예제코드
	public handleJwtMake = () => {
		const token = setTokenSign({ currentNickName: this.txtNickBox.current.value });
		const tokenVerify = getTokenVerify(token);

		console.log('token:', token);
		console.log('getToken', tokenVerify);
	};
*/

// 키
const privateKey: string = config.jwtPrivateKey;

// 토큰 sign
const setTokenSign = (payload: any): string => {
	const token = jwt.sign(
		{
			data: payload
			// exp: (Math.floor(Date.now() / 1000) + 60 * 60) * 24 // 1day
		},
		privateKey,
		{
			expiresIn: '7d' // 7day
		}
	);

	// 토큰 쿠키로 저장(10일)
	setCookieDay({ key: 'token', value: token, expire: 10 });

	return token;
};

// 토근 검증
const getTokenVerify = (token: string) => {
	try {
		return {
			info: jwt.verify(token, privateKey),
			success: true
		};
	} catch (err) {
		return {
			info: '',
			success: false
		};
	}
};

// 쿠키로 저장한 토큰 가져오기
const getToken: any = () => getCookie('token');

export { getToken, getTokenVerify, setTokenSign };
