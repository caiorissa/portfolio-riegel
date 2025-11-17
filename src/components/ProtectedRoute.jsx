import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";
import { ADMIN_EMAIL } from "../lib/adminUser";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-neutral-400 tracking-[0.2em] uppercase">
          Carregando...
        </p>
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  return children;
}
