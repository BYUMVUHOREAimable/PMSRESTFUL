/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Modal } from "@mantine/core";
import { SlotSize, VehicleType } from "@/enums"; // Import your enums here
import { ISlot } from "@/types"; // Import your slot interface

interface EditSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: ISlot | null;
  onSave: (updated: ISlot) => void;
}

const EditSlotModal: React.FC<EditSlotModalProps> = ({
  isOpen,
  onClose,
  slot,
  onSave,
}) => {
  const [form, setForm] = useState<Partial<ISlot>>({});

  useEffect(() => {
    if (slot) {
      setForm(slot);
    }
  }, [slot]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (slot) {
      onSave({ ...slot, ...form } as ISlot);
      onClose();
    }
  };

  if (!slot) return null;

  return (
    <Modal opened={isOpen} onClose={onClose} title="Edit Parking Slot" centered>
      <div className="flex flex-col gap-4">
        {/* Number */}
        <input
          name="number"
          value={form.number || ""}
          onChange={handleChange}
          placeholder="Slot Number"
          className="border rounded px-3 py-2"
        />

        {/* Size */}
        <select
          name="size"
          value={form.size || ""}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        >
          <option value="" disabled>
            Select Slot Size
          </option>
          {Object.values(SlotSize).map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        {/* Vehicle Type */}
        <select
          name="vehicleType"
          value={form.vehicleType || ""}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        >
          <option value="" disabled>
            Select Vehicle Type
          </option>
          {Object.values(VehicleType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Location */}
        <input
          name="location"
          value={form.location || ""}
          onChange={handleChange}
          placeholder="Location"
          className="border rounded px-3 py-2"
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default EditSlotModal;
