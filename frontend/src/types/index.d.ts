import {
  PaymentMethod,
  PaymentStatus,
  Status,
  SlotSize,
  VehicleType,
} from "@/enums";

// Shared Timestamp Audit
export interface TimestampAudit {
  createdAt: Date;
  updatedAt: Date;
}

// User
export interface IUser extends TimestampAudit {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: "ADMIN" | "USER";
}

// Vehicle

export interface IVehicle extends TimestampAudit {
  id: string;
  plateNumber: string;
  vehicleType: VehicleType;
  size: SlotSize;
  color: string;
  maker: string;
  model: string;
  userId: string;
  requests: [ISlotRequest];
}

// Parking Slot
export type SlotStatus = "AVAILABLE" | "UNAVAILABLE";

export interface ISlot extends TimestampAudit {
  id: string;
  number: string;
  size: SlotSize;
  vehicleType: VehicleType;
  location: string;
  status: SlotStatus;
}

export interface CreateSlot {
  number: string;
  size: SlotSize;
  vehicleType: VehicleType;
  location: string;
}
// Session
export interface ISession extends TimestampAudit {
  id: string;
  entryTime: Date;
  exitTime?: Date | null;
  paymentStatus: PaymentStatus;
  plateNumber: string;
  isExited: boolean;
  slotId: string;
  userId: string;
  slot: ISlot;
  payment?: IPayment;
}

// Payment
export interface IPayment extends TimestampAudit {
  id: string;
  sessionId: string;
  amount: number;
  method: PaymentMethod;
  userId: string;
}

// Create Session Payload
export interface ICreateSession {
  plateNumber: string;
}

// Login/Register
export interface ILoginData {
  email: string;
  password: string;
}

export type RegisterInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

// Pagination
export interface IMeta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number;
  next: number;
}

// Payment Fee Calculation
export type PaymentFee = {
  session: string;
  entryTime: string;
  parkingSlot: string;
  user: string;
  vehicle_plate_number: string;
  parking_hours: number;
  fee: number;
};

export type PaymentFeePayload = {
  sessionId: string;
  plateNumber: string;
  amount: number;
  method: PaymentMethod;
};

export interface PaymentFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PaymentFee | null;
  onProceed: (data: PaymentFeePayload) => void;
}

// Session Modal
export interface SessionData {
  id: string;
  plateNumber: string;
  entryTime: string;
  exitTime?: string | null;
  paymentStatus: "PAID" | "PENDING";
  isExited: boolean;
}

export interface SessionDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  data: SessionData | null;
  onProceed: (sessionId: string) => void;
}

export interface ISlotRequest extends TimestampAudit {
  id: string;
  userId: string;
  vehicleId: string;
  slotId?: string | null;
  status: Status;
  slot: ISlot;
  vehicle: IVehicle;
  status: Status;
}

export interface CreateVehicleDTO {
  plateNumber: string;
  vehicleType: VehicleType;
  size: SlotSize;
  color: string;
  maker: string;
  model: string;
}

export interface CreateTransfer {
  amount: number;
  vehicleId: string; // sender vehicle ID
  toUserId: string; // receiver user ID
  description?: string;
}

export interface ITransfer {
  id: string;
  price: number;
  vehicleId: string;
  toUserId: string;
  description?: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  fromUser:IUser
  toUser:IUser
}
