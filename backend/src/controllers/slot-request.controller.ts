import { Request, Response } from "express";
import prisma from "../prisma/prisma-client";
import ServerResponse from "../utils/ServerResponse";
import {
  Prisma,
  RequestStatus,
  SlotSize,
  SlotStatus,
  VehicleType,
} from "@prisma/client";
import { AuthRequest } from "../types";
import { sendApprovalEmail, sendRejectionEmail } from "../utils/email";

const createRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user.id; // assuming user ID injected by auth middleware
    const { vehicleId } = req.body;

    // Validate vehicle belongs to user
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      select: { userId: true },
    });

    if (!vehicle) {
      return ServerResponse.error(res, "Vehicle not found", 403);
    }
    if (vehicle.userId !== userId) {
      return ServerResponse.error(res, "This is not your vehicle", 403);
    }
    const existingRequest = await prisma.slotRequest.findFirst({
      where: { vehicleId, status: "PENDING" },
    });

    if (existingRequest) {
      return ServerResponse.error(
        res,
        "You already have a pending slot request for this vehicle",
        409
      );
    }

    // Create pending slot request
    const slotRequest = await prisma.slotRequest.create({
      data: {
        userId,
        vehicleId,
        status: RequestStatus.PENDING,
      },
    });

    return ServerResponse.created(res, "Slot request created", { slotRequest });
  } catch (error) {
    return ServerResponse.error(res, "Error creating slot request", { error });
  }
};

const updateRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user.id;
    const { id } = req.params;
    const { vehicleId } = req.body;

    // Fetch request and check ownership & status
    const request = await prisma.slotRequest.findUnique({
      where: { id },
      select: { userId: true, status: true },
    });
    if (!request || request.userId !== userId) {
      return ServerResponse.error(
        res,
        "Request not found or unauthorized",
        403
      );
    }
    if (request.status !== RequestStatus.PENDING) {
      return ServerResponse.error(
        res,
        "Only pending requests can be updated",
        400
      );
    }

    // Check vehicle ownership if vehicleId given
    if (vehicleId) {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
        select: { userId: true },
      });
      if (!vehicle || vehicle.userId !== userId) {
        return ServerResponse.error(
          res,
          "Vehicle not found or unauthorized",
          403
        );
      }
    }

    const updatedRequest = await prisma.slotRequest.update({
      where: { id },
      data: { vehicleId: vehicleId || undefined },
    });

    return ServerResponse.success(res, "Slot request updated", {
      slotRequest: updatedRequest,
    });
  } catch (error) {
    return ServerResponse.error(res, "Error updating slot request", { error });
  }
};

const deleteRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user.id;
    const { id } = req.params;

    const request = await prisma.slotRequest.findUnique({
      where: { id },
      select: { userId: true, status: true },
    });
    if (!request || request.userId !== userId) {
      return ServerResponse.error(
        res,
        "Request not found or unauthorized",
        403
      );
    }
    // if (request.status !== RequestStatus.PENDING) {
    //   return ServerResponse.error(
    //     res,
    //     "Only pending requests can be deleted",
    //     400
    //   );
    // }
    if (
      request.status !== RequestStatus.PENDING &&
      request.status !== RequestStatus.REJECTED
    ) {
      return ServerResponse.error(
        res,
        "Only pending or rejected requests can be deleted",
        400
      );
    }

    await prisma.slotRequest.delete({ where: { id } });

    return ServerResponse.success(res, "Slot request cancelled");
  } catch (error) {
    return ServerResponse.error(res, "Error deleting slot request", { error });
  }
};

const assignSlotAutomatically = async (
  vehicleType: VehicleType,
  size: SlotSize
) => {
  // Find first available compatible slot
  const slot = await prisma.parkingSlot.findFirst({
    where: {
      status: SlotStatus.AVAILABLE,
      vehicleType,
      size,
    },
  });

  if (!slot) return null;

  // Mark slot as unavailable (reserved)
  await prisma.parkingSlot.update({
    where: { id: slot.id },
    data: { status: SlotStatus.UNAVAILABLE },
  });

  return slot;
};

const approveRejectRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (![RequestStatus.APPROVED, RequestStatus.REJECTED].includes(status)) {
      return ServerResponse.error(res, "Invalid status for approval", 400);
    }

    // Find request
    const slotRequest = await prisma.slotRequest.findUnique({
      where: { id },
      include: { vehicle: true, user: true },
    });
    if (!slotRequest) {
      return ServerResponse.notFound(res, "Slot request not found");
    }
    if (slotRequest.status !== RequestStatus.PENDING) {
      return ServerResponse.error(
        res,
        "Only pending requests can be processed",
        400
      );
    }

    if (status === RequestStatus.APPROVED) {
      // Assign slot automatically
      const assignedSlot = await assignSlotAutomatically(
        slotRequest.vehicle.vehicleType,
        slotRequest.vehicle.size
      );
      if (!assignedSlot) {
        return ServerResponse.error(
          res,
          "No available slot matches vehicle",
          400
        );
      }

      await sendApprovalEmail(
        slotRequest.user.email,
        assignedSlot.number,
        slotRequest.vehicle,
        assignedSlot.location,
        res
      );

      // Update slotRequest with assigned slot and status APPROVED
      const updated = await prisma.slotRequest.update({
        where: { id },
        data: {
          slotId: assignedSlot.id,
          status: RequestStatus.APPROVED,
        },
      });

      return ServerResponse.success(res, "Slot request approved", {
        slotRequest: updated,
      });
    } else {
      let slotLocation: string | undefined = undefined;
      if (slotRequest?.slotId) {
        const slot = await prisma.parkingSlot.findUnique({
          where: { id: slotRequest.slotId },
        });
        slotLocation = slot?.location;
      }
      await sendRejectionEmail(
        slotRequest.user.email,
        slotRequest.vehicle,
        "Slot request rejected please try again later with a different vehicle",
        slotLocation
      );
      // Just reject
      const updated = await prisma.slotRequest.update({
        where: { id },
        data: { status: RequestStatus.REJECTED },
      });

      return ServerResponse.success(res, "Slot request rejected", {
        slotRequest: updated,
      });
    }
  } catch (error) {
    return ServerResponse.error(res, "Error processing slot request", {
      error,
    });
  }
};

const listRequests = async (req: Request, res: Response) => {
  try {
    const { searchKey, status, page, limit } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    if (pageNum <= 0 || limitNum <= 0) {
      return ServerResponse.error(res, "Invalid pagination values");
    }

    const where: Prisma.SlotRequestWhereInput = {};

    // Filter by status if given
    if (status && typeof status === "string") {
      where.status = status.toUpperCase() as RequestStatus;
    }

    // Search by vehicle plate number or model
    if (searchKey && typeof searchKey === "string") {
      where.OR = [
        {
          vehicle: {
            plateNumber: { contains: searchKey, mode: "insensitive" },
          },
        },
        {
          vehicle: {
            model: { contains: searchKey, mode: "insensitive" },
          },
        },
      ];
    }

    const requests = await prisma.slotRequest.findMany({
      where,
      include: {
        vehicle: {
          select: {
            plateNumber: true,
            model: true,
            vehicleType: true,
          },
        },
        slot: {
          select: {
            id: true,
            size: true,
            status: true,
            location: true,
            number: true,
          },
        },
      },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.slotRequest.count({ where });

    return ServerResponse.success(res, "Slot requests fetched", {
      requests,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
      },
    });
  } catch (error) {
    return ServerResponse.error(res, "Error fetching slot requests", { error });
  }
};
const listUserRequests = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user.id;
    const { searchKey, status, page, limit } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    if (pageNum <= 0 || limitNum <= 0) {
      return ServerResponse.error(res, "Invalid pagination values");
    }

    const where: Prisma.SlotRequestWhereInput = {};

    // Filter by status if given
    if (status && typeof status === "string") {
      where.status = status.toUpperCase() as RequestStatus;
    }

    // Search by vehicle plate number or model
    if (searchKey && typeof searchKey === "string") {
      where.OR = [
        {
          vehicle: {
            plateNumber: { contains: searchKey, mode: "insensitive" },
          },
        },
        {
          vehicle: {
            model: { contains: searchKey, mode: "insensitive" },
          },
        },
      ];
    }

    const requests = await prisma.slotRequest.findMany({
      where: {
        ...where,
        userId: userId,
      },
      include: {
        vehicle: {
          select: {
            plateNumber: true,
            model: true,
            vehicleType: true,
          },
        },
        slot: {
          select: {
            id: true,
            size: true,
            status: true,
            location: true,
            number: true,
          },
        },
      },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.slotRequest.count({ where });

    return ServerResponse.success(res, "Slot requests fetched", {
      requests,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
      },
    });
  } catch (error) {
    return ServerResponse.error(res, "Error fetching slot requests", { error });
  }
};

const slotRequestController = {
  createRequest,
  updateRequest,
  deleteRequest,
  approveRejectRequest,
  listRequests,
  listUserRequests, // Alias for user requests
};

export default slotRequestController;
