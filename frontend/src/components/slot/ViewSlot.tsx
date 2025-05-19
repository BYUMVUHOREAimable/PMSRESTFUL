import React from "react";
import { Modal } from "@mantine/core";
import { ISlot } from "@/types"; // Your slot interface
import {
  FaHashtag,
  FaVectorSquare,
  FaCarSide,
  FaMapMarkerAlt,
} from "react-icons/fa";

interface ViewSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: ISlot | null;
}

const ViewSlotModal: React.FC<ViewSlotModalProps> = ({
  isOpen,
  onClose,
  slot,
}) => {
  if (!slot) return null;

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <h2 className="text-2xl font-bold text-primary-blue tracking-wide">
          Parking Slot Details
        </h2>
      }
      centered
      size="lg"
      radius="md"
      overlayProps={{
        blur: 5,
        backgroundOpacity: 0.35,
      }}
    >
      <div className="space-y-6 mt-6">
        <div className="flex items-center gap-4">
          <FaHashtag className="text-primary-blue text-2xl" />
          <p className="text-lg font-medium text-gray-700">
            <span className="text-gray-500">Slot Number: </span>
            {slot.number}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <FaVectorSquare className="text-primary-blue text-2xl" />
          <p className="text-lg font-medium text-gray-700">
            <span className="text-gray-500">Size: </span>
            {slot.size}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <FaCarSide className="text-primary-blue text-2xl" />
          <p className="text-lg font-medium text-gray-700">
            <span className="text-gray-500">Vehicle Type: </span>
            {slot.vehicleType}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <FaMapMarkerAlt className="text-primary-blue text-2xl" />
          <p className="text-lg font-medium text-gray-700">
            <span className="text-gray-500">Location: </span>
            {slot.location}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ViewSlotModal;
