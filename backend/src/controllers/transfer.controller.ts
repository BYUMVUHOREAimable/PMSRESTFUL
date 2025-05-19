import { Request, Response } from "express";
import { AuthRequest } from "../types";
import prisma from "../prisma/prisma-client";
import ServerResponse from "../utils/ServerResponse";
import { Prisma } from "@prisma/client";
import { paginator } from "../utils/paginator";
import { TransferStatus } from "../dtos/transfer.dto";

const createTransfer = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const { amount, toUserId, description, vehicleId } = authReq.body;
    const fromUserId = authReq.user.id;

    if (fromUserId === toUserId) {
      return ServerResponse.error(res, "Cannot transfer to yourself");
    }

    const toUser = await prisma.user.findUnique({ where: { id: toUserId } });
    if (!toUser) {
      return ServerResponse.error(res, "Recipient user not found");
    }
    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: vehicleId,
      },
    });
    if (vehicle?.userId != fromUserId)
      return ServerResponse.unauthorized(
        res,
        "u ae not owner of this vehicle "
      );
    const itransfer = await prisma.vehicleTransfer.findFirst({
      where: {
        fromUserId: fromUserId,
        toUserId,
        vehicleId,
      },
    });
    if (itransfer)
      return ServerResponse.unauthorized(
        res,
        " this vehicle has  been already transferred to this user "
      );
    const transfer = await prisma.vehicleTransfer.create({
      data: {
        vehicleId,
        price: amount,
        fromUserId,
        toUserId,
        description,
        status: TransferStatus.PENDING,
      },
    });

    return ServerResponse.success(res, "Transfer request created", {
      transfer,
    });
  } catch (error) {
    console.error(error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const fetchAllTransfers = async (req: Request, res: Response) => {
  try {
    const { page, limit, searchKey } = req.query;

    const whereCondition: Prisma.VehicleTransferWhereInput = {};

    if (searchKey) {
      whereCondition.OR = [
        { description: { contains: searchKey as string, mode: "insensitive" } },
        { fromUserId: { contains: searchKey as string, mode: "insensitive" } },
        { toUserId: { contains: searchKey as string, mode: "insensitive" } },
      ];
    }

    const take = limit ? Number(limit) : 10;
    const skip = page && limit ? (Number(page) - 1) * take : 0;

    const transfers = await prisma.vehicleTransfer.findMany({
      where: whereCondition,
      skip,
      take,
      include: {
        fromUser: true,
        toUser: true,
        vehicle: true,
      },
    });

    const total = await prisma.vehicleTransfer.count({ where: whereCondition });

    return ServerResponse.success(res, "Transfers fetched successfully", {
      transfers,
      meta: paginator({
        page: page ? Number(page) : 1,
        limit: take,
        total,
      }),
    });
  } catch (error) {
    console.error(error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const fetchTransferById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const transfer = await prisma.vehicleTransfer.findUnique({
      where: { id },
      include: {
        fromUser: true,
        toUser: true,
      },
    });

    if (!transfer) {
      return ServerResponse.notFound(res, "Transfer not found");
    }

    return ServerResponse.success(res, "Transfer fetched successfully", {
      transfer,
    });
  } catch (error) {
    console.error(error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const approveTransfer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const transfer = await prisma.vehicleTransfer.findUnique({ where: { id } });
    if (!transfer) return ServerResponse.notFound(res, "Transfer not found");

    if (transfer.status !== TransferStatus.PENDING) {
      return ServerResponse.error(res, "Transfer is already processed");
    }
    await prisma.vehicle.update({
      where: { id: transfer.vehicleId },
      data: {
        userId: transfer.toUserId,
      },
    });

    await prisma.vehicleTransfer.update({
      where: { id },
      data: { status: TransferStatus.APPROVED },
    });

    return ServerResponse.success(res, "Transfer approved successfully");
  } catch (error) {
    console.error(error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const rejectTransfer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const transfer = await prisma.vehicleTransfer.findUnique({ where: { id } });
    if (!transfer) return ServerResponse.notFound(res, "Transfer not found");

    if (transfer.status !== TransferStatus.PENDING) {
      return ServerResponse.error(res, "Transfer is already processed");
    }

    await prisma.vehicleTransfer.update({
      where: { id },
      data: { status: TransferStatus.REJECTED },
    });

    return ServerResponse.success(res, "Transfer rejected successfully");
  } catch (error) {
    console.error(error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const getMyTransfers = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user.id;
    const { page, limit, searchKey } = authReq.query;

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

    const whereCondition: Prisma.VehicleTransferWhereInput = {
    //   OR: [{ fromUserId: userId }, { toUserId: userId }],
    };

    if (searchKey) {
      whereCondition.AND = [
        {
          OR: [
            {
              description: {
                contains: searchKey as string,
                mode: "insensitive",
              },
            },
            {
              vehicle: {
                plateNumber: {
                  contains: searchKey as string,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
      ];
    }

    const take = limit ? Number(limit) : 10;
    const skip = page && limit ? (Number(page) - 1) * take : 0;

    const transfers = await prisma.vehicleTransfer.findMany({
      where: {
        OR: [
          {
            fromUserId: userId,
          },
          {
            toUserId: userId,
          },
        ],
        ...whereCondition,
      },
      include: {
        fromUser: true,
        toUser: true,
        vehicle: true,
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.vehicleTransfer.count({
      where: whereCondition,
    });

    return ServerResponse.success(res, "Your transfers fetched successfully", {
      transfers,
      meta: paginator({
        page: page ? Number(page) : 1,
        limit: take,
        total,
      }),
    });
  } catch (error) {
    console.error(error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const transferController = {
  createTransfer,
  fetchAllTransfers,
  fetchTransferById,
  approveTransfer,
  rejectTransfer,
  getMyTransfers,
};

export default transferController;
