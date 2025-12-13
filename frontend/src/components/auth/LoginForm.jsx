// src/components/auth/LoginForm.jsx
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import useLoginUser from "../../hooks/useLoginUser";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const { mutate, isPending, error, isSuccess, data } = useLoginUser();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isSuccess && data?.token) {
        if (data?.user?.role === "admin") {
            navigate("/admin/dashboard");
        } else {
            navigate("/");
        }
    }
  }, [isSuccess, data, navigate]);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email required"),
    password: Yup.string()
      .min(8, "Min 8 characters required")
      .required("Password required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      mutate(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 font-poppins">
      {/* Email */}
      <div className="space-y-1">
        <label className="mb-1 block text-[14px] font-semibold text-[12px]  text-black ">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full border-b border-black/60 bg-transparent pb-2 text-sm text-white placeholder:text-white/55 focus:border-white focus:outline-none"
          placeholder="name@example.com"
          {...formik.getFieldProps("email")}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="mt-1 text-xs text-red-300">{formik.errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="mb-1 block text-[14px] font-semibold   text-black">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="*************"
            className="w-full border-b border-black/60 bg-transparent pb-2 pr-10 text-sm text-white placeholder:text-white/55 focus:border-white focus:outline-none"
            {...formik.getFieldProps("password")}
          />
          <button
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 transform text-white/60 hover:text-white"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        {formik.touched.password && formik.errors.password && (
          <p className="mt-1 text-xs text-red-300 ">{formik.errors.password}</p>
        )}
      </div>

      {/* Forgot password */}
      <div className="flex justify-end">
        <a
          href="/forgotpassword"
          className="text-[11px] font-medium text-white/85 hover:text-white"
        >
          Forgot Password ?
        </a>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full rounded-md bg-[#e45a4f] py-2.5 text-sm font-semibold tracking-wide text-white shadow-md transition hover:bg-[#d94a3e] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Logging in..." : "Login"}
      </button>

      {error && (
        <p className="mt-2 text-center text-sm text-red-300">
          {error.response?.data?.message ||
            "Login failed. Please check your credentials."}
        </p>
      )}
    </form>
  );
}
