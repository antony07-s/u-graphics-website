"use client";

import { useEffect, useRef } from "react";

export default function GoogleSignInButton({ onSuccess, onError }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const handleCredential = async (response) => {
      try {
        const res = await fetch("/api/customer/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: response.credential }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Google sign-in failed.");
        onSuccess?.(data.customer);
      } catch (error) {
        onError?.(error.message || "Google sign-in failed.");
      }
    };

    const initializeButton = () => {
      if (!window.google || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredential,
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "continue_with",
      });
    };

    // Load Google's script once, then render the button when ready
    if (window.google) {
      initializeButton();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = initializeButton;
      document.body.appendChild(script);
    }
  }, [onSuccess, onError]);

  return <div ref={buttonRef} className="flex justify-center" />;
}
