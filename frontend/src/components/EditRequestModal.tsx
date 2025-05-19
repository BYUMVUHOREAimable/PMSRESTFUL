// import React, { useState, useEffect } from "react";
// import { Modal } from "@mantine/core";
// import { ISlotRequest } from "@/types";
// import { updateRequest } from "@/services/slot-request";

// interface EditRequestModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   request: ISlotRequest | null;
//   onSave?: () => void; // callback after successful save
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
//   setIsModalClosed: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const EditRequestModal: React.FC<EditRequestModalProps> = ({
//   isOpen,
//   onClose,
//   request,
//   onSave,
//   setLoading,
//   setIsModalClosed,
// }) => {
//   const [vehicleId, setVehicleId] = useState<string>("");

//   useEffect(() => {
//     if (request) {
//       setVehicleId(request.vehicleId ?? "");
//     }
//   }, [request]);

//   const handleSubmit = async () => {
//     if (!request) return;

//     setLoading(true);
//     await updateRequest({
//       id: request.id,
//       vehicleId,
//       setLoading,
//       setIsModalClosed,
//     });

//     onClose();
//   };

//   if (!request) return null;

//   return (
//     <Modal opened={isOpen} onClose={onClose} title="Edit Slot Request" centered>
//       <div className="flex flex-col gap-4">
//         {/* Vehicle ID input (could be replaced by a select dropdown of user vehicles if you have that) */}
//         <label className="font-semibold">Vehicle ID</label>
//         <input
//           type="text"
//           value={vehicleId}
//           onChange={(e) => setVehicleId(e.target.value)}
//           placeholder="Enter vehicle ID"
//           className="border rounded px-3 py-2"
//         />

//         <button
//           onClick={handleSubmit}
//           className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
//           disabled={!vehicleId}
//         >
//           Save
//         </button>
//       </div>
//     </Modal>
//   );
// };

// export default EditRequestModal;
