/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { createSession } from "@/services/sessions"; // Should POST to /entry

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  loading,
  setIsLoading,
}) => {
  const [formData, setFormData] = useState({
    plateNumber: "",
  });

  const [errors, setErrors] = useState<any>({});
  useEffect(() => {
    if (!isOpen) {
      setFormData({ plateNumber: "" });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors: any = {};

    const plate = formData.plateNumber.trim().toUpperCase();

    // Valid formats: RAD123B, RAB456C, GR1234, CD101, CM305
    const platePattern = /^(R[A-Z]{2}\d{3}[A-Z]|GR\d{4}|C[DM]\d{3})$/;

    if (!plate) {
      newErrors.plateNumber = "Plate number is required";
    } else if (!platePattern.test(plate)) {
      newErrors.plateNumber =
        "Invalid Rwandan plate. Examples: RAD123B, GR1234, CD101";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      await createSession({ sessionData: formData, setLoading: setIsLoading });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 sm:px-6">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-5 sm:p-8 animate-fade-in-up transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Enter Parking
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-2xl font-bold transition"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Plate Number */}
          <div>
            <label
              htmlFor="plateNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Plate Number
            </label>
            <input
              id="plateNumber"
              name="plateNumber"
              type="text"
              value={formData.plateNumber}
              onChange={handleChange}
              placeholder="Enter plate number"
              className={`w-full rounded-lg border px-4 py-2 text-sm sm:text-base transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.plateNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.plateNumber && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.plateNumber}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm sm:text-base font-medium transition ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <BiLoaderAlt className="animate-spin" size={18} />
                  Processing...
                </>
              ) : (
                "Enter Parking"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
