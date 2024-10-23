# 資料夾結構

```
/
│
├── /client  [前端相關文件]
│ ├── /public  [靜態文件]
│ │ ├── index.html
│ │ └── favicon.ico
│ ├── /src  [React檔案]
│ │ ├── /assets  [靜態文件：圖片／CSS等]
│ │ │ ├── /images
│ │ │ └── /styles
│ │ │ └── styles.css
│ │ ├── /components  [React元件]
│ │ │ ├── Header.js
│ │ │ └── Footer.js
│ │ ├── /pages  [React頁面級別元件]
│ │ │ ├── HomePage.js
│ │ │ └── AboutPage.js
│ │ ├── /services  [與API通信的文件]
│ │ │ └── api.js
│ │ ├── App.js  [主應用組件：定應結構和路由]
│ │ └── index.js  [APP進入點組件：渲染DOM]
│ └── package.json  [前端配置文件]
│
├── /server  [後端相關文件]
│ ├── /controllers  [req邏輯處理文件]
│ │ └── userController.js
│ ├── /models  [與db交互模組文件]
│ │ └── userModel.js
│ ├── /routes  [API路由文件]
│ │ └── userRoutes.js
│ ├── /middlewares  [中介文件]
│ │ └── authMiddleware.js
│ ├── app.js  [router統合接口、中介文件配置]
│ ├── server.js  [後端server啟動文件]
│ └── package.json
│
├── .gitignore
├── package.json
├── README.md
└── .env  [環境變量配置文件]
```

# 完整版

```
/
│
├── /client  [前端相關文件]
│ ├── /public  [靜態文件]
│ │ ├── index.html
│ │ └── favicon.ico
│ ├── /src  [React檔案]
│ │ ├── /assets  [靜態文件：圖片／CSS等]
│ │ │ ├── /images
│ │ │ └── /styles
│ │ │ └── styles.css
│ │ ├── /components  [React元件]
│ │ │ ├── Header.js
│ │ │ └── Footer.js
│ │ ├── /pages  [React頁面級別元件]
│ │ │ ├── HomePage.js
│ │ │ └── AboutPage.js
│ │ ├── /context  [ReactContext相關元件]
│ │ │ └── UserContext.js
│ │ ├── /hooks  [自定義hooks]
│ │ │ └── useAuth.js
│ │ ├── /services  [與API通信的文件]
│ │ │ └── api.js
│ │ ├── /utils  [工具函數]
│ │ │ └── helpers.js
│ │ ├── App.js  [主應用組件：定應結構和路由]
│ │ └── index.js  [APP進入點組件：渲染DOM]
│ ├── .gitignore  [git忽略文件]
│ ├── package.json  [前端配置文件]
│ └── README.md
│
├── /server  [後端相關文件]
│ ├── /controllers  [req邏輯處理文件]
│ │ └── userController.js
│ ├── /models  [與db交互模組文件]
│ │ └── userModel.js
│ ├── /routes  [API路由文件]
│ │ └── userRoutes.js
│ ├── /middlewares  [中介文件]
│ │ └── authMiddleware.js
│ ├── /config  [配置文件]
│ │ └── database.js
│ ├── app.js  [router統合接口、中介文件配置]
│ ├── server.js  [後端server啟動文件]
│ ├── .gitignore
│ ├── package.json
│ └── README.md
│
├── /tests  [前後端測試文件]
│ ├── /client
│ │ └── App.test.js
│ └── /server
│ └── userController.test.js
│
├── .gitignore
├── package.json
├── README.md
└── .env  [環境變量配置文件]
```
