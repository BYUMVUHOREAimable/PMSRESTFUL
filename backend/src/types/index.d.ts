import { Request, RequestHandler } from "express";

export interface AuthRequest extends Request {
  user: {
    id: string;
  };
}

// export interface AuthMiddleware extends RequestHandler<> {
//     req: AuthRequest
// }

type AuthMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => void;

type PaymentStatus = "PAID" | "UNPAID" | "PENDING";

export interface ExitTicketPayload {
  slotNumber: number | string;
  entryTime: string;
  exitTime: string;
  status: PaymentStatus;
  vehiclePlateNumber: string;
  fee: number;
}
