/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet";
import { CommonContext } from "@/context";
import { getSlotRequests } from "@/services/slot-request";
import { getVehicles } from "@/services/vehicle";
import { DataTable, DataTableColumn } from "mantine-datatable";
import { BiSearch } from "react-icons/bi";
import { useSelector } from "react-redux";

const AdminDashboard: React.FC = () => {
  const PAGE_SIZES = [5, 10, 15, 20];
  const [loading, setLoading] = useState(false);
  const [requestsPage, setRequestsPage] = useState(1);
  const [requestsLimit, setRequestsLimit] = useState(PAGE_SIZES[0]);
  const [vehiclesPage, setVehiclesPage] = useState(1);
  const [vehiclesLimit, setVehiclesLimit] = useState(PAGE_SIZES[0]);
  const [searchKey, setSearchKey] = useState("");

  const { setRequests, slotRequests, setMeta, meta, setVehicles, vehicles } =
    useContext(CommonContext);

  const userSlice = useSelector((state: any) => state.userSlice);
  const role: string = userSlice.user.role;

  useEffect(() => {
    if (role === "ADMIN") {
      getSlotRequests({
        page: requestsPage,
        limit: requestsLimit,
        setLoading,
        setMeta,
        setRequests,
        searchKey,
      });

      getVehicles({
        page: vehiclesPage,
        limit: vehiclesLimit,
        setLoading,
        setMeta,
        setVehicles,
        searchKey,
      });
    }
  }, [
    requestsPage,
    requestsLimit,
    vehiclesPage,
    vehiclesLimit,
    searchKey,
    role,
    setMeta,
    setRequests,
    setVehicles,
  ]);

  const requestColumns: DataTableColumn[] = [
    { accessor: "vehicle.plateNumber", title: "Plate Number" },
    { accessor: "vehicle.model", title: "Model" },
    {
      accessor: "slot.location",
      title: "Slot Location",
      render: ({ slot }: any) => slot?.location || "N/A",
    },
    {
      accessor: "status",
      title: "Status",
      render: ({ status }: any) => (
        <span
          className={`px-2 py-1 rounded-full text-sm font-semibold ${
            status === "APPROVED"
              ? "bg-green-100 text-green-600"
              : status === "REJECTED"
              ? "bg-red-100 text-red-600"
              : "bg-yellow-100 text-yellow-500"
          }`}
        >
          {status}
        </span>
      ),
    },
  ];

  const vehicleColumns: DataTableColumn[] = [
    { accessor: "plateNumber", title: "Plate Number" },
    { accessor: "vehicleType", title: "Type" },
    { accessor: "model", title: "Model" },
    { accessor: "color", title: "Color" },
    { accessor: "maker", title: "Manufacturer" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Sidebar />
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      <div className="w-full lg:ml-[16.6667%] flex flex-col">
        <Navbar />
        <div className="px-4 sm:px-10 py-8 space-y-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, Admin 👋
          </h1>
          <p className="text-gray-600 mb-6">
            Monitor and manage your vehicle parking system at a glance.
          </p>

          {/* === Summary Cards === */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Requests", value: meta?.total || 0 },
              {
                label: "Pending Requests",
                value:
                  slotRequests?.filter((r: any) => r.status === "PENDING")
                    .length || 0,
              },
              {
                label: "Approved Requests",
                value:
                  slotRequests?.filter((r: any) => r.status === "APPROVED")
                    .length || 0,
              },
              { label: "Total Vehicles", value: vehicles?.length || 0 },
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition duration-300"
              >
                <h2 className="text-sm text-gray-500">{card.label}</h2>
                <p className="text-3xl font-bold text-gray-800">{card.value}</p>
              </div>
            ))}
          </div>

          {/* === Search Bar === */}
          <div className="flex justify-end">
            <div className="bg-white rounded-full shadow-md flex items-center h-12 w-full sm:w-1/2 lg:w-1/4 px-4">
              <input
                type="text"
                placeholder="Search something..."
                className="flex-grow outline-none bg-transparent text-sm"
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <BiSearch className="text-gray-600" size={20} />
            </div>
          </div>

          {/* === Recent Requests === */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Slot Requests</h2>
            <DataTable
              records={slotRequests || []}
              columns={requestColumns}
              page={requestsPage}
              recordsPerPage={requestsLimit}
              onPageChange={setRequestsPage}
              onRecordsPerPageChange={setRequestsLimit}
              totalRecords={meta?.total || 0}
              recordsPerPageOptions={PAGE_SIZES}
              loadingText={loading ? "Loading..." : "Fetching records..."}
              noRecordsText="No slot requests yet. Requests will appear here."
              highlightOnHover
              striped
              withTableBorder
              borderRadius="md"
              withColumnBorders
              paginationActiveBackgroundColor="#3b82f6"
            />
          </div>

          {/* === Vehicles Section === */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Registered Vehicles</h2>
            <DataTable
              records={vehicles || []}
              columns={vehicleColumns}
              page={vehiclesPage}
              recordsPerPage={vehiclesLimit}
              onPageChange={setVehiclesPage}
              onRecordsPerPageChange={setVehiclesLimit}
              totalRecords={meta?.total || 0}
              recordsPerPageOptions={PAGE_SIZES}
              loadingText={loading ? "Loading..." : "Fetching vehicles..."}
              noRecordsText="No registered vehicles. Start adding some!"
              highlightOnHover
              striped
              withTableBorder
              borderRadius="md"
              withColumnBorders
              paginationActiveBackgroundColor="#3b82f6"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
