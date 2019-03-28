# 소켓전송 클라이언트

## 구성
- user interface library
  > react.js
  
  > next.js (ssr)

- type check compiler
  > typescript

- linter
  > tslint

- style
  > scss

- deploy
  > heroku

- source controller
  > git
  
  > heroku git

- test
  > react-testing-library
  > jest

- code 리팩토링 관련툴
  > https://www.codefactor.io/repository/github/chane81/socket-client-node

# heroku

## testing 관련
### `jest + react-testing-library` 를 쓸 경우
  - yarn 설치
    ```
      yarn add jest jest-dom react-testing-library @types/jest --dev
    ```
  - packace.json 에 아래와 같이 jest config 를 추가 한다.
    ```json
      "jest": {
        "verbose": true,
        "moduleFileExtensions": [ "ts", "tsx", "js" ],
        "globals": {
          "ts-jest": {
            "babelConfig": true
          }
        },
        "moduleNameMapper": {
          "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/mocks.js",
          "\\.(css|less|scss)$": "<rootDir>/__mocks__/mocks.js"
        },
        "testPathIgnorePatterns": [ "<rootDir>/.next/", "<rootDir>/node_modules/" ],
        "snapshotResolver": "<rootDir>/config/snapshotResolver.js"
      }
    ```
  - 참고
  - 'react-testing-library/cleanup-after-each'; 는 각 테스트 마다 render 했던 객체들을 파기시키기 때문에 전역으로 render 해서 쓰는 변수가 있다면 선언하지 않고 쓰면 된다.
### `jest + enzyme`를 쓸 경우
  - yarn 설치
    ```
      yarn add jest jest-dom enzyme enzyme-adapter-react-16 @types/enzyme @types/enzyme-adapter-react-16 @types/jest --dev
    ```
  - packace.json 에 아래와 같이 jest config 를 추가 한다. 위와 틀린건 `"setupFiles"`부분 이다.
    - jest.setup.js 에 enzyme 를 사용하기 위한 설정이 들어가기 때문
    ```json
      "jest": {
        "verbose": true,
        "moduleFileExtensions": [ "ts", "tsx", "js" ],
        "globals": {
          "ts-jest": {
            "babelConfig": true
          }
        },
        "moduleNameMapper": {
          "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/mocks.js",
          "\\.(css|less|scss)$": "<rootDir>/__mocks__/mocks.js"
        },
        "testPathIgnorePatterns": [ "<rootDir>/.next/", "<rootDir>/node_modules/" ],
        "snapshotResolver": "<rootDir>/config/snapshotResolver.js",
        "setupFiles": [ "<rootDir>/config/jest.setup.js" ]
      }
    ```
  - config 폴더에 `jest.setup.js` 파일을 추가하고 아래 내용을 기입한다.
    ```js
      import { configure } from 'enzyme'
      import Adapter from 'enzyme-adapter-react-16'

      configure({ adapter: new Adapter() })
    ```
### jest 테스팅 스크립트 부분(package.json)
  - `--verbose` 옵션을 주면 테스팅 `디스크립션`도 표시해준다.(또는 package.json 설정에서 `"verbose": true` 를 넣어줘도 된다.)
    ```json
      "scripts": {
        ...
        "test": "jest --verbose",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage",
        ...
      }
    ```
### snapshot 파일 디렉토리 경로 설정
  - 스냅샷 경로에 대해서 최상위 경로의 "__snapshots__" 폴더에 파일이 들어가게 위한 설정
  - package.json 의 jest 설정부분에 아래 설정 추가
    ```json
      "jest": {
        ...
        "snapshotResolver": "<rootDir>/config/snapshotResolver.js"
        ...
      }
    ```
  - config 폴더에 snapshotResolver.js 를 생성하고 아래 내용 추가
    ```js
      module.exports = {
        resolveSnapshotPath: (testPath, snapshotExtension) =>
          testPath.replace('__tests__', '__snapshots__') + snapshotExtension,

        resolveTestPath: (snapshotFilePath, snapshotExtension) =>
          snapshotFilePath
            .replace('__snapshots__', '__tests__')
            .slice(0, -snapshotExtension.length),

        testPathForConsistencyCheck: '_/__tests__/_.test.js',
      };
    ```

### enzyme의 mount vs shallow
  - mount
    - 모든 라이프사이클 훅이 호출된다.
  - shallow
    - componentDidMount, componentDidUpdate 를 제외하고 라이프사이클 훅이 호출된다.

