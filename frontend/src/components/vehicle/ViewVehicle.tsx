import React from "react";
import { Modal } from "@mantine/core";
import { IVehicle } from "@/types";
import {
  FaCar,
  FaPalette,
  FaRegIdCard,
  FaIndustry,
  FaLayerGroup,
} from "react-icons/fa";

interface ViewVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: IVehicle;
}

const ViewVehicleModal: React.FC<ViewVehicleModalProps> = ({
  isOpen,
  onClose,
  vehicle,
}) => {
  if (!vehicle) return null;

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <h2 className="text-xl font-semibold text-primary-blue">
          Vehicle Details
        </h2>
      }
      centered
      size="lg"
      radius="md"
      overlayProps={{
        blur: 3,
        backgroundOpacity: 0.5,
      }}
    >
      <div className="mt-4 space-y-4">
        {[
          {
            icon: FaRegIdCard,
            label: "Plate Number",
            value: vehicle.plateNumber,
          },
          {
            icon: FaCar,
            label: "Vehicle Type",
            value: vehicle.vehicleType,
          },
          {
            icon: FaLayerGroup,
            label: "Model",
            value: vehicle.model,
          },
          {
            icon: FaPalette,
            label: "Color",
            value: vehicle.color,
          },
          {
            icon: FaIndustry,
            label: "Manufacturer",
            value: vehicle.maker,
          },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon
              className="text-primary-blue flex-shrink-0"
              size={20}
              aria-hidden="true"
            />
            <p>
              <strong className="text-gray-600">{label}:</strong>{" "}
              <span className="text-gray-900">{value}</span>
            </p>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default ViewVehicleModal;
