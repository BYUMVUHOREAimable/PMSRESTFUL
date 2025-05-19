import { Router } from "express";
import { validationMiddleware } from "../middlewares/validator.middleware";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
import payment from "../controllers/payment.controller";
import { CreatePaymentDTO } from "../dtos/payment.dto";
const Payment = Router();

Payment.post(
  "/create",
  [checkLoggedIn, validationMiddleware(CreatePaymentDTO)],
  payment.createPayment
);
Payment.get("/all", [checkAdmin], payment.fetchAllPayment);
Payment.get("/user/all", [checkLoggedIn], payment.fetchAllPaymentByUser);
Payment.get("/:id", [checkLoggedIn], payment.fetchPaymentById);
export default Payment;
