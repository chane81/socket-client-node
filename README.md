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

## Screenshot
- &nbsp;

  ![](/static/images/screen1.png)