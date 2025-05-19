/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api";
import { IMeta, IUser, RegisterInputs } from "@/types";
import { toast } from "react-hot-toast";

export const createUser = async ({
  setLoading,
  data,
}: {
  data: RegisterInputs;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    setLoading(true);
    const url = "/user/create";
    await api.post(url, { ...data });
    toast.success("User created successfully");
    setTimeout(() => {
      window.location.replace(
        `/auth/otp?email=${(data.email)}`
      );
    }, 1000);
  } catch (error: any) {
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error creating your account");
  } finally {
    setLoading(false);
  }
};

export const getUsers = async ({
  page,
  limit,
  setLoading,
  setUsers,
  setMeta,
  searchKey,
}: {
  page: number;
  limit: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
  setMeta: React.Dispatch<React.SetStateAction<IMeta>>;
  searchKey?: string;
}) => {
  try {
    let url = `user/all?page=${page}&limit=${limit}`;
    if (searchKey) url += `&searchKey=${encodeURIComponent(searchKey)}`;

    const response = await api.get(url);

    setUsers(response.data.data.users);
    setMeta(response.data.data.meta);
  } catch (error: any) {
    if (error.response?.data?.status === 401) {
      window.location.replace("/auth/login");
      return;
    }
    if (error?.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Error getting users");
    }
  } finally {
    setLoading(false);
  }
};
