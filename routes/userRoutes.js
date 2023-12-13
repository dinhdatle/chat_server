import { Router } from "express";
import {
  allUsers,
  authUser,
  registerUser,
} from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const usersRouter = Router();

usersRouter.post("/", registerUser);
usersRouter.post("/login", authUser);
usersRouter.get("/", protect, allUsers);

export default usersRouter;
