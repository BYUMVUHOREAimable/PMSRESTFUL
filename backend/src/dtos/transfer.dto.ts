import { IsString, IsNumber, IsEnum, IsOptional } from "class-validator";

export class CreateTransferDTO {
  @IsNumber()
  amount: number;

  @IsString()
  vehicleId: string; // who sends money

  @IsString()
  toUserId: string; // who receives money

  @IsOptional()
  @IsString()
  description?: string;
}

export enum TransferStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export class UpdateTransferStatusDTO {
  @IsEnum(TransferStatus)
  status: TransferStatus;
}
