import { Router } from "express";
import { validationMiddleware } from "../middlewares/validator.middleware";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
import vehicle from "../controllers/vehicle.controller";
import { CreateVehicleDTO } from "../dtos/vehicle.dto";
const VehicleRouter = Router();

VehicleRouter.post(
  "/create",
  [checkLoggedIn, validationMiddleware(CreateVehicleDTO)],
  vehicle.createVehicle
);
VehicleRouter.get("/all", [checkAdmin, checkLoggedIn], vehicle.fetchAllVehicle);
VehicleRouter.get("/user/all", [checkLoggedIn], vehicle.fetchAllVehicleByUser);
VehicleRouter.get("/:id", [checkLoggedIn], vehicle.fetchVehicleById);
VehicleRouter.put(
  "/:id",
  [checkLoggedIn, validationMiddleware(CreateVehicleDTO)],
  vehicle.updateVehicle
);

VehicleRouter.delete("/:id", [checkLoggedIn], vehicle.deleteVehicle);
export default VehicleRouter;
