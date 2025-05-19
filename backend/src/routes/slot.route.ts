import { Router } from "express";
import ParkingSlotController from "../controllers/slot.controller";
import { validationMiddleware } from "../middlewares/validator.middleware";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
import {
  CreateMultipleParkingSlotsDTO,
  CreateParkingSlotDTO,
} from "../dtos/slot.dto";

const ParkingSlotRouter2 = Router();

ParkingSlotRouter2.post(
  "/create",
  [checkAdmin, validationMiddleware(CreateParkingSlotDTO)],
  ParkingSlotController.createParkingSlot
);
ParkingSlotRouter2.post(
  "/create/bulk",
  [checkAdmin],
  validationMiddleware(CreateMultipleParkingSlotsDTO),
  ParkingSlotController.createMultipleSlots
);

ParkingSlotRouter2.get(
  "/all",
  [checkLoggedIn],
  ParkingSlotController.fetchParkingSlots
);
ParkingSlotRouter2.get(
  "/all/available",
  [checkLoggedIn],
  ParkingSlotController.fetchFreeSlots
);
ParkingSlotRouter2.get("/:id", [checkLoggedIn], ParkingSlotController.findById);

ParkingSlotRouter2.patch(
  "/:id",
  [checkAdmin, validationMiddleware(CreateParkingSlotDTO, true)],
  ParkingSlotController.updateSlot
);

// ✅ Delete parking slot
ParkingSlotRouter2.delete(
  "/:id",
  [checkAdmin],
  ParkingSlotController.deleteSlot
);
export default ParkingSlotRouter2;
