// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import TelaInicial from "./pages/Home";
import ReciboForm from "./pages/ReciboForm";
import TelaLogin from "./pages/TelaLogin";

import { auth } from "./database/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

const App = () => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  if (carregando) return <p>Carregando...</p>;

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<TelaInicial />} />
          <Route
            path="/login/recibos"
            element={usuario ? <ReciboForm /> : <TelaLogin />}
          />
          <Route
            path="/login/ortese-protese"
            element={<div><h1>Página Órtese e Prótese</h1></div>} // substitua por seu componente real
          />
          <Route
            path="/login"
            element={usuario ? <Navigate to="/login/recibos" /> : <TelaLogin />}
          />
        </Routes>

        {usuario && (
          <div style={{ position: "fixed", top: 10, right: 10 }}>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "5px 10px",
                fontSize: "12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Sair Login
            </button>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;
