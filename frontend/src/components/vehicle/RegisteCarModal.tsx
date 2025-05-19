/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlotSize, VehicleType } from "@/enums";
import { createVehicle } from "@/services/vehicle";
import React, { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateVehicleModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  loading,
  setIsLoading,
}) => {
  const [formData, setFormData] = useState({
    plateNumber: "",
    vehicleType: VehicleType.CAR,
    size: SlotSize.MEDIUM,
    color: "",
    maker: "",
    model: "",
  });

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    const plateRegex = /^R[A-Z]{2}\d{3}[A-Z]$/;

    if (!formData.plateNumber) {
      newErrors.plateNumber = "Plate number is required";
    } else if (!plateRegex.test(formData.plateNumber)) {
      newErrors.plateNumber =
        "Plate number must be a valid Rwandan format (e.g., RAB123C)";
    }

    if (!formData.vehicleType)
      newErrors.vehicleType = "Vehicle type is required";
    if (!formData.size) newErrors.size = "Slot size is required";
    if (!formData.color) newErrors.color = "Color is required";
    if (!formData.maker) newErrors.maker = "Make is required";
    if (!formData.model) newErrors.model = "Model is required";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      await createVehicle({ vehicleData: formData, setLoading: setIsLoading });
      onClose();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Register Vehicle</h2>
          <button onClick={onClose} className="text-red-500 font-bold">
            X
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Plate Number */}
          <div className="mb-3">
            <label className="block text-sm font-medium">Plate Number</label>
            <input
              type="text"
              name="plateNumber"
              value={formData.plateNumber}
              onChange={handleChange}
              className="border rounded w-full p-2"
              placeholder="e.g., RAB123C"
            />
            {errors.plateNumber && (
              <p className="text-red-500 text-sm">{errors.plateNumber}</p>
            )}
          </div>

          {/* Vehicle Type */}
          <div className="mb-3">
            <label className="block text-sm font-medium">Vehicle Type</label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="border rounded w-full p-2"
            >
              <option value="">-- Select Vehicle Type --</option>
              {Object.values(VehicleType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.vehicleType && (
              <p className="text-red-500 text-sm">{errors.vehicleType}</p>
            )}
          </div>

          {/* Slot Size */}
          <div className="mb-3">
            <label className="block text-sm font-medium">Slot Size</label>
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="border rounded w-full p-2"
            >
              <option value="">-- Select Slot Size --</option>
              {Object.values(SlotSize).map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            {errors.size && (
              <p className="text-red-500 text-sm">{errors.size}</p>
            )}
          </div>

          {/* Color */}
          <div className="mb-3">
            <label className="block text-sm font-medium">Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="border rounded w-full p-2"
              placeholder="e.g., Red"
            />
            {errors.color && (
              <p className="text-red-500 text-sm">{errors.color}</p>
            )}
          </div>

          {/* Make */}
          <div className="mb-3">
            <label className="block text-sm font-medium">Make</label>
            <input
              type="text"
              name="maker"
              value={formData.maker}
              onChange={handleChange}
              className="border rounded w-full p-2"
              placeholder="e.g., Toyota"
            />
            {errors.maker && (
              <p className="text-red-500 text-sm">{errors.maker}</p>
            )}
          </div>

          {/* Model */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="border rounded w-full p-2"
              placeholder="e.g., Corolla"
            />
            {errors.model && (
              <p className="text-red-500 text-sm">{errors.model}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 text-white py-2 px-4 rounded ${
                loading ? "opacity-50" : ""
              }`}
            >
              {loading ? (
                <BiLoaderAlt className="animate-spin" size={20} />
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVehicleModal;
