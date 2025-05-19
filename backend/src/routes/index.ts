import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import parkingSession from "./session.route";
import paymentRouter from "./payment.route";
import VehicleRouter from "./vehicle.route";
import ParkingSlotRouter2 from "./slot.route";
import slotRequestRouter from "./slot-request.route";
import TransferRouter from "./transfer.route";
const router = Router();

router.use(
  "/auth",
  authRouter
  /*
        #swagger.tags = ['Auth']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
router.use(
  "/user",
  userRouter
  /*
        #swagger.tags = ['Users']
        #swagger.security = [{
        }] 
    */
);
router.use(
  "/session",
  parkingSession
  /*
        #swagger.tags = ['Parking Session']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
router.use(
  "/slot-request",
  slotRequestRouter
  /*
        #swagger.tags = ['slot request ']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
router.use(
  "/slot",
  ParkingSlotRouter2
  /*
        #swagger.tags = ['Parking Slot 2']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
router.use(
  "/payment",
  paymentRouter
  /*
        #swagger.tags = ['Payment ']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
router.use(
  "/vehicle",
  VehicleRouter
  /*
        #swagger.tags = ['Vehicle ']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
router.use(
  "/transfer",
  TransferRouter
  /*
        #swagger.tags = ['Transfer ']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
export default router;
