const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();
const helmet = require("helmet");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const db = require("./models");

const productTypeRouter = require("./routers/productTypeRouter");
const productRouter = require("./routers/productRouter");

db.sequelize
  .sync()
  .then(() => {
    console.log(`🍀 Mysql DB Connection`);
  })
  .catch(console.error());

const PORT = process.env.PORT;
const app = express();

// Server Side Setting

app.set("trust proxy", 1);
app.use(
  cors({
    origin: ["http://localhost:3000", "*"],
    credentials: true,
  })
);

// Compare Dev - Prod

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
  app.use(helmet());
  app.use(hpp());
}

// Standard Server Settings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET)); // dotenv의 COOKIE_SECRET을 통해 쿠키 암호화

app.use(
  session({
    saveUninitialized: false, // ex) 어떤 계정에 로그인 했다가 다른 계정에 로그인 할 시 초기화하지 않을 것인가
    resave: false, // 로그인한 모든 계정을 저장해둘 것인가
    secret: process.env.COOKIE_SECRET,
    proxy: true, // 서로 다른 pc 서버일때 연결해주기 위해
    cookie: {
      httpOnly: true, // 스크립트 공격 방지용
      secure: true,
      //   domain: "", // 프론트 컴퓨터의 Ip 주소를 넣어야 함
    },
  })
);

app.get("/", (req, res, next) => {
  return res.status(200).send("🍀 Express REST FULL API Server Called!");
});

app.use("/api/productType", productTypeRouter);
app.use("/api/product", productRouter);

app.listen(PORT, () => {
  console.log(`🍀 http://localhost:${PORT} Web Express Server Start`);
});
