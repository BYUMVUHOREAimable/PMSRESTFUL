import React, { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { SlotSize, VehicleType } from "@/enums";
import { createSlots } from "@/services/slots"; // Your multi-slot create API
import { CreateSlot } from "@/types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}



const CreateMultipleSlotsModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  loading,
  setIsLoading,
}) => {
  const [slots, setSlots] = useState<CreateSlot[]>([
    {
      number: "",
      size: SlotSize.MEDIUM,
      vehicleType: VehicleType.CAR,
      location: "",
    },
  ]);

  const [errors, setErrors] = useState<Array<Record<string, string>>>([{}]);

  const validateSlot = (slot: CreateSlot) => {
    const slotErrors: Record<string, string> = {};
    if (!slot.number) slotErrors.number = "Slot number is required";
    if (!slot.size) slotErrors.size = "Slot size is required";
    if (!slot.vehicleType) slotErrors.vehicleType = "Vehicle type is required";
    if (!slot.location) slotErrors.location = "Location is required";
    return slotErrors;
  };

  const validateAll = () => {
    const allErrors = slots.map(validateSlot);
    setErrors(allErrors);
    return allErrors.every((slotErr) => Object.keys(slotErr).length === 0);
  };

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedSlots = [...slots];
    updatedSlots[index] = {
      ...updatedSlots[index],
      [name]: value,
    };
    setSlots(updatedSlots);
  };

  const addSlot = () => {
    setSlots([
      ...slots,
      {
        number: "",
        size: SlotSize.MEDIUM,
        vehicleType: VehicleType.CAR,
        location: "",
      },
    ]);
    setErrors([...errors, {}]);
  };

  const removeSlot = (index: number) => {
    if (slots.length === 1) return; // Prevent removing last slot
    const updatedSlots = slots.filter((_, i) => i !== index);
    const updatedErrors = errors.filter((_, i) => i !== index);
    setSlots(updatedSlots);
    setErrors(updatedErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsLoading(true);
    createSlots({ slots, setIsLoading, onClose });
    setSlots([
      {
        number: "",
        size: SlotSize.MEDIUM,
        vehicleType: VehicleType.CAR,
        location: "",
      },
    ]);
    setErrors([{}]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4 overflow-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-full overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Create Multiple Parking Slots
          </h2>
          <button
            onClick={onClose}
            className="text-red-500 font-bold text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {slots.map((slot, index) => (
            <div
              key={index}
              className="mb-6 p-4 border rounded-md bg-gray-50 relative"
            >
              <button
                type="button"
                onClick={() => removeSlot(index)}
                disabled={slots.length === 1}
                className="absolute top-2 right-2 text-red-500 font-bold text-xl leading-none"
                title="Remove this slot"
              >
                &times;
              </button>

              {/* Slot Number */}
              <div className="mb-3">
                <label className="block text-sm font-medium">Slot Number</label>
                <input
                  type="text"
                  name="number"
                  value={slot.number}
                  onChange={(e) => handleChange(index, e)}
                  className="border rounded w-full p-2"
                  placeholder="e.g., A01"
                />
                {errors[index]?.number && (
                  <p className="text-red-500 text-sm">{errors[index].number}</p>
                )}
              </div>

              {/* Vehicle Type */}
              <div className="mb-3">
                <label className="block text-sm font-medium">
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  value={slot.vehicleType}
                  onChange={(e) => handleChange(index, e)}
                  className="border rounded w-full p-2"
                >
                  <option value="">-- Select Vehicle Type --</option>
                  {Object.values(VehicleType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors[index]?.vehicleType && (
                  <p className="text-red-500 text-sm">
                    {errors[index].vehicleType}
                  </p>
                )}
              </div>

              {/* Slot Size */}
              <div className="mb-3">
                <label className="block text-sm font-medium">Slot Size</label>
                <select
                  name="size"
                  value={slot.size}
                  onChange={(e) => handleChange(index, e)}
                  className="border rounded w-full p-2"
                >
                  <option value="">-- Select Slot Size --</option>
                  {Object.values(SlotSize).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                {errors[index]?.size && (
                  <p className="text-red-500 text-sm">{errors[index].size}</p>
                )}
              </div>

              {/* Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Location</label>
                <input
                  type="text"
                  name="location"
                  value={slot.location}
                  onChange={(e) => handleChange(index, e)}
                  className="border rounded w-full p-2"
                  placeholder="e.g., Basement A"
                />
                {errors[index]?.location && (
                  <p className="text-red-500 text-sm">
                    {errors[index].location}
                  </p>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={addSlot}
              className="bg-green-600 text-white py-2 px-4 rounded"
              disabled={loading}
            >
              + Add Another Slot
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 text-white py-2 px-6 rounded flex items-center justify-center ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <BiLoaderAlt className="animate-spin mr-2" size={20} />
              ) : (
                "Create Slots"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMultipleSlotsModal;
