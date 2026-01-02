import React, { useState } from "react";
import { forgotPasswordService, resetPasswordService } from "../../services/authService";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiEye, FiEyeOff } from "react-icons/fi";

export function ForgotPasswordForm() {
  const [step, setStep] = useState(1); // 1: Email, 2: Reset (OTP + Password)
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1: Send OTP
  const handleSendOtp = async (values) => {
    setLoading(true);
    try {
      const response = await forgotPasswordService(values.email);
      setLoading(false);
      setEmail(values.email);
      setStep(2);
      toast.success(response.message || "OTP sent to your email!");
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "Failed to send OTP.");
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      const payload = {
        email: email, // use stored email from step 1
        otp: values.otp,
        password: values.password,
        confirmPassword: values.confirmPassword,
      };
      
      const response = await resetPasswordService(payload);
      setLoading(false);
      toast.success(response.message || "Password reset successfully!");
      navigate("/login");
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "Failed to reset password.");
    }
  };

  // Formik for Step 1
  const formikStep1 = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: handleSendOtp,
  });

  // Formik for Step 2
  const formikStep2 = useFormik({
    initialValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      otp: Yup.string().required("OTP is required").length(6, "OTP must be 6 digits"),
      password: Yup.string().min(8, "Min 8 chars").required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: handleResetPassword,
  });

  return (
    <div className="w-full font-poppins text-left">
      {step === 1 && (
        <form onSubmit={formikStep1.handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="mb-1 block text-[14px] font-semibold text-black">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full border-b border-gray-300 bg-transparent pb-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none"
              {...formikStep1.getFieldProps("email")}
            />
            {formikStep1.touched.email && formikStep1.errors.email && (
              <p className="mt-1 text-xs text-red-300">{formikStep1.errors.email}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-md bg-[#e45a4f] py-2.5 text-sm font-semibold tracking-wide text-white shadow-md transition hover:bg-[#d94a3e] disabled:cursor-not-allowed disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Send Reset Link"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={formikStep2.handleSubmit} className="space-y-6">
          {/* OTP */}
          <div className="space-y-1">
            <label className="mb-1 block text-[14px] font-semibold text-black">OTP</label>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              className="w-full border-b border-gray-300 bg-transparent pb-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none"
              {...formikStep2.getFieldProps("otp")}
            />
            {formikStep2.touched.otp && formikStep2.errors.otp && (
              <p className="mt-1 text-xs text-red-300">{formikStep2.errors.otp}</p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <label className="mb-1 block text-[14px] font-semibold text-black">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full border-b border-gray-300 bg-transparent pb-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none"
                {...formikStep2.getFieldProps("password")}
              />
              <button
                type="button"
                className="absolute right-0 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {formikStep2.touched.password && formikStep2.errors.password && (
              <p className="mt-1 text-xs text-red-300">{formikStep2.errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="mb-1 block text-[14px] font-semibold text-black">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="********"
                className="w-full border-b border-gray-300 bg-transparent pb-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none"
                {...formikStep2.getFieldProps("confirmPassword")}
              />
              <button
                type="button"
                className="absolute right-0 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-black"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {formikStep2.touched.confirmPassword && formikStep2.errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-300">{formikStep2.errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-md bg-[#e45a4f] py-2.5 text-sm font-semibold tracking-wide text-white shadow-md transition hover:bg-[#d94a3e] disabled:cursor-not-allowed disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Reset Password"}
          </button>
          
          <div className="text-center text-xs mt-4">
             <button type="button" onClick={() => setStep(1)} className="text-gray-500 hover:text-red-500 hover:underline font-medium">Resend OTP / Change Email</button>
          </div>
        </form>
      )}
    </div>
  );
}
