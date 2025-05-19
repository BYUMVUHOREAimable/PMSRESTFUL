import { Router } from "express";
import authController from "../controllers/auth.controller";
import {
  LoginDTO,
  ResendOtpDTO,
  ResetPasswordDTO,
  VerifyOtpDTO,
} from "../dtos/auth.dto";
import { validationMiddleware } from "../middlewares/validator.middleware";

const authRouter = Router();

authRouter.post(
  "/login",
  [validationMiddleware(LoginDTO)],
  authController.login
);
authRouter.put(
  "/verify-otp",
  [validationMiddleware(VerifyOtpDTO)],
  authController.verifyOtp
);
authRouter.post(
  "/resend-otp",
  [validationMiddleware(ResendOtpDTO)],
  authController.resendOtp
);
authRouter.post("/request-reset-password", authController.requestResetPassword);
authRouter.post(
  "reset-password",
  [validationMiddleware(ResetPasswordDTO)],
  authController.resetPassword
);
export default authRouter;
