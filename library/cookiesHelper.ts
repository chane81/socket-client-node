import universalCookies from 'universal-cookie';

const cookies = new universalCookies();
const defaultExpireHour = new Date(Date.now() + 1000 * 60 * 60 * 6); // 6시간 디폴트 쿠키
// const defaultExpireDay = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1day 디폴트 쿠키

// payload
class Payload {
	public key: string;
	public value: string;
	public expire?: number;
}

// 쿠키굽기, 쿠키종료 디폴트시간(6시간)
const setCookie = (payload: Payload): void => {
	cookies.set(payload.key, payload.value, { path: '/', expires: defaultExpireHour });
};

// 쿠키굽기, 쿠키종료 일단위
const setCookieDay = (payload: Payload): void => {
	// null 이면 디폴트 1일
	payload.expire = payload.expire ? payload.expire : 1;

	const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * payload.expire);
	cookies.set(payload.key, payload.value, { path: '/', expires });
};

// 쿠키굽기, 쿠키종료 시간단위
const setCookieHour = (payload: Payload): void => {
	// null 이면 디폴트 6시간
	payload.expire = payload.expire ? payload.expire : 6;

	const expires = new Date(Date.now() + 1000 * 60 * 60 * payload.expire);
	cookies.set(payload.key, payload.value, { path: '/', expires });
};

// 쿠키 가져오기
const getCookie = (key: string): any => {
	return cookies.get(key);
};

const setCookieDel = (key: string): void => {
	cookies.remove(key);
};

export { setCookie, setCookieDay, setCookieHour, getCookie, setCookieDel };
