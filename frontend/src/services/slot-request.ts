/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api";
import { IMeta, ISlotRequest } from "@/types";
import toast from "react-hot-toast";

export const createSlotRequest = async ({
  vehicleId,
  setLoading,
  setIsSlotRequested,
}: {
  vehicleId: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSlotRequested: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const url = "/slot-request/create";
    await api.post(url, { vehicleId });
    toast.success("slot request  made successfully");
  } catch (error: any) {
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error creating request");
  } finally {
    setLoading(false);
    setIsSlotRequested(true);
  }
};

// Fetch All slot-request (admin only)
export const getSlotRequests = async ({
  page,
  limit,
  setLoading,
  setRequests,
  setMeta,
  searchKey,
}: {
  page: number;
  limit: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setRequests: React.Dispatch<React.SetStateAction<ISlotRequest[]>>;
  setMeta: React.Dispatch<React.SetStateAction<IMeta>>;
  searchKey?: string;
}) => {
  try {
    let url = `/slot-request/all?page=${page}&limit=${limit}`;
    if (searchKey) url += `&searchKey=${searchKey}`;
    const response = await api.get(url);
    setRequests(response.data.data.requests);
    setMeta(response.data.data.meta);
  } catch (error: any) {
    if (error.response.data.status === 401)
      return window.location.replace("/auth/login");
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error getting requests");
  } finally {
    setLoading(false);
  }
};

// Fetch User requests
export const getUserRequests = async ({
  page,
  limit,
  setLoading,
  setRequests,
  setMeta,
  searchKey,
}: {
  page: number;
  limit: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setRequests: React.Dispatch<React.SetStateAction<ISlotRequest[]>>;
  setMeta: React.Dispatch<React.SetStateAction<IMeta>>;
  searchKey?: string;
}) => {
  try {
    let url = `/slot-request/user?page=${page}&limit=${limit}`;
    if (searchKey) url += `&searchKey=${searchKey}`;

    const response = await api.get(url);
    setRequests(response.data.data.requests);
    setMeta(response.data.data.meta);
  } catch (error: any) {
    if (error.response.data.status === 401)
      return window.location.replace("/auth/login");
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error getting user requests");
  } finally {
    setLoading(false);
  }
};

// Update Vehicle
export const updateRequest = async ({
  id,
  vehicleId,
  setLoading,
  setIsModalClosed,
}: {
  id: string;
  vehicleId: string;
  setIsModalClosed: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const url = `/slot-request/${id}`;
    await api.put(url, { vehicleId });
    toast.success("slot request  updated successfully");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Error updating slot ");
  } finally {
    setIsModalClosed(true);
    setLoading(false);
  }
};

// Delete request
export const deleteRequest = async ({
  id,
  setLoading,
  setIsModalClosed,
}: {
  id: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const url = `/slot-request/${id}`;
    await api.delete(url);
    toast.success("slot request  deleted successfully");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Error deleting vehicle");
  } finally {
    setIsModalClosed(true);

    setLoading(false);
  }
};
// Admin approve/reject slot request
export const updateStatus = async ({
  id,
  status,
  setLoading,
  setStatusChanged,
}: {
  id: string;
  status: "APPROVED" | "REJECTED";
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setStatusChanged: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const url = `/slot-request/${id}/status`;
    await api.put(url, { status });
    toast.success(`Request ${status.toLowerCase()} successfully`);
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || `Error updating request status`
    );
  } finally {
    setStatusChanged(true);
    setLoading(false);
  }
};
