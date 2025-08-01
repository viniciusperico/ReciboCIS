import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
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
        await createUserWithEmailAndPassword(auth, email, senha);
      } else {
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
  <div className="login-card">
    <h2 className="login-title">{modoCadastro ? "Criar Conta" : "Login"}</h2>

    <form onSubmit={handleSubmit} className="login-form">
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="senha">Senha</label>
      <input
        id="senha"
        type="password"
        placeholder="********"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />

      {erro && <p className="login-error">{erro}</p>}

      <button type="submit" className="login-button">
        {modoCadastro ? "Cadastrar" : "Entrar"}
      </button>
    </form>

    <p className="login-toggle">
      {modoCadastro ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
      <button type="button" onClick={() => setModoCadastro(!modoCadastro)} className="toggle-button">
        {modoCadastro ? "Fazer login" : "Criar conta"}
      </button>
    </p>

    <div className="back-link">
      <span className="arrow">←</span>
      <a href="/">Voltar para a seleção</a>
    </div>
  </div>
</div>
  )
};

export default TelaLogin;
