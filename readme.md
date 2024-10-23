# RiverFlow嘻哈網站
RiverFlow是一個獨特的嘻哈網站平台，目的為展現和推廣嘻哈文化，同時提供相關商品銷售和活動售票服務。

## 嘻哈文化介紹
* 嘻哈元素：從首頁引導用戶進入嘻哈文化的世界，詳細介紹了DJ、街舞、饒舌、塗鴉和滑板。

  <img src="https://i.ibb.co/rs1w77j/1022.gif" width=500>

* 活動售票：提供嘻哈節活動與節目票務服務，使用戶能便捷的參與嘻哈相關活動。

  <img src="https://i.ibb.co/Y0HJ24s/image.png" width=500>

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
