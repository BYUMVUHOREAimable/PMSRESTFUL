/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api";
import { login } from "@/redux/slices/userReducer";
import React from "react";
import toast from "react-hot-toast";

export const signIn = async ({
  dispatch,
  setLoading,
  email,
  password,
}: {
  dispatch: any;
  email: string;
  password: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    setLoading(true);
    const url = "/auth/login";
    const response = await api.post(url, { email, password });
    toast.success("Login successful");
    dispatch(login({ ...response.data.data }));
    localStorage.setItem("token", response.data.data.token);
    setTimeout(() => {
      window.location.replace(`/`);
    }, 1000);
  } catch (error: any) {
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error logging you in");
  } finally {
    setLoading(false);
  }
};

export const verifyOtp = async ({
  setLoading,
  otpCode,
}: {
  otpCode: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    setLoading(true);
    const url = "/auth/verify-otp";
    await api.put(url, {otpCode});
    toast.success("your account is verified now ");
    setTimeout(() => {
      window.location.replace(`/auth/login`);
    }, 1000);
  } catch (error: any) {
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error logging you in");
  } finally {
    setLoading(false);
  }
};

export const resendOtp = async ({
  setLoading,
  email,
}: {
  email: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    setLoading(true);
    const url = "/auth/resend-otp";
   await api.post(url, {email});
    toast.success("otp resent successfully   ");

  } catch (error: any) {
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error logging you in");
  } finally {
    setLoading(false);
  }
};
