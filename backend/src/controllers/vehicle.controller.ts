import { Request, Response } from "express";
import { AuthRequest } from "../types";
import prisma from "../prisma/prisma-client";
import ServerResponse from "../utils/ServerResponse";
import { SlotSize, VehicleType } from "../enum";
import { Prisma } from "@prisma/client";
import { paginator } from "../utils/paginator";

// Validation helper for Rwanda plate numbers (no spaces, uppercase alphanumeric)
const isValidPlateNumber = (plate: string): boolean => {
  const regex = /^[A-Z0-9]+$/;
  return regex.test(plate);
};

const createVehicle = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const { vehicleType, plateNumber, size, color, maker, model } =
      authReq.body;
    const userId = authReq.user.id;

    if (!vehicleType || !plateNumber || !size || !color || !maker || !model) {
      return ServerResponse.error(res, "All vehicle fields are required");
    }

    if (!isValidPlateNumber(plateNumber)) {
      return ServerResponse.error(res, "Invalid plate number format");
    }

    // Check if vehicle with plate number already exists for the user
    const existingVehicle = await prisma.vehicle.findFirst({
      where: { plateNumber },
    });
    if (existingVehicle) {
      return ServerResponse.error(
        res,
        "Vehicle with this plate number already exists"
      );
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        vehicleType,
        plateNumber,
        size,
        color,
        maker,
        model,
        user: { connect: { id: userId } },
      },
    });

    return ServerResponse.success(res, "Vehicle created successfully", {
      vehicle,
    });
  } catch (error) {
    console.error(error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const fetchAllVehicle = async (req: Request, res: Response) => {
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

    const whereCondition: Prisma.VehicleWhereInput = {};
    if (searchKey) {
      whereCondition.OR = [
        { plateNumber: { contains: searchKey as string, mode: "insensitive" } },
        { maker: { contains: searchKey as string, mode: "insensitive" } },
        { model: { contains: searchKey as string, mode: "insensitive" } },
      ];
    }

    const vehicles = await prisma.vehicle.findMany({
      where: whereCondition,
      skip: page && limit ? (Number(page) - 1) * Number(limit) : 0,
      take: limit ? Number(limit) : 10,
    });

    const total = await prisma.vehicle.count({ where: whereCondition });

    return ServerResponse.success(res, "Vehicles fetched successfully", {
      vehicles,
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

const fetchVehicleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!vehicle) {
      return ServerResponse.notFound(res, `Vehicle with id ${id} not found`);
    }

    return ServerResponse.success(res, "Vehicle fetched successfully", {
      vehicle,
    });
  } catch (error) {
    console.error(error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { vehicleType, plateNumber, size, color, maker, model } = req.body;

    if (plateNumber && !isValidPlateNumber(plateNumber)) {
      return ServerResponse.error(res, "Invalid plate number format");
    }

    // Check if vehicle exists
    const existingVehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!existingVehicle) {
      return ServerResponse.notFound(res, `Vehicle with id ${id} not found`);
    }

    // If plateNumber changed, check for duplicates
    if (plateNumber && plateNumber !== existingVehicle.plateNumber) {
      const duplicate = await prisma.vehicle.findFirst({
        where: { plateNumber },
      });
      if (duplicate) {
        return ServerResponse.error(
          res,
          "Another vehicle with this plate number already exists"
        );
      }
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        vehicleType,
        plateNumber,
        size,
        color,
        maker,
        model,
      },
    });

    return ServerResponse.success(res, "Vehicle updated successfully", {
      updatedVehicle,
    });
  } catch (error) {
    console.error(error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingVehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!existingVehicle) {
      return ServerResponse.notFound(res, `Vehicle with id ${id} not found`);
    }

    await prisma.vehicle.delete({ where: { id } });

    return ServerResponse.success(res, "Vehicle deleted successfully");
  } catch (error) {
    console.error(error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const fetchAllVehicleByUser = async (req: Request, res: Response) => {
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

    const whereCondition: Prisma.VehicleWhereInput = {};
    if (searchKey) {
      whereCondition.OR = [
        { plateNumber: { contains: searchKey as string, mode: "insensitive" } },
        { maker: { contains: searchKey as string, mode: "insensitive" } },
        { model: { contains: searchKey as string, mode: "insensitive" } },
      ];
    }
    const vehicles = await prisma.vehicle.findMany({
      where: { userId, ...whereCondition },
      include: {
        requests: {
          select: {
            id: true,
          },
        },
      },
      skip: page && limit ? (Number(page) - 1) * Number(limit) : 0,
      take: limit ? Number(limit) : 10,
    });

    const total = await prisma.vehicle.count({ where: { userId,...whereCondition } });

    return ServerResponse.success(res, "User's vehicles fetched successfully", {
      vehicles,
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

const vehicleController = {
  createVehicle,
  fetchAllVehicle,
  fetchVehicleById,
  updateVehicle,
  deleteVehicle,
  fetchAllVehicleByUser,
};

export default vehicleController;
