/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import CreateTransferModal from "@/components/transfer/CreateTransferModal";
import ViewTransferModal from "@/components/transfer/ViewTransferModal";
import { CommonContext } from "@/context";
import { Status } from "@/enums";
import {
  approveTransfer,
  getTransfers,
  getUserTransfers,
  rejectTransfer,
} from "@/services/transfer";
import { ITransfer } from "@/types";

import { DataTable, DataTableColumn } from "mantine-datatable";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { BiSearch } from "react-icons/bi";
import { useSelector } from "react-redux";

const Transfers: React.FC = () => {
  const PAGE_SIZES = [5, 10, 15, 20];
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(PAGE_SIZES[0]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [approvalTransferId, setApprovalTransferId] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalClosed, setIsModalClosed] = useState<boolean>(false);
  const [rejectTransferId, setRejectTransferId] = useState<string | null>(null);
  const [selectedTransfer, setSelectedTransfer] = useState<ITransfer | null>(
    null
  );
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const { user, transfers, setTransfers, setMeta, meta } =
    useContext(CommonContext);
  const userSlice = useSelector((state: any) => state.userSlice);
  const role: string = userSlice.user.role;

  const refreshData = () => {
    const fetchFn = role === "ADMIN" ? getTransfers : getUserTransfers;

    fetchFn({
      page,
      limit,
      setLoading,
      setMeta,
      setTransfers,
      searchKey,
    });
  };

  const handleTransferApproval = async (transferId: string) => {
    setApprovalTransferId(transferId);
    await approveTransfer({
      id: transferId,
      setLoading,
    });
    setApprovalTransferId(null);
    refreshData();
  };

  const handleTransferRejection = async (transferId: string) => {
    setRejectTransferId(transferId);
    await rejectTransfer({
      id: transferId,
      setLoading,
    });
    setRejectTransferId(null);
    refreshData();
  };

  const openTransferModal = (transfer: ITransfer) => {
    setSelectedTransfer(transfer);
    setIsTransferModalOpen(true);
  };

  const columns: DataTableColumn[] = [
    {
      accessor: "vehicle.plateNumber",
      title: "Plate number",
      sortKey: "id",
    },
    {
      accessor: "vehicle.vehicleType",
      title: "Request type",
    },
    {
      accessor: "vehicle.model",
      title: "Model",
    },

    {
      accessor: "fromUser",
      title: "From",
      render: (row: any) =>
        `${row.fromUser.firstName} ${row.fromUser.lastName}`,
    }, //
    {
      accessor: "toUser",
      title: "To",
      render: (row: any) => `${row.toUser.firstName} ${row.toUser.lastName}`,
    },
    {
      accessor: "price",
      title: "Amount",
      render: ({ price }: any) => `$${price}`,
    },
    {
      accessor: "status",
      title: "Status",
      render: ({ status }: any) => {
        let bgColor = "";

        switch (status?.toUpperCase()) {
          case "APPROVED":
            bgColor = "text-green-600";
            break;
          case "REJECTED":
            bgColor = "text-red-600";
            break;
          case "PENDING":
            bgColor = "text-yellow-500";
            break;
          default:
            bgColor = "bg-gray-400";
            break;
        }

        return (
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${bgColor}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessor: "",
      title: "Actions",
      render: (transfer: any) => (
        <div className="flex gap-2">
          {role === "ADMIN" && transfer.status === Status.PENDING && (
            <>
              <button
                onClick={() => handleTransferApproval(transfer.id)}
                className={`${
                  approvalTransferId === transfer.id
                    ? "bg-green-200 cursor-not-allowed"
                    : "bg-green-500"
                } text-white px-4 py-2 rounded-md`}
                disabled={approvalTransferId === transfer.id}
              >
                {approvalTransferId === transfer.id
                  ? "Processing..."
                  : "Approve"}
              </button>
              <button
                onClick={() => handleTransferRejection(transfer.id)}
                className={`${
                  rejectTransferId === transfer.id
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-500"
                } text-white px-4 py-2 rounded-md`}
                disabled={rejectTransferId === transfer.id}
              >
                {rejectTransferId === transfer.id ? "Processing..." : "Reject"}
              </button>
            </>
          )}
          <button
            className="bg-primary-blue text-white px-4 py-2 rounded-md"
            onClick={() => openTransferModal(transfer)}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    refreshData();

    if (isModalClosed) {
      refreshData();
      setIsModalClosed(false);
    }
  }, [page, limit, searchKey, isModalClosed]);

  return (
    <div className="w-full flex min-h-screen">
      <Sidebar />
      <Helmet>
        <title>Transfers</title>
      </Helmet>
     <div className="w-full lg:ml-[16.6667%] flex flex-col">
        <Navbar />
        <div className="flex flex-col px-2 xs:px-6 sm:px-14 pt-8">
          <span className="text-lg font-semibold">
            Hi👋, {user.firstName} {user.lastName}
          </span>
          <div className="w-full my-14">
            <div className="w-full justify-end sm:justify-between flex mb-6 items-center">
              <div>
                <span className="hidden sm:flex my-8 text-xl">
                  {role === "ADMIN"
                    ? " here history of all transfers"
                    : "all transfers you are related to "}
                </span>
                {role != "ADMIN" && (
                  <button
                    className="text-white bg-primary-blue rounded py-2 px-8 text-lg"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Request vehicle transfer
                  </button>
                )}
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
                  onClick={refreshData}
                  className="absolute top-1 mx-auto bottom-1 right-2 bg-primary-blue w-10 h-10 rounded-full flex items-center justify-center"
                >
                  <BiSearch color="white" size={25} />
                </button>
              </div>
            </div>
            <DataTable
              records={transfers as unknown as Record<string, unknown>[]}
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
      <CreateTransferModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsModalClosed(true);
        }}
        loading={loading}
        setIsLoading={setLoading}
      />
      <ViewTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        transfer={selectedTransfer}
      />
    </div>
  );
};

export default Transfers;
