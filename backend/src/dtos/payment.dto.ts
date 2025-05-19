import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { PaymentMethod } from "../enum";

export class CreatePaymentDTO {
  @IsString()
  @IsNotEmpty()
  sessionId: string;
  @IsString()
  @IsNotEmpty()
  plateNumber: string;
  @IsNumber()
  @IsNotEmpty()
  amount: number;
  @IsEnum(PaymentMethod, {
    message: "Payment method must be CASH, CARD, or MOBILE",
  })
  @IsNotEmpty()
  method: PaymentMethod;
}
