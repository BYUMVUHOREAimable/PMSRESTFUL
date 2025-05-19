import { Request, Response } from "express";
import { AuthRequest, ExitTicketPayload } from "../types";
import prisma from "../prisma/prisma-client";
import ServerResponse from "../utils/ServerResponse";
import { Prisma } from "@prisma/client";
import { paginator } from "../utils/paginator";
import { CONSTANTS } from "../utils/cconstants";
import { sortSessionsByPaymentAndExitStatus } from "../utils/sorter";
import { formatToReadableDate, generatePDFBuffer } from "../utils/pdf";

const createSession = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest; // Typecast to use `user`

    const { plateNumber } = authReq.body;
    const userId = authReq.user.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) return ServerResponse.unauthorized(res, "You are not logged in");
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        plateNumber: plateNumber,
        userId: userId,
      },
    });
    if (!vehicle)
      return ServerResponse.error(
        res,
        "You don't have a vehicle with that plate number"
      );

    const slotRequest = await prisma.slotRequest.findFirst({
      where: {
        vehicleId: vehicle.id,
        status: "APPROVED",
      },
      include: {
        slot: true,
      },
    });
    if (!slotRequest)
      return ServerResponse.error(
        res,
        " approved slot request found for this vehicle not found "
      );

    const session = await prisma.parkingSession.create({
      data: {
        plateNumber: plateNumber,
        user: {
          connect: {
            id: userId,
          },
        },
        slot: {
          connect: {
            id: slotRequest?.slot?.id,
          },
        },
      },
    });

    return ServerResponse.created(res, "Parking session created successfully", {
      session,
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
const fetchAllSessions = async (req: Request, res: Response) => {
  try {
    const { searchKey, page, limit } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
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

    const whereCondition: Prisma.ParkingSessionWhereInput = {};
    if (searchKey) {
      whereCondition.OR = [
        { plateNumber: { contains: searchKey as string, mode: "insensitive" } },
      ];
    }
    const sessions = await prisma.parkingSession.findMany({
      where: whereCondition,
      include: {
        slot: {
          select: {
            number: true,
          },
        },
        payment: {
          select: {
            amount: true,
            method: true,
          },
        },
      },
    });
    // Sort all sessions with your sorting function
    const sortedSessions = sortSessionsByPaymentAndExitStatus(sessions);

    // Paginate manually
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedSessions = sortedSessions.slice(
      startIndex,
      startIndex + limitNum
    );
    return ServerResponse.success(
      res,
      "Parking sessions fetched successfully",
      {
        sessions: paginatedSessions,
        meta: paginator({
          page: pageNum,
          limit: limitNum,
          total: sortedSessions.length,
        }),
      }
    );
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};
const fetchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const session = await prisma.parkingSession.findUnique({
      where: {
        id,
      },
    });
    if (!session)
      return ServerResponse.notFound(
        res,
        `Parking session with id ${id} as not found`
      );
    return ServerResponse.success(res, "Parking session fetched successfully", {
      session,
    });
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};
const fetchSessionsByUser = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest; // Typecast to use `user`
    const { page = "1", limit = "10", searchKey } = authReq.query;
    const userId = authReq.user.id;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    if (pageNum <= 0)
      return ServerResponse.error(
        res,
        "Page number cannot be less than or equal to 0"
      );
    if (limitNum <= 0)
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
    const whereCondition: Prisma.ParkingSessionWhereInput = {};
    if (searchKey) {
      whereCondition.OR = [
        {
          plateNumber: { contains: searchKey as string, mode: "insensitive" },
        },
        {
          slot: {
            number: { contains: searchKey as string, mode: "insensitive" },
          },
        },
      ];
    }
    const sessions = await prisma.parkingSession.findMany({
      where: {
        userId: userId,
        ...whereCondition,
      },
      include: {
        slot: {
          select: {
            number: true,
          },
        },
        payment: {
          select: {
            amount: true,
            method: true,
          },
        },
      },
    });

    // Sort all sessions with your sorting function
    const sortedSessions = sortSessionsByPaymentAndExitStatus(sessions);

    // Paginate manually
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedSessions = sortedSessions.slice(
      startIndex,
      startIndex + limitNum
    );

    return ServerResponse.success(
      res,
      "Parking sessions fetched successfully",
      {
        sessions: paginatedSessions,
        meta: paginator({
          page: pageNum,
          limit: limitNum,
          total: sortedSessions.length,
        }),
      }
    );
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const getSessionFee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const session = await prisma.parkingSession.findUnique({
      where: {
        id,
      },
      include: {
        slot: true,
        user: true,
      },
    });
    if (!session) {
      return ServerResponse.notFound(res, "Session not found");
    }

    if (session.paymentStatus === "PAID") {
      return ServerResponse.error(res, "This session is already paid");
    }
    const entryTime = session.entryTime;
    const now = new Date();
    const hours = Math.ceil(
      (now.getTime() - entryTime.getTime()) / (1000 * 60 * 60)
    );
    const fee =
      CONSTANTS.BASE_RATE + Math.max(0, hours - 1) * CONSTANTS.ADDITIONAL_RATE;
    return ServerResponse.success(res, "fee calculated successfully", {
      session: session.id,
      entryTime: session.entryTime,
      parkingSlot: session.slot.number,
      user: `${session.user.firstName} ${session.user.lastName}`,
      vehicle_plate_number: session.plateNumber,
      parking_hours: hours,
      fee,
    });
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};
const exitParking = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const exitTime = new Date();
    const { id } = authReq.params;
    const userId = authReq.user.id;
    const session = await prisma.parkingSession.findUnique({
      where: {
        id,
      },
      include: {
        slot: true,
      },
    });
    if (!session) return ServerResponse.notFound(res, "Session not found");
    if (session!.paymentStatus !== "PAID")
      return ServerResponse.error(res, "Payment required before exit");
    if (session!.isExited) return ServerResponse.error(res, "Already exited");
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) return ServerResponse.unauthorized(res, "You are not logged in");
    if (session.userId !== user.id)
      return ServerResponse.error(
        res,
        "You are not authorized to exit this car"
      );
    await prisma.parkingSession.update({
      where: {
        id,
      },
      data: {
        isExited: true,
        exitTime,
      },
    });
    const slot = await prisma.parkingSlot.update({
      where: {
        id: session?.slot.id,
      },
      data: {
        status: "AVAILABLE",
      },
    });
    await prisma.slotRequest.deleteMany({
      where: {
        slotId: session.slotId,
      },
    });
    const payment = await prisma.payment.findUnique({
      where: {
        sessionId: session.id,
      },
    });
    const payload: ExitTicketPayload = {
      slotNumber: slot.number,
      entryTime: formatToReadableDate(session.entryTime.toISOString()),
      exitTime: formatToReadableDate(exitTime.toISOString()),
      status: session.paymentStatus,
      vehiclePlateNumber: session.plateNumber,
      fee: payment?.amount || 0,
    };
    const pdfBuffer = await generatePDFBuffer(payload, user);

    res.setHeader("Content-Disposition", "attachment; filename=ticket.pdf");
    res.setHeader("Content-Type", "application/pdf");
    return res.send(pdfBuffer);
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};
const ParkingSession = {
  fetchSessionsByUser,
  createSession,
  fetchAllSessions,
  fetchById,
  getSessionFee,
  exitParking,
};
export default ParkingSession;
