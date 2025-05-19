import { Router } from "express";
import { validationMiddleware } from "../middlewares/validator.middleware";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
import {
  CreateTransferDTO,
  UpdateTransferStatusDTO,
} from "../dtos/transfer.dto";
import transferController from "../controllers/transfer.controller";

const TransferRouter = Router();

TransferRouter.post(
  "/create",
  [checkLoggedIn, validationMiddleware(CreateTransferDTO)],
  transferController.createTransfer
);

TransferRouter.get(
  "/all",
  [checkLoggedIn, checkAdmin],
  transferController.fetchAllTransfers
);

TransferRouter.get(
  "/:id",
  [checkLoggedIn],
  transferController.fetchTransferById
);
TransferRouter.get(
  "/user/all",
  [checkLoggedIn],
  transferController.getMyTransfers
);

// Admin-only approve/reject
TransferRouter.patch(
  "/:id/approve",
  [checkLoggedIn, checkAdmin],
  transferController.approveTransfer
);

TransferRouter.patch(
  "/:id/reject",
  [checkLoggedIn, checkAdmin],
  transferController.rejectTransfer
);

export default TransferRouter;
