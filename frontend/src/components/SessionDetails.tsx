import React from "react";
import { format } from "date-fns";
import { SessionDetailsProps } from "@/types";

const PaymentFeeModal: React.FC<SessionDetailsProps> = ({
  isOpen,
  onClose,
  data,
  onProceed,
}) => {
  if (!isOpen || !data) return null;

  const { id, plateNumber, entryTime, exitTime, paymentStatus, isExited } =
    data;
  const showExitButton = paymentStatus === "PAID" && !isExited;

  const formatTime = (time?: string | null) =>
    time ? format(new Date(time), "yyyy-MM-dd HH:mm:ss") : "N/A";

  return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
  <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in-up transition-all duration-300">
    
    {/* Header */}
    <div className="flex justify-between items-center border-b pb-4">
      <h2 className="text-2xl font-semibold text-gray-800">Session Details</h2>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-red-500 text-2xl font-bold transition"
      >
        &times;
      </button>
    </div>

    {/* Session Info */}
    <div className="space-y-4 mt-6 text-sm text-gray-700">
      <Detail label="Plate Number" value={plateNumber} />
      <Detail label="Entry Time" value={formatTime(entryTime)} />
      <Detail label="Exit Time" value={formatTime(exitTime)} />

      <div className="flex gap-3 pt-3">
        <Badge
          label={paymentStatus}
          color={paymentStatus === "PAID" ? "green" : "red"}
        />
        <Badge
          label={isExited ? "Exited" : "Active"}
          color={isExited ? "gray" : "blue"}
        />
      </div>
    </div>

    {/* Action Buttons */}
    <div className="mt-6 flex justify-end gap-3">
      <button
        onClick={onClose}
        className="px-5 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-sm transition"
      >
        Close
      </button>

      {showExitButton && (
        <button
          onClick={() => onProceed(id)}
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
        >
          Exit Now
        </button>
      )}
    </div>
  </div>
</div>

  );
};

interface DetailProps {
  label: string;
  value: string;
}

const Detail: React.FC<DetailProps> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="text-gray-900 font-semibold">{value}</span>
  </div>
);


interface BadgeProps {
  label: string;
  color: "green" | "red" | "blue" | "gray";
}

const Badge: React.FC<BadgeProps> = ({ label, color }) => {
  const colorMap = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${colorMap[color]}`}
    >
      {label}
    </span>
  );
};


export default PaymentFeeModal;
