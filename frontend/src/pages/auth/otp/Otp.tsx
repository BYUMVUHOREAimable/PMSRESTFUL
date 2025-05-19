import { resendOtp, verifyOtp } from "@/services/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const useQuery = () => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};

const OtpVerification = () => {
  const [otpCode, setOtpCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const query = useQuery();
  const email = query.get("email");

  const handleVerify = async () => {
    if (otpCode.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    setVerifying(true);
    try {
      await verifyOtp({ otpCode, setLoading: setVerifying });
    } catch (err) {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email is required to resend OTP");
      return;
    }

    setResending(true);
    try {
      await resendOtp({ email, setLoading: setResending });
      toast.success(`OTP sent to ${email}`);
    } catch (err) {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Verify Your Email</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          We sent a 6-digit code to <span className="font-medium">{email}</span>
        </p>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
          className="w-full text-center tracking-widest text-lg p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={6}
          autoComplete="one-time-code"
          aria-label="OTP Code"
          disabled={verifying || resending}
        />

        <button
          onClick={handleVerify}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          disabled={verifying}
        >
          {verifying ? "Verifying..." : "Verify OTP"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Didn’t receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-blue-600 font-medium hover:underline disabled:opacity-50"
          >
            {resending ? "Resending..." : "Resend"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;
