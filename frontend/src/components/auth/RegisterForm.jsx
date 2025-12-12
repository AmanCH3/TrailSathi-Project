// src/components/auth/RegisterForm.jsx
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRegistrationUser } from "../../hooks/useRegisterUser";

export default function RegisterForm() {
  const { mutate, data, error, isPending, isSuccess, isError } =
    useRegistrationUser();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    name: Yup.string().required("Full name is required"),
    phone: Yup.string().required("Phone number is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const { name, email, password, phone } = values;
      mutate({ name, email, password, phone });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 font-poppins">
      {/* Name */}
      <div className="space-y-1">
        <label className="mb-1 block text-[14px] font-semibold text-black">
          Name
        </label>
        <input
          id="name"
          type="text"
          className="w-full border-b border-black/60 bg-transparent pb-2 text-sm text-white placeholder:text-white/55 focus:border-white focus:outline-none"
          placeholder="Enter your name"
          {...formik.getFieldProps("name")}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="mt-1 text-xs text-red-300">{formik.errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="mb-1 block text-[14px] font-semibold text-black">
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
        <label className="mb-1 block text-[14px] font-semibold text-black">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="w-full border-b border-black/60 bg-transparent pb-2 text-sm text-white placeholder:text-white/55 focus:border-white focus:outline-none"
          placeholder="************"
          {...formik.getFieldProps("password")}
        />
        {formik.touched.password && formik.errors.password && (
          <p className="mt-1 text-xs text-red-300">{formik.errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <label className="mb-1 block text-[14px] font-semibold text-black">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          className="w-full border-b border-black/60 bg-transparent pb-2 text-sm text-white placeholder:text-white/55 focus:border-white focus:outline-none"
          placeholder="************"
          {...formik.getFieldProps("confirmPassword")}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-300">{formik.errors.confirmPassword}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <label className="mb-1 block text-[14px] font-semibold text-black">
          Contact No
        </label>
        <input
          id="phone"
          type="tel"
          className="w-full border-b border-black/60 bg-transparent pb-2 text-sm text-white placeholder:text-white/55 focus:border-white focus:outline-none"
          placeholder="+977-9800000000"
          {...formik.getFieldProps("phone")}
        />
        {formik.touched.phone && formik.errors.phone && (
          <p className="mt-1 text-xs text-red-300">{formik.errors.phone}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="mt-2 w-full rounded-md bg-[#e45a4f] py-2.5 text-sm font-semibold tracking-wide text-white shadow-md transition hover:bg-[#d94a3e] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isPending || !formik.isValid || !formik.dirty}
      >
        {isPending ? "Creating Account..." : "Register"}
      </button>

      {isError && (
        <p className="mt-2 text-center text-sm text-red-300">
          {error?.response?.data?.message || "Registration failed."}
        </p>
      )}
      {isSuccess && (
        <p className="mt-2 text-center text-sm text-green-300">
          Account created successfully!
        </p>
      )}
    </form>
  );
}