## heroku 버전
- heroku --version

## login
heroku login -i

## 로그 실시간 보기
- heroku logs -t

## git 릴리즈 보기
- heroku releases

## 해당버전으로 롤백
- heroku rollback v12

## 3rd-party buildpacks
- heroku plugins:install heroku-repo

## 브랜치 push
- git push heroku testbranch:master(브랜치 푸쉬)

## scale
- heroku ps:scale web=1

## 배포
- next.js 의 export
  - next build 로 빌드한 파일들이 생성되면 next export 로 정적페이지를 생성할 수 있다.

- package.json
  - start 시에 `server.js 를 쓰지 않을 경우` 아래와 같이 하고 heroku 에 배포
    ```json
      "start": "next start -p $PORT"
    ```
  - start 시에 `server.js 를 node 로 쓸 경우` 아래와 같이 하고 heroku 에 배포
    ```json
      "start": "node server.js"
    ```

- heroku
  ```
  heroku login
  heroku remote -v
  heroku git:remote -a socket-client-node
  git add .
  git commit -m "수정내역"
  git push -f heroku master
  heroku logs -t
  heroku logs -a socket-client-node -t
  ```

# styled-components
## 세팅
- yarn
  ```
    yarn add styled-components
    yarn add babel-plugin-styled-components --dev
  ```

- .babelrc
  ```json
    "plugins": [["styled-components", { "ssr": true }]]
  ```

# styled-jsx
## typescript 를 쓰는 환경에서 styled-jsx 를 쓰고자 할 때 아래를 설치
- yarn
  ```
  yarn add @types/styled-jsx
  ```

## scss 스타일을 쓰고 싶을 때 세팅
- yarn
  ```
  yarn add node-sass styled-jsx-plugin-sass
  ```

- .babelrc
  ```json
    {
      "presets": [
        [
          "next/babel",
          {
            "styled-jsx": {
              "plugins": [
                "styled-jsx-plugin-sass"
              ]
            }
          }
        ]
      ]
    }
  ```

## styled-jsx 를 쓸 때 유의점
- styled-jsx 를 쓸 때 css 인텔리센스가 나오지 않기 때문에 `styled-jsx Language Server` 익스텐션을 깔고 쓰면 인텔리센스가 뜬다.
- 다만, 아래와 같이 중괄호가 `<style>` 태그 아래에 있으면 `styled-jsx Language Server` 인텔리센스가 나오지 않고 출력창에 오류가 뜬다
  ```html
  <style jsx>
  {`
    input { width: 100px; }
  `}
  </style>
  ```
- 아래와 같이 중괄호와 `<style>` 태그를 붙여서 써야 인텔리센스도 나오고 출력창에 오류도 나오지 않는다.
  ```html
  <style jsx>{`
    input { width: 100px; }
  `}</style>
  ```

# lint 관련
## tslint 와 prettier 충돌방지를 위한 plugin 설치
- yarn
  ```
    yarn add tslint-config-prettier --dev
  ```
- tslint.json 에 "tslint-config-prettier" 추가
  ```json
    "extends": [
      ...
      "tslint-config-prettier"
    ],
  ```


# 개발이슈
- mobx 상태값을 remove 할 때 lodash의 remove(또는 pull) 를 썼는데 오류가 발생하였다.
  - lodash 의 remove 의 경우 replace 가 일어나고 해당 값 delete 가 일어나는 것을 patch 이벤트를 통해 확인이 되었다.
  - 방법은 findIndex 를 하여 idx 를 구한후 splice 를 쓰면 오류를 잡을 수 있었다.
  - 참고 URL
    - https://github.com/vuejs/vue/issues/2673
  - 오류 소스
    ```js
      _.remove(self.users, (data) => data.uniqueId === userModel.uniqueId);
      // 또는
      _.pullAllBy(self.users, [ { uniqueId: userModel.uniqueId } ], 'uniqueId');	
    ```
  - 수정된 소스
    ```js
      const idx = _.findIndex(self.users, { uniqueId: userModel.uniqueId });
      self.users.splice(idx, 1);
    ```
  - 참고
    ![](/static/images/screen2.png)

- typescript 환경에서 scss 를 사용할 때 scss 를 import 할 경우 모듈을 찾을 수 없다고 에러메시지가 나온다.
  - typings 폴더 생성후 declarations.d.ts 안에 아래 구문 추가
    ```ts
      declare module '*.scss' {
        const content: {[className: string]: string};
        export = content;
      }
    ```
  - 참고 URL
    - https://github.com/zeit/next-plugins/issues/91
  
