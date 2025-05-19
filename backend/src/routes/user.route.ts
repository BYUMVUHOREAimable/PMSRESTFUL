import { Router } from "express";
import userController from "../controllers/user.controller";
import { CreateUserDTO } from "../dtos/user.dto";
import { validationMiddleware } from "../middlewares/validator.middleware";

const userRouter = Router()

userRouter.post("/create", [validationMiddleware(CreateUserDTO)], userController.createUser)
userRouter.get("/all",  userController.getAllUsers)

export default userRouter