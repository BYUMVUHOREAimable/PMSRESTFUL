/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api";
import { CreateSlot, IMeta, ISlot } from "@/types";
import React from "react";
import toast from "react-hot-toast";

export const createSlot = async ({
  slotData,
  setLoading,
}: {
  slotData: CreateSlot;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const url = "/slot/create";
    await api.post(url, { ...slotData });
    toast.success("Parking Slot created successfully");
  } catch (error: any) {
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error login you in");
  } finally {
    setLoading(false);
  }
};
export const getSlots = async ({
  page,
  limit,
  setLoading,
  setMeta,
  setSlots,
  searchKey,
}: {
  page?: number;
  limit?: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMeta: React.Dispatch<React.SetStateAction<IMeta>>;
  setSlots: React.Dispatch<React.SetStateAction<ISlot[]>>;
  searchKey?: string;
}) => {
  try {
    let url = `/slot/all?page=${page}&limit=${limit}`;
    if (searchKey) url += `&searchKey=${searchKey}`;
    const response = await api.get(url);
    setSlots(response.data.data.slots);
    setMeta(response.data.data.meta);
  } catch (error: any) {
    if (error.response.data.status === 401)
      return window.location.replace("/auth/login");
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error getting parking slots");
  } finally {
    setLoading(false);
  }
};

export const getAvailableSlots = async ({
  page,
  limit,
  setLoading,
  setMeta,
  setSlots,
  searchKey,
}: {
  page: number;
  limit: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMeta: React.Dispatch<React.SetStateAction<IMeta>>;
  setSlots: React.Dispatch<React.SetStateAction<ISlot[]>>;
  searchKey?: string;
}) => {
  try {
    let url = `/slot/all/available?page=${page}&limit=${limit}`;
    if (searchKey) url += `&searchKey=${searchKey}`;
    const response = await api.get(url);
    setSlots(response.data.data.slots);
    setMeta(response.data.data.meta);
  } catch (error: any) {
    if (error.response.data.status === 401)
      return window.location.replace("/auth/login");
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error getting parking slots");
  } finally {
    setLoading(false);
  }
};

export const deleteSlot = async ({
  id,
  setLoading,
  setIsModalClosed,
}: {
  id: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const url = `/slot/${id}`;
    await api.delete(url);
    toast.success("slot   deleted successfully");
  } catch (error: any) {
    if (error.response.data.status === 401)
      return window.location.replace("/auth/login");
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error deleting parking slots");
  } finally {
    setIsModalClosed(true);

    setLoading(false);
  }
};
export const updateSlot = async ({
  id,
  slotData,
  setLoading,
  setIsModalClosed,
}: {
  id: string;
  slotData: CreateSlot;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const url = `/slot/${id}`;
    await api.patch(url, { ...slotData });
    toast.success("slot updated successfully");
  } catch (error: any) {
    if (error.response.data.status === 401)
      return window.location.replace("/auth/login");
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error updating parking slots");
  } finally {
    setLoading(false);
    setIsModalClosed(true);
  }
};

export const createSlots = async ({
  slots,
  setIsLoading,
  onClose,
}: {
  slots: CreateSlot[];
  onClose: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const url = "/slot/create/bulk";
    await api.post(url, { slots });
    onClose();
    toast.success("Parking Slot created successfully");
  } catch (error: any) {
    if (error.response.data.status === 401)
      return window.location.replace("/auth/login");
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error creating  parking slots");
  } finally {
    setIsLoading(false);
  }
};
