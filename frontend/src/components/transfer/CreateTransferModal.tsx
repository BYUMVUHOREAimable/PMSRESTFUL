/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { BiLoaderAlt } from "react-icons/bi";

// Assume these services fetch the data you need
import { createTransfer } from "@/services/transfer";
import { getUserVehicles } from "@/services/vehicle";
import { getUsers } from "@/services/user";
import { IUser, IVehicle } from "@/types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateTransferModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  loading,
  setIsLoading,
}) => {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  const [formData, setFormData] = useState({
    amount: "",
    vehicleId: "",
    toUserId: "",
    description: "",
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      Promise.all([
        getUserVehicles({
          page: 1,
          limit: 100,
          setLoading: setIsLoading,
          setMeta: () => {},
          setVehicles: setVehicles,
        }),
        getUsers({
          page: 1,
          limit: 100,
          setLoading: setIsLoading,
          setMeta: () => {},
          setUsers: setUsers,
        }),
      ])
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [isOpen, setIsLoading]);

  const validate = () => {
    const newErrors: any = {};
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }
    if (!formData.vehicleId) newErrors.vehicleId = "Please select your vehicle";
    if (!formData.toUserId) newErrors.toUserId = "Please select the recipient";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setIsLoading(true);
      try {
        await createTransfer({
          transferData: {
            amount: Number(formData.amount),
            vehicleId: formData.vehicleId,
            toUserId: formData.toUserId,
            description: formData.description || undefined,
          },
          setLoading: setIsLoading,
        });
        onClose();
      } catch (err) {
        setIsLoading(false);
        // handle error, e.g., setErrors({ general: "Transfer failed" });
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Request Transfer</h2>
          <button onClick={onClose} className="text-red-500 font-bold">
            X
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Amount */}
          <div className="mb-3">
            <label className="block text-sm font-medium">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="border rounded w-full p-2"
              placeholder="Enter amount"
              min="0"
              step="any"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount}</p>
            )}
          </div>

          {/* Vehicle (Sender) */}
          <div className="mb-3">
            <label className="block text-sm font-medium">Your Vehicle</label>
            <select
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              className="border rounded w-full p-2"
            >
              <option value="">-- Select Your Vehicle --</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plateNumber}
                </option>
              ))}
            </select>
            {errors.vehicleId && (
              <p className="text-red-500 text-sm">{errors.vehicleId}</p>
            )}
          </div>

          {/* Recipient User */}
          <div className="mb-3">
            <label className="block text-sm font-medium">Recipient User</label>
            <select
              name="toUserId"
              value={formData.toUserId}
              onChange={handleChange}
              className="border rounded w-full p-2"
            >
              <option value="">-- Select Recipient --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
            </select>
            {errors.toUserId && (
              <p className="text-red-500 text-sm">{errors.toUserId}</p>
            )}
          </div>

          {/* Description (optional) */}
          <div className="mb-4">
            <label className="block text-sm font-medium">
              Description (optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border rounded w-full p-2"
              rows={3}
              placeholder="Add any description"
            />
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
                "Request Transfer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTransferModal;
