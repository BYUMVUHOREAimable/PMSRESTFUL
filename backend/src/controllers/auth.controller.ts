import { compareSync, hashSync } from "bcrypt";

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma-client";
import ServerResponse from "../utils/ServerResponse";
import { sendOtpEmail } from "../utils/email";

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) return ServerResponse.error(res, "Invalid email or password");
    if (!user.isVerified) return ServerResponse.error(res, "User not verified");
    const isMatch = compareSync(password, user.password);
    if (!isMatch) return ServerResponse.error(res, "Invalid email or password");
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "3d" }
    );
    return ServerResponse.success(res, "Login successful", { user, token });
  } catch (error) {
    console.log(error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { otpCode } = req.body;

    const otp = await prisma.otp.findFirst({
      where: {
        otpCode,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!otp) {
      return ServerResponse.error(res, "Invalid or expired OTP", 400);
    }
    await prisma.user.update({
      where: {
        id: otp.userId,
      },
      data: {
        isVerified: true,
      },
    });
    await prisma.otp.delete({
      where: {
        id: otp.id,
      },
    });
    return ServerResponse.success(res, "OTP verified successfully");
  } catch (error: any) {
    if (error.code === "P2002") {
      const key = error.meta.target[0];
      return ServerResponse.error(
        res,
        `${key.charAt(0).toUpperCase() + key.slice(1)} (${
          req.body[key]
        }) already exists`,
        400
      );
    }
    return ServerResponse.error(res, "Error occured", { error });
  }
};
export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return ServerResponse.error(res, "User not found", 404);
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    try {
      await sendOtpEmail(email, code);
      console.log("OTP email sent to:", email);
    } catch (e) {
      console.error("Email send failed:", e);
      return ServerResponse.error(
        res,
        "Failed to send OTP email. Please try again later.",
        500
      );
    }
    await prisma.otp.updateMany({
      where: {
        userId: user.id,
      },
      data: {
        otpCode: code,
        expiresAt,
      },
    });
    return ServerResponse.success(res, "OTP resent successfully");
  } catch (error: any) {
    if (error.code === "P2002") {
      const key = error.meta.target[0];
      return ServerResponse.error(
        res,
        `${key.charAt(0).toUpperCase() + key.slice(1)} (${
          req.body[key]
        }) already exists`,
        400
      );
    }
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const requestResetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return ServerResponse.error(res, "User not found", 404);
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    try {
      await sendOtpEmail(email, code);
      console.log("OTP email sent to:", email);
    } catch (e) {
      console.error("Email send failed:", e);
      return ServerResponse.error(
        res,
        "Failed to send OTP email. Please try again later.",
        500
      );
    }
    await prisma.otp.create({
      data: {
        otpCode: code,
        expiresAt,
        userId: user.id,
      },
    });
    return ServerResponse.success(res, "OTP sent successfully");
  } catch (error: any) {
    if (error.code === "P2002") {
      const key = error.meta.target[0];
      return ServerResponse.error(
        res,
        `${key.charAt(0).toUpperCase() + key.slice(1)} ${key} already exists`,
        400
      );
    }
    return ServerResponse.error(res, "Error occured", { error });
  }
};
const resetPassword = async (req: Request, res: Response) => {
  try {
    const { otpCode, password } = req.body;
    const otp = await prisma.otp.findFirst({
      where: {
        otpCode,
        expiresAt: {
          gte: new Date(),
        },
      },
    });
    if (!otp) {
      return ServerResponse.error(res, "Invalid or expired OTP", 400);
    }
    const user = await prisma.user.findUnique({
      where: {
        id: otp.userId,
      },
    });
    if (!user) {
      return ServerResponse.error(res, "User not found", 404);
    }
    const hashedPassword = hashSync(password, 10);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });
    return ServerResponse.success(res, "Password reset successfully");
  } catch (error: any) {
    if (error.code === "P2002") {
      const key = error.meta.target[0];
      return ServerResponse.error(
        res,
        `${key.charAt(0).toUpperCase() + key.slice(1)} (${
          req.body[key]
        }) already exists`,
        400
      );
    }
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const authController = {
  login,
  verifyOtp,
  resendOtp,
  requestResetPassword,
  resetPassword,
};

export default authController;
