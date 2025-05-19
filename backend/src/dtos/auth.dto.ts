import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, {
    message:
      "Password must have at least 6 characters, one symbol, one number, and one uppercase letter.",
  })
  readonly password: string;
}

export class VerifyOtpDTO {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: "OTP must be a 6-digit code" })
  otpCode: string;
}

export class ResendOtpDTO {
  @IsEmail({}, { message: "Email must be a valid email address" })
  email: string;
}

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: "OTP must be a 6-digit code" })
  otpCode: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, {
    message:
      "Password must have at least 6 characters, one symbol, one number, and one uppercase letter.",
  })
  password: string;
}
