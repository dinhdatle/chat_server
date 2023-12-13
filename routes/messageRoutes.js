import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allMessages, sendMessage } from "../controllers/messageController.js";

const messageRouter = Router();

messageRouter.post("/", protect, sendMessage);
messageRouter.get("/:chatId", protect, allMessages);

export default messageRouter;
