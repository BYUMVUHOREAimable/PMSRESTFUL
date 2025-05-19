/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { CommonContext } from "@/context";
import { DataTable, DataTableColumn } from "mantine-datatable";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { BiSearch } from "react-icons/bi";
import { useSelector } from "react-redux";
import { deleteSlot, getSlots, updateSlot } from "@/services/slots";
import CreateSlotModal from "@/components/slot/CreateSlotModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import EditSlotModal from "@/components/slot/EditSlotModal";
import ViewSlotModal from "@/components/slot/ViewSlot";
import CreateMultipleSlotsModal from "@/components/slot/CreateMultipleModal";

const Slots: React.FC = () => {
  const PAGE_SIZES = [5, 10, 15, 20];
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(PAGE_SIZES[0]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isMultipleModalOpen, setIsMultipleModalOpen] =
    useState<boolean>(false);
  const [isModalClosed, setIsModalClosed] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { user, slots, setSlots, setMeta, meta } = useContext(CommonContext);

  const handleDelete = (slotId: string) => {
    deleteSlot({
      id: slotId,
      setLoading,
      setIsModalClosed,
    });
  };
  const columns: DataTableColumn[] = [
    {
      accessor: "number",
      title: "Slot number ",
      sortKey: "id",
    },
    {
      accessor: "vehicleType",
      title: "vehicle type",
    },
    {
      accessor: "size",
      title: "Size",
    },
    {
      accessor: "location",
      title: "Location",
    },
    {
      accessor: "status",
      title: "Status",
    },

    {
      accessor: "",
      title: "Actions",
      render: (slot: any) => {
        return (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedSlot(slot);
                setViewModalOpen(true);
              }}
              className="bg-primary-blue text-white px-4 py-2 rounded-md"
            >
              View
            </button>

            <button
              onClick={() => {
                setSelectedSlot(slot);
                setEditModalOpen(true);
              }}
              className="bg-primary-blue text-white px-4 py-2 rounded-md"
            >
              Edit
            </button>
            <>
              <button
                onClick={() => setShowConfirm(true)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>

              <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={() => handleDelete(slot.id)}
                message="Are you sure you want to delete this slot?"
              />
            </>
          </div>
        );
      },
    },
  ];

  const userSlice = useSelector((state: any) => state.userSlice);
  const role: string = userSlice.user.role;
  useEffect(() => {
    getSlots({ page, limit, setLoading, setMeta, setSlots, searchKey });

    if (isModalClosed) {
      getSlots({
        page,
        limit,
        setLoading,
        setMeta,
        setSlots,
        searchKey,
      });

      setIsModalClosed(false);
    }
  }, [
    isModalClosed,
    page,
    limit,
    searchKey,
    setLoading,
    setMeta,
    setSlots,
    role,
  ]);

  return (
    <div className="w-full flex min-h-screen">
      <Sidebar />
      <Helmet>
        <title>Slots</title>
      </Helmet>
      <div className="w-full lg:ml-[16.6667%] flex flex-col">
        <Navbar />
        <div className=" flex flex-col px-2 xs:px-6 sm:px-14 pt-8">
          <span className="text-lg font-semibold">
            Hi👋, {user.firstName} {user.lastName}
          </span>
          <div className="w-full my-14">
            <div className="w-full justify-end sm:justify-between flex mb-6 items-center">
              <div>
                <span className="hidden sm:flex my-8 text-xl">
                  here all slots in system
                </span>

                <div className="flex items-center justify-center space-x-6 mt-8">
                  <button
                    className="bg-primary-blue text-white rounded-lg py-3 px-8 text-lg font-semibold transition-colors duration-300 hover:bg-blue-700 shadow-md"
                    onClick={() => setIsModalOpen(true)}
                    aria-label="Register new parking slot"
                  >
                    Register New Slot in Parking
                  </button>

                  <span className="text-gray-500 font-medium">or</span>

                  <button
                    className="bg-primary-blue text-white rounded-lg py-3 px-8 text-lg font-semibold transition-colors duration-300 hover:bg-blue-700 shadow-md"
                    onClick={() => setIsMultipleModalOpen(true)}
                    aria-label="Register multiple parking slots"
                  >
                    Register Many Slots at Same Time
                  </button>
                </div>
              </div>
              <div className="bg-white w-11/12 dsm:w-10/12 sm:w-5/12 plg:w-3/12 rounded-3xl flex items-center relative h-12 justify-between">
                <input
                  placeholder="Search here..."
                  type="text"
                  className="outline-0 rounded-3xl bg-inherit w-10/12 p-2 pl-6"
                  onChange={(e) => {
                    setSearchKey(e.target.value);
                    setPage(1);
                  }}
                />
                <button
                  onClick={() => {
                    getSlots({
                      page,
                      limit,
                      setLoading,
                      setMeta,
                      setSlots,
                      searchKey,
                    });
                  }}
                  className="absolute top-1 mx-auto bottom-1 right-2 bg-primary-blue w-10 h-10 rounded-full flex items-center justify-center"
                >
                  <BiSearch color="white" size={25} />
                </button>
              </div>
            </div>
            <DataTable
              records={slots as unknown as Record<string, unknown>[]}
              columns={columns}
              page={page}
              recordsPerPage={limit}
              loadingText={loading ? "Loading..." : "Rendering..."}
              onPageChange={(page) => setPage(page)}
              recordsPerPageOptions={PAGE_SIZES}
              onRecordsPerPageChange={setLimit}
              withTableBorder
              borderRadius="sm"
              withColumnBorders
              styles={{ header: { background: "#f0f0f0cc" } }}
              striped
              totalRecords={meta?.total}
              highlightOnHover
              highlightOnHoverColor={"000"}
              noRecordsText="No records found"
              paginationActiveBackgroundColor={"#1967d2"}
            />
          </div>
        </div>
      </div>
      <CreateSlotModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsModalClosed(true);
        }}
        loading={loading}
        setIsLoading={setLoading}
      />
      <CreateMultipleSlotsModal
        isOpen={isMultipleModalOpen}
        onClose={() => {
          setIsMultipleModalOpen(false);
          setIsModalClosed(true);
        }}
        loading={loading}
        setIsLoading={setLoading}
      />
      <ViewSlotModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        slot={selectedSlot}
      />

      <EditSlotModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        slot={selectedSlot}
        onSave={(update) => {
          updateSlot({
            id: selectedSlot.id,
            slotData: update,
            setLoading,
            setIsModalClosed,
          });
        }}
      />
    </div>
  );
};

export default Slots;
