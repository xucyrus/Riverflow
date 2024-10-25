# RiverFlow嘻哈網站
RiverFlow是一個獨特的嘻哈網站平台，目的為展現和推廣嘻哈文化，同時提供相關商品銷售和活動售票服務。

專案展示：https://xucyrus.github.io/Riverflow/

## 嘻哈文化介紹
* 嘻哈元素：從首頁引導用戶進入嘻哈文化的世界，詳細介紹了DJ、街舞、饒舌、塗鴉和滑板。

  <img src="https://i.ibb.co/rs1w77j/1022.gif" width=500>

* 活動售票：提供嘻哈節活動與節目票務服務，使用戶能便捷的參與嘻哈相關活動。

  <img src="https://i.ibb.co/1G13W6H/1001-1.png" width=500>

* 週邊販售：提供多樣化的嘻哈相關商品，滿足粉絲和愛好者的需求。

  <img src="https://i.ibb.co/sy4bz4f/1001-2.png" width=500>

* 會員系統：讓用戶更好的管理個人資料，收藏喜愛商品以及查看訂單歷史。

  <img src="https://i.ibb.co/CQcX3cy/1001-3.png" width=500>

## 技術架構
專案採用前後端分離，前端使用 React 實現動態介面，後端透過 Node.js 提供 API 服務，確保系統的靈活性與可擴展性。

### 前端技術
* 框架：所使用的是 React 作為前端頁面，實現動態頁面渲染和元件化開發。
* 插件：Swiper、Lightbox2、SweetAlert2 提升用戶互動和視覺效果。
* 數據：通過 hooks 透過 RESTful API 與後端串接，動態更新前端頁面的資料（活動資訊及票券剩餘數量）。
* 金流：前端通過 API 與後端交互，並使用 ViewModel 管理支付狀態，完成 Stripe 金流支付功能。

### 後端技術
* 框架：Node.js + Express 負責 API 路由和邏輯處理。
* 資料庫：使用 MySQL 作為資料庫建構。
* 驗證：透過 JWT 進行會員驗證授權。

## 資料夾結構

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
