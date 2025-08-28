"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BASE_URL } from "../../config";
 // import the base URL

const loginSchema = z.object({
  identifier: z.string().min(3, "Email or Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: data.identifier,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("token", result.token);
        window.location.href = "/home";
      } else {
        alert(result.message || "Invalid email/username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Welcome Back
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          
          {/* Email or Username */}
          <div>
            <input
              type="text"
              placeholder="Email or Username"
              {...register("identifier")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
            />
            {errors.identifier && (
              <p className="text-red-600 text-sm mt-1">{errors.identifier.message}</p>
            )}
          </div>

          {/* Password with Icon Toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
            </button>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition"
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-5 text-center text-gray-700">
          Don't have an account?{" "}
          <a href="/signup" className="text-purple-600 font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
