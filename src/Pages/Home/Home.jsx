import React, { useState } from "react";
import "./Home.css";

const ReciboForm = () => {

  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [selectedProduct, setSelectedProduct] = useState(""); 
  const [name, setName] = useState(""); 
  const [cargo, setCargo] = useState(""); 
  const [mesRef, setMesRef] = useState(""); 
  const [data, setData] = useState(""); 
  const [valor, setValor] = useState(""); 
  const [detalhes, setDetalhes] = useState(""); 

  const productsByCategory = {
    Arapuã: [
      "Crédito antecipado de serviços de consultas e exames especializados, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 38607-3",
      "Repasse Mensal - conforme Contrato de Rateio/2024, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 23005-7",
      "Locação de imóvel destinado ao atendimento das finalidades da adequação e desenvolvimento do programa QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 24569-0",
      "Crédito antecipado de serviços de transporte de pacientes, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34759-0",
      "Pagamento de hospedagem em Casa de Apoio, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34865-1",
      "Parcelas da contrapartida do Convênio QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 27991-9",
      "Pagamento de complemento de itens de Órtese e Próteses, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 32409-4",
      "Pagamento de Contrato de Programa, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35896-7",
      "Pagamento de complemento de óculos, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento de complemento de bolsas de colostomia, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento referente ao Contrato de Rateio - 001/2024 de custeio do CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45344-7",
      "Pagamento referente aos atendimentos realizados pelo CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45441-9",
    ],
    Ariranha_do_Ivaí: [
      "Crédito antecipado de serviços de consultas e exames especializados, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 38607-3",
      "Repasse Mensal - conforme Contrato de Rateio/2024, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 23005-7",
      "Locação de imóvel destinado ao atendimento das finalidades da adequação e desenvolvimento do programa QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 24569-0",
      "Crédito antecipado de serviços de transporte de pacientes, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34759-0",
      "Pagamento de hospedagem em Casa de Apoio, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34865-1",
      "Parcelas da contrapartida do Convênio QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 27991-9",
      "Pagamento de complemento de itens de Órtese e Próteses, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 32409-4",
      "Pagamento de Contrato de Programa, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35896-7",
      "Pagamento de complemento de óculos, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento de complemento de bolsas de colostomia, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento referente ao Contrato de Rateio - 001/2024 de custeio do CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45344-7",
      "Pagamento referente aos atendimentos realizados pelo CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45441-9",
    ],
    Cândido_de_Abreu: [
      "Crédito antecipado de serviços de consultas e exames especializados, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 38607-3",
      "Repasse Mensal - conforme Contrato de Rateio/2024, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 23005-7",
      "Locação de imóvel destinado ao atendimento das finalidades da adequação e desenvolvimento do programa QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 24569-0",
      "Crédito antecipado de serviços de transporte de pacientes, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34759-0",
      "Pagamento de hospedagem em Casa de Apoio, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34865-1",
      "Parcelas da contrapartida do Convênio QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 27991-9",
      "Pagamento de complemento de itens de Órtese e Próteses, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 32409-4",
      "Pagamento de Contrato de Programa, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35896-7",
      "Pagamento de complemento de óculos, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento de complemento de bolsas de colostomia, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento referente ao Contrato de Rateio - 001/2024 de custeio do CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45344-7",
      "Pagamento referente aos atendimentos realizados pelo CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45441-9",
    ],
    Cruzmaltina: [
      "Crédito antecipado de serviços de consultas e exames especializados, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 38607-3",
      "Repasse Mensal - conforme Contrato de Rateio/2024, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 23005-7",
      "Locação de imóvel destinado ao atendimento das finalidades da adequação e desenvolvimento do programa QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 24569-0",
      "Crédito antecipado de serviços de transporte de pacientes, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34759-0",
      "Pagamento de hospedagem em Casa de Apoio, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34865-1",
      "Parcelas da contrapartida do Convênio QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 27991-9",
      "Pagamento de complemento de itens de Órtese e Próteses, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 32409-4",
      "Pagamento de Contrato de Programa, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35896-7",
      "Pagamento de complemento de óculos, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento de complemento de bolsas de colostomia, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento referente ao Contrato de Rateio - 001/2024 de custeio do CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45344-7",
      "Pagamento referente aos atendimentos realizados pelo CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45441-9",
    ],
    Godoy_Moreira: [
      "Crédito antecipado de serviços de consultas e exames especializados, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 38607-3",
      "Repasse Mensal - conforme Contrato de Rateio/2024, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 23005-7",
      "Locação de imóvel destinado ao atendimento das finalidades da adequação e desenvolvimento do programa QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 24569-0",
      "Crédito antecipado de serviços de transporte de pacientes, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34759-0",
      "Pagamento de hospedagem em Casa de Apoio, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34865-1",
      "Parcelas da contrapartida do Convênio QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 27991-9",
      "Pagamento de complemento de itens de Órtese e Próteses, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 32409-4",
      "Pagamento de Contrato de Programa, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35896-7",
      "Pagamento de complemento de óculos, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento de complemento de bolsas de colostomia, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento referente ao Contrato de Rateio - 001/2024 de custeio do CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45344-7",
      "Pagamento referente aos atendimentos realizados pelo CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45441-9",
    ],
    Ivaiporã: [
      "Crédito antecipado de serviços de consultas e exames especializados, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 38607-3",
      "Repasse Mensal - conforme Contrato de Rateio/2024, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 23005-7",
      "Locação de imóvel destinado ao atendimento das finalidades da adequação e desenvolvimento do programa QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 24569-0",
      "Crédito antecipado de serviços de transporte de pacientes, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34759-0",
      "Pagamento de hospedagem em Casa de Apoio, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34865-1",
      "Parcelas da contrapartida do Convênio QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 27991-9",
      "Pagamento de complemento de itens de Órtese e Próteses, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 32409-4",
      "Pagamento de Contrato de Programa, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35896-7",
      "Pagamento de complemento de óculos, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento de complemento de bolsas de colostomia, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento referente ao Contrato de Rateio - 001/2024 de custeio do CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45344-7",
      "Pagamento referente aos atendimentos realizados pelo CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45441-9",
    ],
    Jardim_Alegre: [
      "Crédito antecipado de serviços de consultas e exames especializados, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 38607-3",
      "Repasse Mensal - conforme Contrato de Rateio/2024, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 23005-7",
      "Locação de imóvel destinado ao atendimento das finalidades da adequação e desenvolvimento do programa QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 24569-0",
      "Crédito antecipado de serviços de transporte de pacientes, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34759-0",
      "Pagamento de hospedagem em Casa de Apoio, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34865-1",
      "Parcelas da contrapartida do Convênio QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 27991-9",
      "Pagamento de complemento de itens de Órtese e Próteses, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 32409-4",
      "Pagamento de Contrato de Programa, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35896-7",
      "Pagamento de complemento de óculos, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento de complemento de bolsas de colostomia, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento referente ao Contrato de Rateio - 001/2024 de custeio do CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45344-7",
      "Pagamento referente aos atendimentos realizados pelo CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45441-9",
    ],
    Lidianópolis: [
      "Crédito antecipado de serviços de consultas e exames especializados, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 38607-3",
      "Repasse Mensal - conforme Contrato de Rateio/2024, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 23005-7",
      "Locação de imóvel destinado ao atendimento das finalidades da adequação e desenvolvimento do programa QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 24569-0",
      "Crédito antecipado de serviços de transporte de pacientes, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34759-0",
      "Pagamento de hospedagem em Casa de Apoio, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34865-1",
      "Parcelas da contrapartida do Convênio QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 27991-9",
      "Pagamento de complemento de itens de Órtese e Próteses, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 32409-4",
      "Pagamento de Contrato de Programa, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35896-7",
      "Pagamento de complemento de óculos, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento de complemento de bolsas de colostomia, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento referente ao Contrato de Rateio - 001/2024 de custeio do CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45344-7",
      "Pagamento referente aos atendimentos realizados pelo CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45441-9",
    ],
    Lunardelli: [
      "Crédito antecipado de serviços de consultas e exames especializados, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 38607-3",
      "Repasse Mensal - conforme Contrato de Rateio/2024, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 23005-7",
      "Locação de imóvel destinado ao atendimento das finalidades da adequação e desenvolvimento do programa QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 24569-0",
      "Crédito antecipado de serviços de transporte de pacientes, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34759-0",
      "Pagamento de hospedagem em Casa de Apoio, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34865-1",
      "Parcelas da contrapartida do Convênio QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 27991-9",
      "Pagamento de complemento de itens de Órtese e Próteses, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 32409-4",
      "Pagamento de Contrato de Programa, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35896-7",
      "Pagamento de complemento de óculos, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento de complemento de bolsas de colostomia, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento referente ao Contrato de Rateio - 001/2024 de custeio do CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45344-7",
      "Pagamento referente aos atendimentos realizados pelo CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45441-9",
    ],
    Manoel_Ribas: [
      "Crédito antecipado de serviços de consultas e exames especializados, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 38607-3",
      "Repasse Mensal - conforme Contrato de Rateio/2024, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 23005-7",
      "Locação de imóvel destinado ao atendimento das finalidades da adequação e desenvolvimento do programa QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 24569-0",
      "Crédito antecipado de serviços de transporte de pacientes, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34759-0",
      "Pagamento de hospedagem em Casa de Apoio, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34865-1",
      "Parcelas da contrapartida do Convênio QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 27991-9",
      "Pagamento de complemento de itens de Órtese e Próteses, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 32409-4",
      "Pagamento de Contrato de Programa, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35896-7",
      "Pagamento de complemento de óculos, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento de complemento de bolsas de colostomia, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento referente ao Contrato de Rateio - 001/2024 de custeio do CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45344-7",
      "Pagamento referente aos atendimentos realizados pelo CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45441-9",
    ],
    Mato_Rico: [
      "Crédito antecipado de serviços de consultas e exames especializados, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 38607-3",
      "Repasse Mensal - conforme Contrato de Rateio/2024, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 23005-7",
      "Locação de imóvel destinado ao atendimento das finalidades da adequação e desenvolvimento do programa QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 24569-0",
      "Crédito antecipado de serviços de transporte de pacientes, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34759-0",
      "Pagamento de hospedagem em Casa de Apoio, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34865-1",
      "Parcelas da contrapartida do Convênio QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 27991-9",
      "Pagamento de complemento de itens de Órtese e Próteses, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 32409-4",
      "Pagamento de Contrato de Programa, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35896-7",
      "Pagamento de complemento de óculos, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento de complemento de bolsas de colostomia, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento referente ao Contrato de Rateio - 001/2024 de custeio do CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45344-7",
      "Pagamento referente aos atendimentos realizados pelo CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45441-9",
    ],
    Nova_Tebas: [
      "Crédito antecipado de serviços de consultas e exames especializados, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 38607-3",
      "Repasse Mensal - conforme Contrato de Rateio/2024, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 23005-7",
      "Locação de imóvel destinado ao atendimento das finalidades da adequação e desenvolvimento do programa QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 24569-0",
      "Crédito antecipado de serviços de transporte de pacientes, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34759-0",
      "Pagamento de hospedagem em Casa de Apoio, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34865-1",
      "Parcelas da contrapartida do Convênio QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 27991-9",
      "Pagamento de complemento de itens de Órtese e Próteses, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 32409-4",
      "Pagamento de Contrato de Programa, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35896-7",
      "Pagamento de complemento de óculos, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento de complemento de bolsas de colostomia, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento referente ao Contrato de Rateio - 001/2024 de custeio do CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45344-7",
      "Pagamento referente aos atendimentos realizados pelo CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45441-9",
    ],
    Rio_Branco_do_Ivaí: [
      "Crédito antecipado de serviços de consultas e exames especializados, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 38607-3",
      "Repasse Mensal - conforme Contrato de Rateio/2024, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 23005-7",
      "Locação de imóvel destinado ao atendimento das finalidades da adequação e desenvolvimento do programa QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 24569-0",
      "Crédito antecipado de serviços de transporte de pacientes, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34759-0",
      "Pagamento de hospedagem em Casa de Apoio, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34865-1",
      "Parcelas da contrapartida do Convênio QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 27991-9",
      "Pagamento de complemento de itens de Órtese e Próteses, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 32409-4",
      "Pagamento de Contrato de Programa, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35896-7",
      "Pagamento de complemento de óculos, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento de complemento de bolsas de colostomia, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento referente ao Contrato de Rateio - 001/2024 de custeio do CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45344-7",
      "Pagamento referente aos atendimentos realizados pelo CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45441-9",
    ],
    Rosário_do_Ivaí: [
      "Crédito antecipado de serviços de consultas e exames especializados, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 38607-3",
      "Repasse Mensal - conforme Contrato de Rateio/2024, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 23005-7",
      "Locação de imóvel destinado ao atendimento das finalidades da adequação e desenvolvimento do programa QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 24569-0",
      "Crédito antecipado de serviços de transporte de pacientes, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34759-0",
      "Pagamento de hospedagem em Casa de Apoio, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34865-1",
      "Parcelas da contrapartida do Convênio QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 27991-9",
      "Pagamento de complemento de itens de Órtese e Próteses, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 32409-4",
      "Pagamento de Contrato de Programa, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35896-7",
      "Pagamento de complemento de óculos, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento de complemento de bolsas de colostomia, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento referente ao Contrato de Rateio - 001/2024 de custeio do CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45344-7",
      "Pagamento referente aos atendimentos realizados pelo CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45441-9",
    ],
    Santa_Maria_do_Oeste: [
      "Crédito antecipado de serviços de consultas e exames especializados, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 38607-3",
      "Repasse Mensal - conforme Contrato de Rateio/2024, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 23005-7",
      "Locação de imóvel destinado ao atendimento das finalidades da adequação e desenvolvimento do programa QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 24569-0",
      "Crédito antecipado de serviços de transporte de pacientes, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34759-0",
      "Pagamento de hospedagem em Casa de Apoio, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34865-1",
      "Parcelas da contrapartida do Convênio QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 27991-9",
      "Pagamento de complemento de itens de Órtese e Próteses, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 32409-4",
      "Pagamento de Contrato de Programa, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35896-7",
      "Pagamento de complemento de óculos, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento de complemento de bolsas de colostomia, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento referente ao Contrato de Rateio - 001/2024 de custeio do CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45344-7",
      "Pagamento referente aos atendimentos realizados pelo CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45441-9",
    ],
    São_João_do_Ivaí: [
      "Crédito antecipado de serviços de consultas e exames especializados, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 38607-3",
      "Repasse Mensal - conforme Contrato de Rateio/2024, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 23005-7",
      "Locação de imóvel destinado ao atendimento das finalidades da adequação e desenvolvimento do programa QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 24569-0",
      "Crédito antecipado de serviços de transporte de pacientes, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34759-0",
      "Pagamento de hospedagem em Casa de Apoio, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 34865-1",
      "Parcelas da contrapartida do Convênio QualiCIS, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 27991-9",
      "Pagamento de complemento de itens de Órtese e Próteses, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 32409-4",
      "Pagamento de Contrato de Programa, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35896-7",
      "Pagamento de complemento de óculos, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento de complemento de bolsas de colostomia, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente: 35898-3",
      "Pagamento referente ao Contrato de Rateio - 001/2024 de custeio do CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45344-7",
      "Pagamento referente aos atendimentos realizados pelo CAPS II Regional, sendo o depósito no Banco do Brasil, agência: 0633-5, conta corrente 45441-9",
    ],
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value); 
    setSelectedProduct(""); 
  };

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value); 
  };

