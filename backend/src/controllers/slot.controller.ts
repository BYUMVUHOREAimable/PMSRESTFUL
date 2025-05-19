import { Prisma } from "@prisma/client";
import { config } from "dotenv";
import { Request, Response } from "express";
import prisma from "../prisma/prisma-client";
import { AuthRequest } from "../types";
import ServerResponse from "../utils/ServerResponse";
import { paginator } from "../utils/paginator";

config();

const createParkingSlot = async (req: Request, res: Response) => {
  try {
    const { number, size, vehicleType, location } = req.body;

    const parkingSlot = await prisma.parkingSlot.create({
      data: {
        number,
        size,
        vehicleType,
        location,
      },
    });

    return ServerResponse.created(res, "Parking slot created successfully", {
      parkingSlot,
    });
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
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const createMultipleSlots = async (req: Request, res: Response) => {
  try {
    const slots = req.body.slots;
    console.log("====================================");
    console.log(slots);
    console.log("====================================");
    const createdSlots = await prisma.parkingSlot.createMany({
      data: slots,
      skipDuplicates: true,
    });

    return ServerResponse.created(res, "Parking slots created successfully", {
      count: createdSlots.count,
    });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const fetchParkingSlots = async (req: Request, res: Response) => {
  try {
    const { searchKey, page, limit, size, vehicleType } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;

    if (pageNum <= 0 || limitNum <= 0) {
      return ServerResponse.error(res, "Invalid pagination values");
    }

    const whereCondition: Prisma.ParkingSlotWhereInput = {};

    if (searchKey) {
      whereCondition.OR = [
        { number: { contains: searchKey as string, mode: "insensitive" } },
      ];
    }

    if (size) whereCondition.size = size as any;
    if (vehicleType) whereCondition.vehicleType = vehicleType as any;

    const slots = await prisma.parkingSlot.findMany({
      where: whereCondition,
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    const total = await prisma.parkingSlot.count({ where: whereCondition });

    return ServerResponse.success(res, "Parking slots fetched successfully", {
      slots,
      meta: paginator({ page: pageNum, limit: limitNum, total }),
    });
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const fetchFreeSlots = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;

    const slots = await prisma.parkingSlot.findMany({
      where: { status: "AVAILABLE" },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    const total = await prisma.parkingSlot.count({
      where: { status: "AVAILABLE" },
    });

    return ServerResponse.success(res, "Free parking slots fetched", {
      slots,
      meta: paginator({ page: pageNum, limit: limitNum, total }),
    });
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const findById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const slot = await prisma.parkingSlot.findUnique({ where: { id } });

    if (!slot)
      return ServerResponse.notFound(
        res,
        `Parking slot with ID ${id} not found`
      );

    return ServerResponse.success(res, "Parking slot fetched successfully", {
      parkingSlot: slot,
    });
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const updateSlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { number, size, vehicleType, location, status } = req.body;
    const uSlot = await prisma.parkingSlot.findUnique({ where: { number } });
    if (uSlot)
      return ServerResponse.unauthorized(
        res,
        `Parking slot with number ${number} already exists`
      );
    const updatedSlot = await prisma.parkingSlot.update({
      where: { id },
      data: { number, size, vehicleType, location, status },
    });

    return ServerResponse.success(res, "Parking slot updated successfully", {
      parkingSlot: updatedSlot,
    });
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const deleteSlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.parkingSlot.delete({ where: { id } });

    return ServerResponse.success(res, "Parking slot deleted successfully");
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const parkingSlotController = {
  createParkingSlot,
  createMultipleSlots,
  fetchParkingSlots,
  fetchFreeSlots,
  findById,
  updateSlot,
  deleteSlot,
};

export default parkingSlotController;
