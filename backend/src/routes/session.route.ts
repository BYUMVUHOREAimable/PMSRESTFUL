import { Router } from "express";
import { validationMiddleware } from "../middlewares/validator.middleware";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
import { CreateSessionDTO } from "../dtos/parking_session.dto";
import ParkingSessionController from "../controllers/session.controller";
const ParkingSession = Router();

ParkingSession.post(
  "/entry",
  [checkLoggedIn, validationMiddleware(CreateSessionDTO)],
  ParkingSessionController.createSession
);
ParkingSession.get(
  "/all",
  [checkAdmin],
  ParkingSessionController.fetchAllSessions
);
ParkingSession.get(
  "/user/all",
  [checkLoggedIn],
  ParkingSessionController.fetchSessionsByUser
);
ParkingSession.get("/:id", [checkLoggedIn], ParkingSessionController.fetchById);
ParkingSession.get(
  "/:id/fee",
  [checkLoggedIn],
  ParkingSessionController.getSessionFee
);
ParkingSession.patch(
  "/:id/exit",
  [checkLoggedIn],
  ParkingSessionController.exitParking
);

export default ParkingSession;
