/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { SlotSize, VehicleType } from "@/enums";
import { createSlot } from "@/services/slots";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateSlotModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  loading,
  setIsLoading,
}) => {
  const [formData, setFormData] = useState({
    number: "",
    size: SlotSize.MEDIUM,
    vehicleType: VehicleType.CAR,
    location: "",
  });

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (!formData.number) newErrors.number = "Slot number is required";
    if (!formData.size) newErrors.size = "Slot size is required";
    if (!formData.vehicleType)
      newErrors.vehicleType = "Vehicle type is required";
    if (!formData.location) newErrors.location = "Location is required";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      await createSlot({ slotData: { ...formData }, setLoading: setIsLoading });
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
          <h2 className="text-xl font-semibold">Create Parking Slot</h2>
          <button onClick={onClose} className="text-red-500 font-bold">
            X
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Slot Number */}
          <div className="mb-3">
            <label className="block text-sm font-medium">Slot Number</label>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="border rounded w-full p-2"
              placeholder="e.g., A01"
            />
            {errors.number && (
              <p className="text-red-500 text-sm">{errors.number}</p>
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

          {/* Location */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="border rounded w-full p-2"
              placeholder="e.g., Basement A"
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`bg-green-600 text-white py-2 px-4 rounded ${
                loading ? "opacity-50" : ""
              }`}
            >
              {loading ? (
                <BiLoaderAlt className="animate-spin" size={20} />
              ) : (
                "Create Slot"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSlotModal;
