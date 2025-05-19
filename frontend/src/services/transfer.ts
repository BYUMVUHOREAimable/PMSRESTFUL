/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api";
import { CreateTransfer, ITransfer, IMeta } from "@/types";
import React from "react";
import toast from "react-hot-toast";

export const createTransfer = async ({
  transferData,
  setLoading,
}: {
  transferData: CreateTransfer;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const url = "/transfer/create";
    await api.post(url, { ...transferData });
    toast.success("Transfer created successfully");
  } catch (error: any) {
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error creating transfer");
  } finally {
    setLoading(false);
  }
};

export const approveTransfer = async ({
  id,
  setLoading,
}: {
  id: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const url = `/transfer/${id}/approve`;
    await api.patch(url);
    toast.success("Transfer approved successfully");
  } catch (error: any) {
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error approving transfer");
  } finally {
    setLoading(false);
  }
};

export const getTransfers = async ({
  page,
  limit,
  setLoading,
  setMeta,
  setTransfers,
  searchKey,
}: {
  page?: number;
  limit?: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMeta: React.Dispatch<React.SetStateAction<IMeta>>;
  setTransfers: React.Dispatch<React.SetStateAction<ITransfer[]>>;
  searchKey?: string;
}) => {
  try {
    let url = `/transfer/all?page=${page}&limit=${limit}`;
    if (searchKey) url += `&searchKey=${searchKey}`;
    const response = await api.get(url);
    setTransfers(response.data.data.transfers);
    setMeta(response.data.data.meta);
  } catch (error: any) {
    if (error.response?.data?.status === 401)
      return window.location.replace("/auth/login");
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error getting transfers");
  } finally {
    setLoading(false);
  }
};

export const deleteTransfer = async ({
  id,
  setLoading,
  setIsModalClosed,
}: {
  id: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const url = `/transfer/${id}`;
    await api.delete(url);
    toast.success("Transfer deleted successfully");
  } catch (error: any) {
    if (error.response?.data?.status === 401)
      return window.location.replace("/auth/login");
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error deleting transfer");
  } finally {
    setIsModalClosed(true);
    setLoading(false);
  }
};

export const updateTransfer = async ({
  id,
  transferData,
  setLoading,
  setIsModalClosed,
}: {
  id: string;
  transferData: Partial<CreateTransfer>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const url = `/transfer/${id}`;
    await api.patch(url, { ...transferData });
    toast.success("Transfer updated successfully");
  } catch (error: any) {
    if (error.response?.data?.status === 401)
      return window.location.replace("/auth/login");
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error updating transfer");
  } finally {
    setLoading(false);
    setIsModalClosed(true);
  }
};

export const rejectTransfer = async ({
  id,
  setLoading,
}: {
  id: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const url = `/transfer/${id}/reject`;
    await api.patch(url);
    toast.success("Transfer rejected successfully");
  } catch (error: any) {
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error rejecting transfer");
  } finally {
    setLoading(false);
  }
};

export const getUserTransfers = async ({
  page,
  limit,
  setLoading,
  setTransfers,
  setMeta,
  searchKey,
}: {
  page: number;
  limit: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setTransfers: React.Dispatch<React.SetStateAction<ITransfer[]>>;
  setMeta: React.Dispatch<React.SetStateAction<IMeta>>;
  searchKey?: string;
}) => {
  try {
    let url = `/transfer/user/all?page=${page}&limit=${limit}`;
    if (searchKey) url += `&searchKey=${searchKey}`;

    const response = await api.get(url);
    setTransfers(response.data.data.transfers);
    setMeta(response.data.data.meta);
  } catch (error: any) {
    if (error.response?.data?.status === 401)
      return window.location.replace("/auth/login");

    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error getting transfer data");
  } finally {
    setLoading(false);
  }
};
