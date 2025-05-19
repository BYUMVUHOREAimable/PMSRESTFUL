/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Modal } from "@mantine/core";
import { IVehicle } from "@/types";

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: IVehicle | null;
  onSave: (updated: IVehicle) => void;
}

const EditVehicleModal: React.FC<EditVehicleModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onSave,
}) => {
  const [form, setForm] = useState<Partial<IVehicle>>({});

  useEffect(() => {
    if (vehicle) {
      setForm(vehicle);
    }
  }, [vehicle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (vehicle) {
      onSave({ ...vehicle, ...form } as IVehicle);
      onClose();
    }
  };

  if (!vehicle) return null;

  return (
    <Modal opened={isOpen} onClose={onClose} title="Edit Vehicle" centered>
      <div className="flex flex-col gap-4">
        {["plateNumber", "vehicleType", "model", "color", "maker"].map(
          (key) => (
            <input
              key={key}
              name={key}
              value={(form as any)[key] || ""}
              onChange={handleChange}
              placeholder={key}
              className="border rounded px-3 py-2"
            />
          )
        )}
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

export default EditVehicleModal;
