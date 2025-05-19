import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from "class-validator";
import { SlotSize, VehicleType } from "../enum"; // Make sure these enums are defined in TS too
import { Type } from "class-transformer";

export class CreateParkingSlotDTO {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsEnum(SlotSize)
  @IsNotEmpty()
  size: SlotSize;

  @IsEnum(VehicleType)
  @IsNotEmpty()
  vehicleType: VehicleType;

  @IsString()
  @IsNotEmpty()
  location: string;
}

export class CreateMultipleParkingSlotsDTO {
  @IsArray()
  @ValidateNested({ each: true }) // validate each slot object deeply
  @Type(() => CreateParkingSlotDTO)
  slots: CreateParkingSlotDTO[];
}