- mobx 를 쓰는 환경의 컴포넌트 ref 를 가져올 때 이슈
  - 부모컴포넌트가 자식컴포넌트의 ref를 가져오려고 할 때 해당 객체를 가져오지 못하는 이슈가 있었다.
  - `만약 inject로 감싸여진 환경이 아니라면 ref 는 잘 가져온다.`
  - `만약 자식 컴포넌트의 ref를 가져오는게 아닌 컴포넌트 내부의 엘리먼트 ref를 가져오는 것 이라면 문제 없다.`
  - 자식 컴포넌트가 `mobx store`를 사용하는 환경이라면 아래와 같이 `inject` 로 감싸여져서 export 를 할 것이다.
    ```js
      export default inject(({ store }) => ({ store }))(observer(ChatMsgBox));
    ```
  - 기본적으로 자식컴포넌트 ref 를 가져와 함수 호출하는 방식은 아래와 같다.
  - 하지만 ChatMsgBox 가 mobx inject 로 감싸여져 있다면 handleBoxClick() 는 아래와 같이 호출하여서는 에러가 난다.
    ```js
      public handleClick = () => {
		    this.chatMsgBox.handleBoxClick();
	    };

      <ChatMsgBox ref={(ref) => (this.chatMsgBox = ref)}/>
    ```
  - `해결방법`
    - 방법1
      - 아래와 같이 `wrappedInstance` 를 호출한 다음 내가 호출할 함수를 호출하면 잘 된다.
      - 다만 typescript 적용을 하지 않았으므로 handleBoxClick() 의 인텔리센스가 나오지 않음
      ```js
        // 선언
        private chatMsgBox;

        // 호출
        public handleClick = () => {
          this.chatMsgBox.wrappedInstance.handleBoxClick();
        };

        // jsx
        <ChatMsgBox ref={(ref) => (this.chatMsgBox = ref)}/>
      ```
    - 방법2: 인텔리센스가 나오게 하기
      - 아래와 같이 하면 `handleBoxClick()` 함수에 대한 인텔리센스가 나온다.
      - 자식 컴포넌트 부분 로직
        ```js
          // 외부에 노출할 함수나 엘리먼트들
          interface IChatMsgBoxObj {
            handleBoxClick: () => void;
            txtChat: HTMLInputElement;
          }

          // mobx inject 로 감싸져 export 가 되었으므로 wrappedInstance 로 노출해야함
          interface IChatMsgBox {
            wrappedInstance: IChatMsgBoxObj;
          }

          export { IChatMsgBox };
        ```
      - 부모 컴포넌트 부분 로직
        ```js
          // 인터페이스 가져오기
          import ChatMsgBox, { IChatMsgBox } from '../components/ChatMsgBox';

          // 선언
          private chatMsgBox: IChatMsgBox;

          // 호출
          this.chatMsgBox.wrappedInstance.handleBoxClick();

          // jsx
          <ChatMsgBox ref={(ref: any) => (this.chatMsgBox = ref)} />
        ```
- react-testing-library - 실서버 배포시에 생기는 오류
  - heroku 에 배포시에 빌드 성공은 하였으나 페이지 접속시 아래와 같은 에러가 발생하였다.
  - 로컬환경에서는 잘 돌아감
    ```
    Error: Cannot find module '@babel/runtime/regenerator'
    ```
    ![](/static/images/screen3.png)
  - `해결방법`
    - react-testing-library 을 devDependencies -> dependencies 옮기면 에러가 나지 않는다.




- mobx-state-tree 에서 types.reference 를 쓸 때 참조되는 모델의 데이터를 가져오지 못하는 이슈가 있었다.
  - 참조되는 데이터를 가져오기 위해서 해당 참조되는 스토어와 쓰는 스토어 모두 `identifier`(유일한값의 스토어명) 를 부여해야한다.
  ```js
    types.model('socketModel', {
      /** identifier 부여 예시 */
      identifier: types.optional(types.identifier, 'socketModel'),

      /** types.reference 예시 */
      userCollection: types.optional(
        types.reference(userCollectionStore.model),
        () => userCollectionStore.create
      )
    }
  ```
# heroku 클라이언트 URL
- https://socket-client-node.herokuapp.com/

# Screenshot
- 실행화면

  ![](/static/images/screen1.png)