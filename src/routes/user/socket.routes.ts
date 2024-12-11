import express, { Router } from "express";
import { validate, validateView } from "../../middlewares/validate";
import validation from "../../validations/user/socket.validation";
import socketController from "../../controllers/user/socket.controller";
import auth from "../../middlewares/auth";
import { USER_TYPE } from "../../config/appConstant";

const router: Router = express.Router();

router.get(
  "/notificationListing",
  auth(USER_TYPE.USER),
  validate(validation.notificationListing),
  socketController.notificationListing
);

router.get(
  "/chats",
  auth(USER_TYPE.USER),
  validate(validation.getChats),
  socketController.getChats
);
