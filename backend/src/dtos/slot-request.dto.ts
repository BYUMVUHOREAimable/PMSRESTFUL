// dtos/slotRequest.dto.ts
import {  IsUUID, IsOptional, IsEnum } from "class-validator";
import { RequestStatus } from "@prisma/client";

export class CreateSlotRequestDTO {
  @IsUUID()
  vehicleId!: string;
}

export class UpdateSlotRequestDTO {
  @IsUUID()
  @IsOptional()
  vehicleId?: string;
}

export class ApproveRejectSlotRequestDTO {
  @IsEnum(RequestStatus)
  status!: RequestStatus; // APPROVED or REJECTED
}
