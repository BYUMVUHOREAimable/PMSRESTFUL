import { IsEnum, IsNotEmpty, IsString, Matches } from "class-validator";
import { SlotSize, VehicleType } from "../enum";

export class CreateVehicleDTO {
  @IsEnum(VehicleType, {
    message: "vehicleType must be a valid VehicleType enum value",
  })
  vehicleType: VehicleType;

  @IsString()
  @IsNotEmpty({ message: "plateNumber should not be empty" })
  @Matches(/^R[A-Z]{2}\d{3}[A-Z]$/, {
    message:
      "plateNumber must be a valid Rwandan plate (e.g., RAB123C) with no spaces",
  })
  plateNumber: string;

  @IsEnum(SlotSize, { message: "size must be a valid SlotSize enum value" })
  size: SlotSize;

  @IsString()
  @IsNotEmpty({ message: "color should not be empty" })
  color: string;

  @IsString()
  @IsNotEmpty({ message: "make should not be empty" })
  maker: string;

  @IsString()
  @IsNotEmpty({ message: "model should not be empty" })
  model: string;
}
