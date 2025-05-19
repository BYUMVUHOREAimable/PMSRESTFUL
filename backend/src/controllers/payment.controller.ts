import { Request, Response } from "express";
import { AuthRequest } from "../types";
import prisma from "../prisma/prisma-client";
import ServerResponse from "../utils/ServerResponse";
import { Prisma } from "@prisma/client";
import { paginator } from "../utils/paginator";

const createPayment = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const { amount, sessionId, method, plateNumber } = authReq.body;
    const session = await prisma.parkingSession.findUnique({
      where: { id: sessionId, plateNumber },
      include: { slot: true },
    });
    const userId = authReq.user.id;

    if (!session || session.paymentStatus === "PAID") {
      return ServerResponse.error(res, "Invalid session or already paid");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) return ServerResponse.unauthorized(res, "You are not logged in");
    await prisma.payment.create({
      data: {
        amount,
        method,
        session: {
          connect: {
            id: session?.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    await prisma.parkingSession.update({
      where: {
        id: session?.id,
      },
      data: {
        paymentStatus: "PAID",
      },
    });
    return ServerResponse.success(
      res,
      "payment done successfully , now ur car can exit "
    );
  } catch (error) {
    console.log(error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};
const fetchAllPayment = async (req: Request, res: Response) => {
  try {
    const { searchKey, page, limit } = req.query;

    if (parseInt(page as string) <= 0)
      return ServerResponse.error(
        res,
        "Page number cannot be less than or equal to 0"
      );
    if (parseInt(limit as string) <= 0)
      return ServerResponse.error(
        res,
        "Limit number cannot be less than or equal to 0"
      );

    const whereCondition: Prisma.PaymentWhereInput = {};
    if (searchKey) {
      whereCondition.OR = [
        { sessionId: { contains: searchKey as string, mode: "insensitive" } },
      ];
    }
    const payments = await prisma.payment.findMany({
      where: whereCondition,
      skip:
        page && limit
          ? (parseInt(page as string) - 1) * parseInt(limit as string)
          : 0,
      take: limit ? Number(limit) : 10,
    });
    const total = await prisma.payment.count({});
    return ServerResponse.success(res, "payments fetched successfully", {
      payments,
      meta: paginator({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        total,
      }),
    });
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const fetchPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        session: {
          include: {
            slot: true,
          },
        },
      },
    });
    if (!payment)
      return ServerResponse.notFound(res, `payment with id ${id} as not found`);
    return ServerResponse.success(res, "payment fetched successfully", {
      payment,
    });
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};
const fetchAllPaymentByUser = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest; // Typecast to use `user`

    const { page, limit } = authReq.query;
    const userId = authReq.user.id;

    if (parseInt(page as string) <= 0)
      return ServerResponse.error(
        res,
        "Page number cannot be less than or equal to 0"
      );
    if (parseInt(limit as string) <= 0)
      return ServerResponse.error(
        res,
        "Limit number cannot be less than or equal to 0"
      );

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) return ServerResponse.unauthorized(res, "You are not logged in");
    const payments = await prisma.payment.findMany({
      where: {
        user: user,
      },
      skip:
        page && limit
          ? (parseInt(page as string) - 1) * parseInt(limit as string)
          : 0,
      take: limit ? Number(limit) : 10,
    });
    const total = await prisma.payment.count({});
    return ServerResponse.success(
      res,
      "Payments by users fetched successfully",
      {
        payments,
        meta: paginator({
          page: page ? Number(page) : 1,
          limit: limit ? Number(limit) : 10,
          total,
        }),
      }
    );
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};
const paymentController = {
  createPayment,
  fetchAllPayment,
  fetchPaymentById,
  fetchAllPaymentByUser,
};
export default paymentController;
