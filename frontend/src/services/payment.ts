/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api";
import { ISession, IMeta, PaymentFeePayload, IPayment } from "@/types";
import React from "react";
import toast from "react-hot-toast";

export const createPayment = async ({
  paymentData,
  setLoading,
  setFeeModalOpen,
}: {
  paymentData: PaymentFeePayload;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFeeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const url = "/payment/create";
    await api.post(url, { ...paymentData });
    toast.success("Parking Session created successfully");
  } catch (error: any) {
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error login you in");
  } finally {
    setLoading(false);
    setFeeModalOpen(false);
  }
};
export const getPayments = async ({
  page,
  limit,
  setLoading,
  setMeta,
  setPayments,
  searchKey,
}: {
  page: number;
  limit: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMeta: React.Dispatch<React.SetStateAction<IMeta>>;
  setPayments: React.Dispatch<React.SetStateAction<IPayment[]>>;
  searchKey: string;
}) => {
  try {
    let url = `/payment/all?page=${page}&limit=${limit}`;
    if (searchKey) url += `&searchKey=${searchKey}`;
    const response = await api.get(url);
    setPayments(response.data.data.payments);
    setMeta(response.data.data.meta);
  } catch (error: any) {
    if (error.response.data.status === 401)
      return window.location.replace("/auth/login");
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error payments sessions");
  } finally {
    setLoading(false);
  }
};

export const getUserPayment = async ({
  page,
  limit,
  setLoading,
  setMeta,
  setSessions,
  searchKey,
}: {
  page: number;
  limit: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMeta: React.Dispatch<React.SetStateAction<IMeta>>;
  setSessions: React.Dispatch<React.SetStateAction<ISession[]>>;
  searchKey: string;
}) => {
  try {
    let url = `/payment/user/all?page=${page}&limit=${limit}`;
    if (searchKey) url += `&searchKey=${searchKey}`;
    const response = await api.get(url);
    setSessions(response.data.data.payments);
    setMeta(response.data.data.meta);
  } catch (error: any) {
    if (error.response.data.status === 401)
      return window.location.replace("/auth/login");
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error User payments");
  } finally {
    setLoading(false);
  }
};
