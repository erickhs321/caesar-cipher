import { Router } from "express";
import axios from "axios";
import EncryptionController from "./app/controllers/EncryptionController";
import authMiddleware from "./app/middlewares/auth";

const routes = new Router();

routes.use(authMiddleware);

routes.get("/", EncryptionController.index);

routes.post("/", EncryptionController.store);

export default routes;
