const express = require("express");
const userRouter = express.Router();
const {
  register,
  postregister,
  getlogin,
  postlogin,
  getmine,
  get_otp,
  isAuthenticated,
  get_data,
  get_payment_data,
  change_password,
} = require("../controller/userController");
const {history_matches} = require('../controller/homeController')
userRouter.route("/")
  .get(register)
  .post(postregister);

userRouter
  .route("/login")
  .get(getlogin)
  .post(postlogin);

userRouter
  .route("/get_otp")
  .post(get_otp);

userRouter.use(isAuthenticated);
userRouter
  .route("/mine")
  .get(getmine);

userRouter.use(isAuthenticated);
userRouter
  .route("/user_data")
  .get(get_data);


userRouter.use(isAuthenticated);
userRouter
  .route('/password')
  .post(change_password)


userRouter.use(isAuthenticated);
userRouter
.route('/get_payment_data')
.get(get_payment_data)


userRouter.use(isAuthenticated);
userRouter
  .route("/get_history_matches")
  .get(history_matches);


module.exports = userRouter;
