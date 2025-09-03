// app/login/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Vote,
  ArrowLeft,
  Loader,
  AlertCircle,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log;
    if (storedToken) {
      router.replace("/dashboard"); // Redirect logged-in users to the dashboard
    }
  }, [router]);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      setLoading(false);
      toast.success("Login successful");
      console.log(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      if (data.role === "STUDENT") {
        router.push("/dashboard");
      } else if (data.role === "admin") {
        router.push("/admin");
      } else if (data.role === "observers") {
        router.push("/observers");
      } else if (data.role === "SUPER_ADMIN") {
        router.push("/superAdmin");
      }
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.message || "Invalid credentials";
      console.error("Login Error:", errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <Vote className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Sign in to access your secure e-voting dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 text-green-600 mr-2" />
                Account Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-green-500 focus:bg-green-50"
                    }`}
                    placeholder="Enter your email address"
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                        errors.password
                          ? "border-red-300 focus:border-red-500 bg-red-50"
                          : "border-gray-200 focus:border-green-500 focus:bg-green-50"
                      }`}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Sign In
                  </>
                )}
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                Dont have an account?{" "}
                <Link
                  href="/register"
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-start">
            <Lock className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
            <div>
              <h4 className="text-lg font-semibold text-green-900 mb-2">
                Secure Login
              </h4>
              <p className="text-green-700 text-sm leading-relaxed">
                Your login credentials are protected with industry-standard
                encryption. We ensure the highest level of security for your
                voting account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
