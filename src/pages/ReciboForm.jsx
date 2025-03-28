import React, { useState } from "react";
import { ref, get, set, push } from "firebase/database";
import { db } from "../database/firebaseConfig"; 
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import logo from '../assets/images/logo-cis-1.png';
import extenso from "extenso"; 

const gerarNumeroRecibo = async () => {
  const reciboRef = ref(db, "contadorRecibos");
  const snapshot = await get(reciboRef);
  let numeroRecibo = snapshot.exists() ? snapshot.val() + 1 : 1;
 
  await set(reciboRef, numeroRecibo);
  return `${numeroRecibo}-2025`;
};

const salvarReciboNoFirebase = async (dados, numeroRecibo) => {
  const recibosRef = ref(db, "recibos");
  await push(recibosRef, {
    numeroRecibo,
    ...dados,
    dataHora: new Date().toISOString()
  });
};

const download = (data, filename, type) => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const gerarRecibo = async (dados, limparFormulario) => {
  const safeText = (text) => text ? text.toString() : "";

  const existingPdfBytes = await fetch('/PadraoRecibo.pdf').then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const numeroRecibo = await gerarNumeroRecibo();

  await salvarReciboNoFirebase(dados, numeroRecibo);

  // Ajuste das posições dos textos no recibo em pdf

  // Nº RECIBO
  page.drawText(`N° DO RECIBO: ${safeText(numeroRecibo)}`, { x: 80, y: 735, size: 12}); 
  
//VALOR DO RECIBO E VALOR EM EXTENSO

// TIPO DO RECIBO EM BAIXO (TENTAR VINCULAR DE ALGUMA FORMA)

// DESCRIÇÃO DO CONTEUDO DO RECIBO

const textoRecibo = `Declaramos que recebemos a importância de R$ ${safeText(dados.valor)} (${safeText(dados.valorExtenso)}), 
da Prefeitura Municipal de ${safeText(dados.selectedCategory)}, referente a ${safeText(dados.selectedProduct)}, 
referente ao mês de: ${safeText(dados.mesRef)} para o Consórcio Intermunicipal de Saúde da 22ª Regional de Saúde de Ivaiporã.`;

page.drawText(textoRecibo, { x: 80, y: 650, size: 12, font, maxWidth: 450, lineHeight: 16 });


// DETALHES

// RODAPÉ
  page.drawText(`Ivaiporã, ${formatarData(safeText(dados.data))}`, { x: 400, y: 250, size: 10, font }); 

  const pdfBytes = await pdfDoc.save();
  download(pdfBytes, `ReciboCIS_${dados.selectedCategory}_${dados.data}.pdf`, 'application/pdf');

  limparFormulario();
};

const formatarData = (dataISO) => {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
};

const ReciboForm = () => {

  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [selectedProduct, setSelectedProduct] = useState(""); 
  const [name, setName] = useState(""); 
  const [cargo, setCargo] = useState(""); 
  const [mesRef, setMesRef] = useState(""); 
  const [data, setData] = useState(""); 
  const [valor, setValor] = useState(""); 
  const [detalhes, setDetalhes] = useState(""); 
  const [valorExtenso, setValorExtenso] = useState(""); 

  const limparFormulario = () => {
    setName("");
    setCargo("");
    setSelectedCategory("");
    setSelectedProduct("");
    setMesRef("");
    setData("");
    setValor("");
  };
  
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
    let inputValue = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
  
    if (inputValue) {
      const reais = Math.floor(parseInt(inputValue) / 100);
      const centavos = parseInt(inputValue) % 100;
  
      // Formata o valor como moeda
      const formattedValue = (parseInt(inputValue) / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
  
      setValor(formattedValue); // Atualiza o valor
  
      // Gera o valor por extenso
      let valorPorExtenso = extenso(reais, { mode: "currency" });
  
      if (centavos > 0) {
        valorPorExtenso += ` e ${extenso(centavos)} centavos`;
      }
  
      setValorExtenso(valorPorExtenso); // Atualiza o valor por extenso
    } else {
      setValor(""); // Limpa o valor formatado
      setValorExtenso(""); // Limpa o valor por extenso
    }
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
      valor,            // Valor formatado
      valorExtenso,     // Valor por extenso
      detalhes,
    });
  };

  return (
    <>
    <div className="home">
    <div className="container-home">
      <img src={logo} alt="Logo CIS" className="logo-home" />
      <h2 className="titulo-home">RECIBO CIS</h2>
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

        <label htmlFor="detalhes">Detalhamento: <span className="opcional">(Opcional)</span></label>
        <input
          id="detalhes"
          type="text"
          value={detalhes}
          onChange={(e) => setDetalhes(e.target.value)}
        />

  <button
    type="button"
    onClick={() => gerarRecibo({ name, cargo, selectedCategory, selectedProduct, mesRef, data, valor }, limparFormulario)}>
    Gerar PDF
  </button>
      </form>
    </div>
    </div>
    
     <footer className="footer-home">
     <p>Desenvolvido por Vinicius Périco</p>
     <p>&copy; {new Date().getFullYear()} CIS Ivaiporã.</p>
   </footer>
    </>
  );
  
};

export default ReciboForm;
