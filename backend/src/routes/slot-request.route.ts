import { Router } from "express";
import slotRequestController from "../controllers/slot-request.controller";
import { validationMiddleware } from "../middlewares/validator.middleware";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
import {
  CreateSlotRequestDTO,
  UpdateSlotRequestDTO,
  ApproveRejectSlotRequestDTO,
} from "../dtos/slot-request.dto";

const slotRequestRouter = Router();

// User routes
slotRequestRouter.post(
  "/create",
  checkLoggedIn,
  validationMiddleware(CreateSlotRequestDTO),
  slotRequestController.createRequest
);

slotRequestRouter.put(
  "/:id",
  checkLoggedIn,
  validationMiddleware(UpdateSlotRequestDTO),
  slotRequestController.updateRequest
);

slotRequestRouter.delete(
  "/:id",
  checkLoggedIn,
  slotRequestController.deleteRequest
);

// Admin approve/reject
slotRequestRouter.put(
  "/:id/status",
  checkAdmin,
  validationMiddleware(ApproveRejectSlotRequestDTO),
  slotRequestController.approveRejectRequest
);

// List with filters & pagination
slotRequestRouter.get("/all", checkAdmin, slotRequestController.listRequests);
slotRequestRouter.get("/user", checkLoggedIn, slotRequestController.listUserRequests);

export default slotRequestRouter;
