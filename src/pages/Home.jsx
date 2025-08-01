import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, Stethoscope, ArrowRight } from 'lucide-react';
import '../assets/styles/Home.css'; 
import logo from '../assets/images/logo-cis-1.png';

const Card = ({ children, className }) => <div className={`border rounded-lg shadow-sm bg-white text-gray-800 ${className}`}>{children}</div>;
const CardHeader = ({ children }) => <div className="p-6 flex flex-col space-y-1.5">{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardDescription = ({ children, className }) => <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
const CardContent = ({ children }) => <div className="p-6 pt-0">{children}</div>;

export default function Home() {
  const navigate = useNavigate();

  return (
  <main className="home-main">
      <div className="home-container">
        <div className="home-header">
          <img
            src={logo}
            alt="Logo CIS Ivaiporã"
            className="home-logo"
          />
          <h1 className="home-title">Bem-vindo ao Portal CIS-IVAIPORÃ</h1>
          <p className="home-subtitle">
            Selecione uma das opções abaixo para continuar.
          </p>
        </div>

        <div className="home-grid">
          {/* Card Recibos */}
          <div
            onClick={() => navigate('/login')}
            className="home-card"
          >
            <div className="card-header">
              <div className="card-icon-container">
                <div className="icon-indigo">
                  <Receipt className="h-8 w-8" />
                </div>
                <h3 className="card-title-indigo">Recibos</h3>
              </div>
            </div>
            <p className="card-description">
              Acesse a área de gerenciamento de recibos, onde você pode consultar e emitir documentos fiscais.
            </p>
            <div className="card-footer card-footer-indigo">
              Acessar Seção <ArrowRight className="card-arrow-icon" />
            </div>
          </div>

          {/* Card Órtese e Prótese */}
          <div
            onClick={() => navigate('/login')}
            className="home-card"
          >
            <div className="card-header">
              <div className="card-icon-container">
                <div className="icon-green">
                  <Stethoscope className="h-8 w-8" />
                </div>
                <h3 className="card-title-green">Órtese e Prótese</h3>
              </div>
            </div>
            <p className="card-description">
              Entre na seção para gerenciar solicitações e acompanhamentos de órteses e próteses.
            </p>
            <div className="card-footer card-footer-green">
              Acessar Seção <ArrowRight className="card-arrow-icon" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
