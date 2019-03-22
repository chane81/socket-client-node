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

# heroku

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
  
- MOBX 를 쓰는 환경의 컴포넌트 ref 를 가져올 때 이슈
  - 부모컴포넌트가 자식컴포넌트의 ref를 가져오려고 할 때 해당 객체를 가져오지 못하는 이슈가 있었다.
  - `만약 inject로 감싸여진 환경이 아니라면 ref 는 잘 가져온다.`
  - `만약 자식 컴포넌트의 ref를 가져오는게 아닌 컴포넌트 내부의 엘리먼트 ref를 가져오는 것 이라면 문제 없다.`
  - 자식 컴포넌트가 `MOBX STORE`를 사용하는 환경이라면 아래와 같이 `inject` 로 감싸여져서 export 를 할 것이다.
    ```js
      export default inject(({ store }) => ({ store }))(observer(ChatMsgBox));
    ```
  - 기본적으로 자식컴포넌트 ref 를 가져와 함수 호출하는 방식은 아래와 같다.
  - 하지만 ChatMsgBox 가 MOBX inject 로 감싸여져 있다면 handleBoxClick() 는 아래와 같이 호출하여서는 에러가 난다.
    ```js
      public handleClick = () => {
		    this.chatMsgBox.handleBoxClick();
	    };

      <ChatMsgBox ref={(ref) => (this.chatMsgBox = ref)}/>
    ```
  - `해결방법`
    - 아래와 같이 `wrappedInstance` 를 호출한 다음 내가 호출할 함수를 호출하면 잘 된다.
    ```js
      public handleClick = () => {
		    this.chatMsgBox.wrappedInstance.handleBoxClick();
	    };

      <ChatMsgBox ref={(ref) => (this.chatMsgBox = ref)}/>
    ```
    - 또는
    ```js
      public handleClick = () => {
		    this.chatMsgBox.handleBoxClick();
	    };

      <ChatMsgBox ref={(ref: any) => (this.chatMsgBox = ref.wrappedInstance)}/>
    ```


# heroku 클라이언트 URL
- https://socket-client-node.herokuapp.com/

# Screenshot
- 실행화면

  ![](/static/images/screen1.png)