/**
 * 사용자 config 세팅 여기서 함(.env 에서 설정하던 방식에서 변경)
 */

function getClientConfig() {
	const envVal = {
    // 개발환경 변수
		development: {
			SOCKET_SERVER_HOST: 'http://localhost:5000',
			JWT_PRIVATE_KEY: 'cloud99'
    },
    // 실서버환경 변수
		production: {
			SOCKET_SERVER_HOST: 'https://socket-server-node.herokuapp.com',
			JWT_PRIVATE_KEY: 'cloud99'
		}
	};

  // 실행환경
	// 'development' or 'production'
	const nodeEnv = process.env.NODE_ENV || 'development';

  // env 에 사용자 config 변수값 삽입
  const stringified = {
    'process.env': Object.keys(envVal[nodeEnv]).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
}

module.exports = getClientConfig;