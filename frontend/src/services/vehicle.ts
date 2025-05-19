/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api";
import { IVehicle, IMeta, CreateVehicleDTO } from "@/types";
import toast from "react-hot-toast";
import React from "react";

// Create Vehicle
export const createVehicle = async ({
  vehicleData,
  setLoading,
  onSuccess,
}: {
  vehicleData: CreateVehicleDTO;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
}) => {
  try {
    const url = "/vehicle/create";
    await api.post(url, { ...vehicleData });
    toast.success("Vehicle added successfully");
    onSuccess?.();
  } catch (error: any) {
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error creating vehicle");
  } finally {
    setLoading(false);
  }
};

// Fetch All Vehicles (admin only)
export const getVehicles = async ({
  page,
  limit,
  setLoading,
  setVehicles,
  setMeta,
  searchKey,
}: {
  page: number;
  limit: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setVehicles: React.Dispatch<React.SetStateAction<IVehicle[]>>;
  setMeta: React.Dispatch<React.SetStateAction<IMeta>>;
  searchKey?: string;
}) => {
  try {
    let url = `/vehicle/all?page=${page}&limit=${limit}`;
    if (searchKey) url += `&searchKey=${searchKey}`;
    const response = await api.get(url);
    setVehicles(response.data.data.vehicles);
    setMeta(response.data.data.meta);
  } catch (error: any) {
    if (error.response.data.status === 401)
      return window.location.replace("/auth/login");
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error getting vehicles");
  } finally {
    setLoading(false);
  }
};

// Fetch User Vehicles
export const getUserVehicles = async ({
  page,
  limit,
  setLoading,
  setVehicles,
  setMeta,
  searchKey,
}: {
  page: number;
  limit: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setVehicles: React.Dispatch<React.SetStateAction<IVehicle[]>>;
  setMeta: React.Dispatch<React.SetStateAction<IMeta>>;
  searchKey?: string;
}) => {
  try {
    let url = `/vehicle/user/all?page=${page}&limit=${limit}`;
    if (searchKey) url += `&searchKey=${searchKey}`;

    const response = await api.get(url);
    setVehicles(response.data.data.vehicles);
    setMeta(response.data.data.meta);
  } catch (error: any) {
    if (error.response.data.status === 401)
      return window.location.replace("/auth/login");
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error getting parking sessions");
  } finally {
    setLoading(false);
  }
};

// Fetch Single Vehicle by ID
export const fetchVehicleById = async ({
  vehicleId,
  setLoading,
  setVehicleDetails,
  setVehicleModalOpen,
}: {
  vehicleId: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setVehicleDetails: React.Dispatch<React.SetStateAction<IVehicle | null>>;
  setVehicleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const url = `/vehicle/${vehicleId}`;
    const response = await api.get(url);
    setVehicleDetails(response.data.data.vehicle);
  } catch (error: any) {
    if (error.response.data.status === 401)
      return window.location.replace("/auth/login");
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error getting parking sessions");
  } finally {
    setLoading(false);
    setVehicleModalOpen(true);
  }
};

// Update Vehicle
export const updateVehicle = async ({
  id,
  vehicleData,
  setLoading,
  setIsModalClosed,
}: {
  id: string;
  vehicleData: CreateVehicleDTO;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const url = `/vehicle/${id}`;
    await api.put(url, { ...vehicleData });
    toast.success("Vehicle updated successfully");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Error updating vehicle");
  } finally {
    setLoading(false);
    setIsModalClosed(true);
  }
};

// Delete Vehicle
export const deleteVehicle = async ({
  id,
  setLoading,
  setIsModalClosed,
}: {
  id: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const url = `/vehicle/${id}`;
    await api.delete(url);
    toast.success("Vehicle deleted successfully");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Error deleting vehicle");
  } finally {
    setIsModalClosed(true);
    setLoading(false);
  }
};
