import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../database/firebaseConfig";
import "../assets/styles/TelaLogin.css";

const TelaLogin = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [modoCadastro, setModoCadastro] = useState(false); // false = login
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      if (modoCadastro) {
        // Criar nova conta
        await createUserWithEmailAndPassword(auth, email, senha);
      } else {
        // Fazer login
        await signInWithEmailAndPassword(auth, email, senha);
      }
    } catch (error) {
  switch (error.code) {
    case "auth/invalid-email":
      setErro("Email inválido.");
      break;
    case "auth/user-not-found":
      setErro("Usuário não encontrado.");
      break;
    case "auth/wrong-password":
      setErro("Senha incorreta.");
      break;
    case "auth/email-already-in-use":
      setErro("Email já está em uso.");
      break;
    case "auth/invalid-credential":
      setErro("Credenciais inválidas. Verifique email e senha.");
      break;
    default:
      setErro("Erro: " + error.message);
  }
}

  };

  return (
    <div className="login-container">
      <h2>{modoCadastro ? "Criar Conta" : "RECIBO CIS"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <button type="submit" style={{ width: "100%", marginBottom: "10px" }}>
          {modoCadastro ? "Cadastrar" : "Entrar"}
        </button>
      </form>
      <p style={{ textAlign: "center" }}>
        {modoCadastro ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
        <button onClick={() => setModoCadastro(!modoCadastro)} style={{ color: "blue", background: "none", border: "none", cursor: "pointer" }}>
          {modoCadastro ? "Fazer login" : "Criar conta"}
        </button>
      </p>
    </div>
  );
};

export default TelaLogin;