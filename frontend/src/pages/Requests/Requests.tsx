/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfirmDialog from "@/components/ConfirmDialog";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { CommonContext } from "@/context";
import { Status } from "@/enums";
import {
  deleteRequest,
  getSlotRequests,
  getUserRequests,
  updateStatus,
} from "@/services/slot-request";

import { DataTable, DataTableColumn } from "mantine-datatable";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { BiSearch } from "react-icons/bi";
import { useSelector } from "react-redux";

const Requests: React.FC = () => {
  const PAGE_SIZES = [5, 10, 15, 20];
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(PAGE_SIZES[0]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);
  const [approvalRequestId, setApprovalRequestId] = useState<string | null>(
    null
  );
  const [rejectRequestId, setRejectRequestId] = useState<string | null>(null);
  const [confirmDialogId, setConfirmDialogId] = useState<string | null>(null);

  const { user, slotRequests, setRequests, setMeta, meta } =
    useContext(CommonContext);
  const userSlice = useSelector((state: any) => state.userSlice);
  const role: string = userSlice.user.role;

  const refreshData = () => {
    if (role === "ADMIN") {
      getSlotRequests({
        page,
        limit,
        setLoading,
        setMeta,
        setRequests,
        searchKey,
      });
    } else {
      getUserRequests({
        page,
        limit,
        setLoading,
        setMeta,
        setRequests,
        searchKey,
      });
    }
  };

  const handleRequestApprove = async (requestId: string) => {
    setApprovalRequestId(requestId);
    await updateStatus({
      id: requestId,
      status: "APPROVED",
      setLoading,
      setStatusChanged: () => {},
    });
    setApprovalRequestId(null);
    setRefreshFlag(true);
  };

  const handleDelete = async (id: string) => {
    await deleteRequest({ id, setLoading, setIsModalClosed: () => {} });
    setConfirmDialogId(null);
    setRefreshFlag(true);
  };

  const handleRequestRejection = async (requestId: string) => {
    setRejectRequestId(requestId);
    await updateStatus({
      id: requestId,
      status: "REJECTED",
      setLoading,
      setStatusChanged: () => {},
    });
    setRejectRequestId(null);
    setRefreshFlag(true);
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
      accessor: "slot.location",
      title: "Parking Slot Location",
      render: ({ slot }: any) => slot?.location ?? "Not Assigned",
    },
    {
      accessor: "slot.number",
      title: "Parking Slot Number",
      render: ({ slot }: any) => slot?.number ?? "Not assigned",
    },
    {
      accessor: "slot.size",
      title: "Parking Slot Size",
      render: ({ slot }: any) => slot?.size ?? "Not Specified",
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
      render: (request: any) => (
        <div className="flex gap-2">
          {role === "USER" &&
            (request.status === Status.PENDING ||
              request.status == Status.REJECTED) && (
              <>
                <button
                  onClick={() => setConfirmDialogId(request.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
                {confirmDialogId === request.id && (
                  <ConfirmDialog
                    isOpen={true}
                    onClose={() => setConfirmDialogId(null)}
                    onConfirm={() => handleDelete(request.id)}
                    message="Are you sure you want to delete this request?"
                  />
                )}
              </>
            )}
          {role === "ADMIN" && request.status === Status.PENDING && (
            <>
              <button
                onClick={() => handleRequestApprove(request.id)}
                className={`${
                  approvalRequestId === request.id
                    ? "bg-green-200 cursor-not-allowed"
                    : "bg-green-500"
                } text-white px-4 py-2 rounded-md`}
                disabled={approvalRequestId === request.id}
              >
                {approvalRequestId === request.id ? "Processing..." : "Approve"}
              </button>
              <button
                onClick={() => handleRequestRejection(request.id)}
                className={`${
                  rejectRequestId === request.id
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-500"
                } text-white px-4 py-2 rounded-md`}
                disabled={rejectRequestId === request.id}
              >
                {rejectRequestId === request.id ? "Processing..." : "Reject"}
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    refreshData();
  }, [page, limit, searchKey, role]);

  useEffect(() => {
    if (refreshFlag) {
      refreshData();
      setRefreshFlag(false);
    }
  }, [refreshFlag]);

  return (
    <div className="w-full flex min-h-screen">
      <Sidebar />
      <Helmet>
        <title>Requests</title>
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
                  Your requests
                </span>
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
              records={slotRequests as unknown as Record<string, unknown>[]}
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
    </div>
  );
};

export default Requests;
