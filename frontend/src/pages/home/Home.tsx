/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/components/Modal";
import Navbar from "@/components/Navbar";
import PaymentFeeModal from "@/components/PaymentModal";
import SessionDetails from "@/components/SessionDetails";
import Sidebar from "@/components/Sidebar";
import { CommonContext } from "@/context";
import { PaymentStatus } from "@/enums";
import { createPayment } from "@/services/payment";
import {
  exitSession,
  getPaymentFee,
  getSessionDetails,
  getSessions,
  getUserSessions,
} from "@/services/sessions";
import { ISession, PaymentFee, PaymentFeePayload } from "@/types";
import { format } from "date-fns";
import { DataTable, DataTableColumn } from "mantine-datatable";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { BiSearch } from "react-icons/bi";
import { useSelector } from "react-redux";

const Home: React.FC = () => {
  const PAGE_SIZES = [5, 10, 15, 20];
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(PAGE_SIZES[0]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalClosed, setIsModalClosed] = useState<boolean>(false);
  const [feeModalOpen, setFeeModalOpen] = useState(false);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [sessionDetails, setSessionDetails] = useState<any>();
  const [feeDetails, setFeeDetails] = useState<PaymentFee | null>(null);
  const { user, sessions, setSessions, setMeta, meta } =
    useContext(CommonContext);

  const handleGetPaymentFee = (sessionId: string) => {
    getPaymentFee({
      sessionId,
      setLoading,
      setFeeDetails,
      setFeeModalOpen,
      setMeta,
    });
  };
  const handleView = (sessionId: string) => {
    getSessionDetails({
      sessionId,
      setLoading,
      setSessionDetails,
      setSessionModalOpen,
      setMeta,
    });
  };
  const handleExit = (sessionId: string) => {
    exitSession({
      sessionId,
      setLoading,
      setSessionModalOpen,
    });
  };
  const handleProceedToPayment = (data: PaymentFeePayload) => {
    createPayment({ paymentData: data, setLoading, setFeeModalOpen });
  };
  const columns: DataTableColumn<ISession>[] = [
    {
      accessor: "slot.number",
      title: "🚘 Slot #",
    },
    {
      accessor: "name",
      title: "🕓 Entry Time",
      render: ({ createdAt }) => (
        <span className="text-gray-700 text-sm">
          {format(new Date(createdAt), "MMM dd, yyyy, hh:mm a")}
        </span>
      ),
    },
    {
      accessor: "exitTime",
      title: "🏁 Exit Time",
      render: ({ exitTime }: any) =>
        exitTime ? (
          <span className="text-gray-700 text-sm">
            {format(new Date(exitTime), "MMM dd, yyyy, hh:mm a")}
          </span>
        ) : (
          <span className="text-gray-500 italic text-sm">Still in parking</span>
        ),
    },
    {
      accessor: "paymentStatus",
      title: "💳 Status",
      render: ({ paymentStatus }) => (
        <span
          className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
            paymentStatus === PaymentStatus.PAID
              ? "bg-green-600"
              : "bg-yellow-500"
          }`}
        >
          {paymentStatus === PaymentStatus.PAID ? "Paid" : "Not paid yet"}
        </span>
      ),
    },
    {
      accessor: "payment.amount",
      title: "💰 Amount",
      render: ({ payment }: any) => {
        const amount = payment?.amount;
        return typeof amount === "number" ? (
          <span className="text-gray-800">${amount.toFixed(2)}</span>
        ) : (
          <span className="text-red-500 italic">Not paid</span>
        );
      },
    },
    {
      accessor: "plateNumber",
      title: "🚙 Plate No.",
      render: ({ plateNumber }) => (
        <span className="text-gray-700 font-medium">{plateNumber}</span>
      ),
    },
    {
      accessor: "isExited",
      title: "📍 Parking Status",
      render: ({ isExited, paymentStatus }) => {
        if (isExited) {
          return <span className="text-yellow-500 font-medium">Exited</span>;
        } else if (paymentStatus === PaymentStatus.PAID) {
          return (
            <span className="text-green-600 font-medium">Paid – Can Exit</span>
          );
        } else {
          return (
            <span className="text-red-600 font-medium">
              In Parking – Unpaid
            </span>
          );
        }
      },
    },
    {
      accessor: "subject",
      title: "⚙️ Actions",
      render: (row) => (
        <div className="flex gap-3">
          <button
            onClick={() => handleView(row.id as string)}
            className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none text-white px-4 py-1.5 rounded-md shadow-md transition duration-200 ease-in-out text-sm font-semibold"
          >
            View
          </button>
          {row.paymentStatus === PaymentStatus.PENDING && (
            <button
              onClick={() => handleGetPaymentFee(row.id as string)}
              className="bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none text-white px-5 py-1.5 rounded-md shadow-md transition duration-200 ease-in-out text-sm font-semibold"
            >
              Get Fee
            </button>
          )}
        </div>
      ),
    },
  ];

  const userSlice = useSelector((state: any) => state.userSlice);
  const role: string = userSlice.user.role;
  useEffect(() => {
    if (role === "ADMIN") {
      getSessions({ page, limit, setLoading, setMeta, setSessions, searchKey });
    } else {
      getUserSessions({
        page,
        limit,
        setLoading,
        setMeta,
        setSessions,
        searchKey,
      });
    }
    if (isModalClosed || feeModalOpen || sessionModalOpen) {
      if (role === "ADMIN") {
        getSessions({
          page,
          limit,
          setLoading,
          setMeta,
          setSessions,
          searchKey,
        });
      } else {
        getUserSessions({
          page,
          limit,
          setLoading,
          setMeta,
          setSessions,
          searchKey,
        });
      }
      setIsModalClosed(false);
    }
  }, [
    isModalClosed,
    page,
    limit,
    searchKey,
    setLoading,
    setMeta,
    setSessions,
    role,
    feeModalOpen,
    sessionModalOpen,
  ]);

  return (
    <div className="w-full flex min-h-screen">
      <Sidebar />
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="w-full lg:ml-[16.6667%] flex flex-col bg-gray-50 min-h-screen">
        <Navbar />

        <div className="flex flex-col px-4 sm:px-8 md:px-14 pt-8 w-full">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">
            Hi 👋, {user.firstName} {user.lastName}
          </h1>

          <div className="mt-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
              {/* Heading + Button */}
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Recently Accessed Sessions
                </h2>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-base rounded-lg shadow-md transition-all"
                >
                  Enter Parking
                </button>
              </div>

              <div className="relative w-full sm:w-1/2 md:w-1/3">
                <input
                  type="text"
                  placeholder="🔍 Search sessions..."
                  onChange={(e) => {
                    setSearchKey(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-white border border-gray-300 rounded-full py-2 pl-5 pr-12 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() =>
                    getSessions({
                      page,
                      limit,
                      setLoading,
                      setMeta,
                      setSessions,
                      searchKey,
                    })
                  }
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 w-9 h-9 rounded-full flex items-center justify-center"
                >
                  <BiSearch size={20} color="white" />
                </button>
              </div>
            </div>

            {/* Table Section */}
            {Array.isArray(sessions) ? (
              <DataTable<ISession>
                records={sessions}
                columns={columns}
                page={page}
                recordsPerPage={limit}
                loadingText={loading ? "Loading..." : "Rendering..."}
                onPageChange={setPage}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={setLimit}
                withTableBorder
                borderRadius="md"
                withColumnBorders
                styles={{ header: { backgroundColor: "#f9fafb" } }}
                striped
                totalRecords={meta?.total ?? 0}
                highlightOnHover
                highlightOnHoverColor="#e0f2fe"
                noRecordsText="🚫 No sessions found"
                paginationActiveBackgroundColor="#2563eb"
              />
            ) : (
              <div className="text-red-600 font-medium mt-4">
                ⚠️ Failed to load session records.
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsModalClosed(true);
        }}
        loading={loading}
        setIsLoading={setLoading}
      />
      <PaymentFeeModal
        isOpen={feeModalOpen}
        onClose={() => setFeeModalOpen(false)}
        data={feeDetails}
        onProceed={handleProceedToPayment}
      />
      <SessionDetails
        isOpen={sessionModalOpen}
        onClose={() => setSessionModalOpen(false)}
        data={sessionDetails}
        onProceed={handleExit}
      />
    </div>
  );
};

export default Home;
