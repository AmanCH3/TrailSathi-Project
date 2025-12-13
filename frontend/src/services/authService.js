import React from "react";
import { registerUserApi, loginUserApi, getGoogleOAuthUrl, forgotPasswordApi, resetPasswordApi } from "../api/authApi";

export const registerUserService = async (formData) => {
  try {
    const response = await registerUserApi(formData);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Registration Failed" };
  }
};

export const loginUserService = async (formData) => {
  try {
    const response = await loginUserApi(formData);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Login Failed" };
  }
};

export const forgotPasswordService = async (email) => {
  try {
    const response = await forgotPasswordApi({ email });
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to send reset email" };
  }
};

export const resetPasswordService = async (data) => {
  try {
    const response = await resetPasswordApi(data);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to reset password" };
  }
};

export const initiateGoogleLogin = () => {
  window.location.href = getGoogleOAuthUrl();
};
