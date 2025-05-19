import React from "react";
import { Modal } from "@mantine/core";
import { ITransfer } from "@/types";
import {
  FaUserAlt,
  FaMoneyBillAlt,
  FaInfoCircle,
  FaClock,
  FaHashtag,
} from "react-icons/fa";
import { format } from "date-fns";

interface ViewTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  transfer: ITransfer | null;
}

const ViewTransferModal: React.FC<ViewTransferModalProps> = ({
  isOpen,
  onClose,
  transfer,
}) => {
  if (!transfer) return null;

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <h2 className="text-xl font-semibold text-primary-blue">
          Transfer Details
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
      <div className="space-y-4 mt-4">
        <div className="flex items-center gap-3">
          <FaHashtag className="text-primary-blue" />
          <p>
            <strong className="text-gray-600">Transfer ID:</strong> {transfer.id}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FaUserAlt className="text-primary-blue" />
          <p>
            <strong className="text-gray-600">From:</strong>{" "}
            {transfer.fromUser?.firstName  || "N/A"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FaUserAlt className="text-primary-blue rotate-180" />
          <p>
            <strong className="text-gray-600">To:</strong>{" "}
            {transfer.toUser?.firstName || "N/A"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FaMoneyBillAlt className="text-primary-blue" />
          <p>
            <strong className="text-gray-600">Amount:</strong> ${transfer.price}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FaInfoCircle className="text-primary-blue" />
          <p>
            <strong className="text-gray-600">Status:</strong>{" "}
            <span
              className={`${
                transfer.status === "PENDING"
                  ? "text-yellow-600"
                  : transfer.status === "APPROVED"
                  ? "text-green-600"
                  : "text-red-600"
              } font-semibold`}
            >
              {transfer.status}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FaClock className="text-primary-blue" />
          <p>
            <strong className="text-gray-600">Date:</strong>{" "}
            {format(new Date(transfer.createdAt), "PPpp")}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ViewTransferModal;
