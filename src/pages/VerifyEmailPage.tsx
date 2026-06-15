import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { verifyOtp, resendActivationOtp } from "../api/auth";
import OtpVerificationForm from "../components/auth/OtpVerificationForm";
import logoIcon from "../assets/icon-logo.png";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // email passed from LoginForm via navigate state
  const email: string = location.state?.email ?? "";

  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // If no email in state, redirect back to login
  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleVerify = async (code: string) => {
    setOtpError("");
    setLoading(true);
    try {
      await verifyOtp(email, code);
      toast.success("Email verified! You can now log in.");
      navigate("/login", { replace: true, state: { email } });
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Invalid or expired OTP.";
      setOtpError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    try {
      await resendActivationOtp(email);
      toast.success("A new verification code was sent to your email.");
      setCooldown(60);
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to resend code. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#f3f5f8] via-[#eef2f9] to-[#f4f2fc] dark:from-[#101214] dark:via-[#131518] dark:to-[#171520] flex flex-col items-center justify-center p-4 selection:bg-[#6b38d4]/10 selection:text-[#6b38d4] dark:selection:bg-[#6b38d4]/20 dark:selection:text-indigo-400">
      <div className="w-full max-w-[440px] flex flex-col items-center space-y-6 py-8">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2 select-none">
          <img
            src={logoIcon}
            alt="Academix"
            className="w-14 h-14 object-contain"
          />
          <h1 className="text-xl font-bold text-[#3b2fc9] dark:text-indigo-450 tracking-tight">
            Academix 
          </h1>
        </div>

        {/* Card */}
        <div className="w-full bg-white dark:bg-[#1f2226] border border-[#eceff3] dark:border-white/5 rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300">
          <OtpVerificationForm
            email={email}
            onSubmit={handleVerify}
            loading={loading}
            error={otpError}
            cooldown={cooldown}
            onResend={handleResend}
            onChangeEmail={handleChangeEmail}
          />
        </div>
      </div>
    </div>
  );
}