const handleValueChange = (e) => {
    let inputValue = e.target.value;

    inputValue = inputValue.replace(/\D/g, "");

    const formattedValue = (inputValue / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    setValor(formattedValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      name,
      cargo,
      selectedCategory,
      selectedProduct,
      mesRef,
      data,
      valor,
      detalhes,
    });
  };

  return (
    <div className="home">
    <div className="container-home">
      <h2 className="titulo-home">RECIBO ONLINE CIS</h2>
      <form className="form-recibo" onSubmit={handleSubmit}>
        <label htmlFor="name">Nome:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="cargo">Cargo exercido:</label>
        <input
          id="cargo"
          type="text"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
          required
        />

        <label htmlFor="category">Municipio:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          required
        >
          <option value="">Selecione um Municipio</option>
          <option value="Arapuã">Arapuã</option>
          <option value="Ariranha_do_Ivaí">Ariranha do Ivaí</option>
          <option value="Cândido_de_Abreu">Cândido de Abreu</option>
          <option value="Cruzmaltina">Cruzmaltina</option>
          <option value="Godoy_Moreira">Godoy Moreira</option>
          <option value="Ivaiporã">Ivaiporã</option>
          <option value="Jardim_Alegre">Jardim Alegre</option>
          <option value="Lidianópolis">Lidianópolis</option>
          <option value="Lunardelli">Lunardelli</option>
          <option value="Manoel_Ribas">Manoel Ribas</option>
          <option value="Mato_Rico">Mato Rico</option>
          <option value="Nova_Tebas">Nova Tebas</option>
          <option value="Rio_Branco_do_Ivaí">Rio Branco do Ivaí</option>
          <option value="Rosário_do_Ivaí">Rosário do Ivaí</option>
          <option value="Santa_Maria_do_Oeste">Santa Maria do Oeste</option>
          <option value="São_João_do_Ivaí">São João do Ivaí</option>
        </select>

        <label htmlFor="product">Tipo do Recibo:</label>
        <select 
          id="product"
          value={selectedProduct}
          onChange={handleProductChange}
          disabled={!selectedCategory}
          required
        >
          <option value="">Selecione um Tipo</option>
          {selectedCategory &&
            productsByCategory[selectedCategory].map((product, index) => (
              <option key={index} value={product}>
                {product}
              </option>
            ))}
        </select>

        <label htmlFor="mes-ref">Mês de referência:</label>
        <select
          id="mes-ref"
          value={mesRef}
          onChange={(e) => setMesRef(e.target.value)}
          required
        >
          <option value="">Selecione um mês</option>
          <option value="janeiro">Janeiro</option>
          <option value="fevereiro">Fevereiro</option>
          <option value="marco">Março</option>
          <option value="abril">Abril</option>
          <option value="maio">Maio</option>
          <option value="junho">Junho</option>
          <option value="julho">Julho</option>
          <option value="agosto">Agosto</option>
          <option value="setembro">Setembro</option>
          <option value="outubro">Outubro</option>
          <option value="novembro">Novembro</option>
          <option value="dezembro">Dezembro</option>
        </select>

        <label htmlFor="data">Data do recibo:</label>
        <input
          id="data"
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />

        <label htmlFor="valor">Valor (R$):</label>
        <input
          id="valor"
          type="text"
          value={valor}
          onChange={handleValueChange}
          required
        />

        <label htmlFor="detalhes">Detalhamento: (opcional)</label>
        <input
          id="detalhes"
          type="text"
          value={detalhes}
          onChange={(e) => setDetalhes(e.target.value)}
        />

        <button type="submit">Enviar</button>
      </form>
    </div>
    </div>
  );
};

export default ReciboForm;
