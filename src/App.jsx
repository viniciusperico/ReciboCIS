// src/App.jsx
import React, { useEffect, useState } from "react";
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
    <div>
      {usuario ? (
        <>
          <button onClick={handleLogout} style={{  backgroundColor: "#007bff", color: "white",border: "none",padding: "5px 10px",fontSize: "10px",borderRadius: "4px",cursor: "pointer",}}>
            Sair Login
          </button>
          <ReciboForm />
        </>
      ) : (
        <TelaLogin />
      )}
    </div>
  );
};

export default App;
