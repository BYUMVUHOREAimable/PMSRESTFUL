import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  lastName: string;

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
