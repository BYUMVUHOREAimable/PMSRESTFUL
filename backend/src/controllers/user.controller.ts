import { hashSync } from "bcrypt";
import { config } from "dotenv";
import { Request, Response } from "express";
import prisma from "../prisma/prisma-client";
import ServerResponse from "../utils/ServerResponse";
import { sendOtpEmail } from "../utils/email";
import { paginator } from "../utils/paginator";

config();

const createUser = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, password, role } = req.body;
    const hashedPassword = hashSync(password, 10);
    const iUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (iUser) {
      return ServerResponse.error(
        res,
        `User with email ${email} already exists`,
        400
      );
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
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        role,
        password: hashedPassword,
      },
    });
    await prisma.otp.create({
      data: {
        userId: user.id,
        otpCode: code,
        expiresAt,
      },
    });

    return ServerResponse.created(res, "User created successfully", { user });
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

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { searchKey, page, limit } = req.query;

    if (page && Number(page) <= 0)
      return ServerResponse.error(
        res,
        "Page number cannot be less than or equal to 0"
      );
    if (limit && Number(limit) <= 0)
      return ServerResponse.error(
        res,
        "Limit number cannot be less than or equal to 0"
      );

    // Build where condition based on searchKey
    const whereCondition: any = {};
    if (searchKey) {
      whereCondition.OR = [
        { email: { contains: searchKey as string, mode: "insensitive" } },
        { firstName: { contains: searchKey as string, mode: "insensitive" } },
        { lastName: { contains: searchKey as string, mode: "insensitive" } },
        { role: { contains: searchKey as string, mode: "insensitive" } },
      ];
    }

    // Fetch users with pagination
    const users = await prisma.user.findMany({
      where: whereCondition,
      skip: page && limit ? (Number(page) - 1) * Number(limit) : 0,
      take: limit ? Number(limit) : 10,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Count total matching users for pagination
    const total = await prisma.user.count({ where: whereCondition });

    return ServerResponse.success(res, "Users fetched successfully", {
      users,
      meta: paginator({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        total,
      }),
    });
  } catch (error) {
    console.error(error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const userController = {
  createUser,
  getAllUsers,
};

export default userController;
