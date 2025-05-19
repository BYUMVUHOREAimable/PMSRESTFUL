// src/middleware/validation.ts
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import ServerResponse from "../utils/ServerResponse";

export function validationMiddleware<T>(
  type: any,
  skipMissingProperties = false
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);
    const errors = await validate(dto, { skipMissingProperties });
    if (errors.length > 0) {
      ServerResponse.error(
        res,
        Object.values(errors[0]?.constraints as {})[0] as string
      );
    } else {
      req.body = dto;
      next();
    }
  };
}
