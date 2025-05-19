import React, { useState } from "react";
import { PaymentFeeModalProps } from "@/types";
import { PaymentMethod } from "@/enums";

const PaymentFeeModal: React.FC<PaymentFeeModalProps> = ({
  isOpen,
  onClose,
  data,
  onProceed,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    PaymentMethod.CARD
  );

  if (!isOpen || !data) return null;

  const handleProceedClick = () => {
    if (!selectedMethod) {
      alert("Please select a payment method.");
      return;
    }

    const payload = {
      sessionId: data.session,
      plateNumber: data.vehicle_plate_number,
      amount: Number(data.fee),
      method: selectedMethod,
    };
    onProceed(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white w-full max-w-lg sm:rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in-up transition-all duration-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          💳 Payment Details
        </h2>

        {/* Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
          <p>
            <strong>User:</strong> {data.user}
          </p>
          <p>
            <strong>Plate:</strong> {data.vehicle_plate_number}
          </p>
          <p>
            <strong>Slot:</strong> {data.parkingSlot}
          </p>
          <p>
            <strong>Entry Time:</strong>{" "}
            {new Date(data.entryTime).toLocaleString()}
          </p>
          <p>
            <strong>Hours:</strong> {data.parking_hours}
          </p>
          <p>
            <strong>Fee:</strong>{" "}
            <span className="text-green-600 font-semibold">${data.fee}</span>
          </p>
        </div>

        {/* Payment Method */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">
            Payment Method
          </label>
          <select
            value={selectedMethod ?? ""}
            onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="" disabled>
              Select a method
            </option>
            <option value={PaymentMethod.CASH}>💵 Cash</option>
            <option value={PaymentMethod.CARD}>💳 Card</option>
            <option value={PaymentMethod.MOBILE_MONEY}>📱 Mobile Money</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>
          <button
            onClick={handleProceedClick}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow"
          >
            ✅ Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFeeModal;
