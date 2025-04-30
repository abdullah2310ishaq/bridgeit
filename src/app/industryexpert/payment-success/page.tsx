"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session_id");
  const projectId = searchParams.get("project_id");
  const title = searchParams.get("title");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
  
    if (!token) {
      router.push("/auth/login-user");
      return;
    }
  
    if (!sessionId || !projectId) {
      toast.error("Missing payment details from Stripe.");
      setLoading(false);
      return;
    }
  
    const verifyPayment = async () => {
      try {
        // Verify auth
        const authRes = await fetch("https://localhost:7053/api/auth/authorized-user-info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!authRes.ok) throw new Error("Unauthorized");
  
        // Verify payment by checking payment details
        const paymentRes = await fetch(`https://localhost:7053/api/payment-details/get-payment-details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!paymentRes.ok) throw new Error("Failed to fetch payment details");
  
        const paymentDetails = await paymentRes.json();
        const payment = paymentDetails.find((p: any) => p.projectId === projectId && p.transactionId.includes(sessionId));
        if (!payment) throw new Error("Payment not found");
  
        toast.success("Payment successful!");
      } catch (err: any) {
        console.error("Payment verification error:", err);
        toast.error(`Failed to verify payment: ${err.message || "Unknown error"}`);
        router.push("/auth/login-user");
      } finally {
        setLoading(false);
      }
    };
  
    verifyPayment();
  }, [sessionId, projectId, router]);
  const handleViewReceipt = () => {
    toast.info("Receipt download coming soon...");
  };

  if (loading) {
    return (
      <div className="text-white min-h-screen flex items-center justify-center">
        <p>Loading payment confirmation...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-green-400 mb-4">Payment Successful 🎉</h1>
        <p className="mb-2">
          Thank you! Your payment for <strong>{title}</strong> was processed successfully.
        </p>
        <p className="mb-6">
          Session ID: <code className="text-yellow-400">{sessionId}</code>
        </p>

        <button
          onClick={() => router.push(`/industryexpert/projects/milestone/${projectId}`)}
          className="py-2 px-6 bg-green-600 hover:bg-green-500 rounded text-white"
        >
          Back to Project
        </button>

        <button
          onClick={handleViewReceipt}
          className="mt-4 block mx-auto py-2 px-6 bg-blue-600 hover:bg-blue-500 rounded text-white"
        >
          Download Receipt (Coming Soon)
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PaymentSuccessPage;
