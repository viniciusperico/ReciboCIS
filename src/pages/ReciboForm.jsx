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

function justifyText(text, x, y, maxWidth, lineHeight, font, page, fontSize) {
  text = text.replace(/\n/g, ' '); // Remove quebras de linha

  const words = text.split(' ');
  let line = '';
  let lines = [];
  const spaceWidth = font.widthOfTextAtSize(' ', fontSize);

  words.forEach(word => {
      let testLine = line ? line + ' ' + word : word;
      let testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth < maxWidth) {
          line = testLine;
      } else {
          lines.push(line);
          line = word;
      }
  });
  lines.push(line);

  lines.forEach((line, index) => {
      let lineWidth = font.widthOfTextAtSize(line, fontSize);
      let extraSpace = maxWidth - lineWidth;
      let wordsInLine = line.split(' ');
      let spacesToAdd = wordsInLine.length - 1;

      let justifiedText = '';

      if (spacesToAdd > 0 && index < lines.length - 1) {
          let spaceBetweenWords = spaceWidth + extraSpace / spacesToAdd;
          justifiedText = wordsInLine.join(' '.repeat(Math.round(spaceBetweenWords / spaceWidth)));
      } else {
          justifiedText = line;
      }

      page.drawText(justifiedText, { x, y, size: fontSize, font });
      y -= lineHeight;
  });
}

const textoRecibo = `Declaramos que recebemos a importância de R$ ${safeText(dados.valor)} (${safeText(dados.valorExtenso)}), 
da Prefeitura Municipal de ${safeText(dados.selectedCategory)}, referente a ${safeText(dados.selectedProduct)}, 
referente ao mês de: ${safeText(dados.mesRef)} para o Consórcio Intermunicipal de Saúde da 22ª Regional de Saúde de Ivaiporã.`;

justifyText(textoRecibo, 80, 650, 450, 16, font, page, 11);

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
  
      setValorExtenso(valorPorExtenso); 
    } else {
      setValor(""); 
      setValorExtenso(""); 
    }
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
      valorExtenso,     
      detalhes,
    });
  };

  const limparFormulario = () => {
    setName("");
    setCargo("");
    setSelectedCategory("");
    setSelectedProduct("");
    setMesRef("");
    setData("");
    setValor("");
    setValorExtenso("");
  };

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

function drawCenteredText(page, text, font, fontSize, pageWidth, yPosition, maxWidth) {
  // Remove quebras de linha manuais
  text = text.replace(/\n/g, ' ');

  // Divide o texto em linhas respeitando o limite de largura
  const words = text.split(' ');
  let lines = [];
  let currentLine = '';

  for (const word of words) {
    let testLine = currentLine ? `${currentLine} ${word}` : word;
    let textWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (textWidth < maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  // Desenha cada linha centralizada
  let y = yPosition;
  lines.forEach(line => {
    let textWidth = font.widthOfTextAtSize(line, fontSize);
    let x = (pageWidth - textWidth) / 2; // Centraliza o texto

    page.drawText(line, { x, y, size: fontSize, font });
    y -= fontSize + 4; // Ajusta para a próxima linha
  });
}

// Chamar a função para centralizar o número do recibo
drawCenteredText(page, `VALOR DO RECIBO: ${(dados.valor)} (${(dados.valorExtenso)})`, font, 15, 595, 690, 500);





// TIPO DO RECIBO EM BAIXO (TENTAR VINCULAR DE ALGUMA FORMA)





// DESCRIÇÃO DO CONTEUDO DO RECIBO
function wordWrap(text, font, fontSize, maxWidth, indentSize = 40) {
  text = text.replace(/\n/g, ' '); // Remove quebras de linha manuais
  const words = text.split(' ');
  let lines = [];
  let currentLine = '';
  let isFirstLine = true;

  for (const word of words) {
    let testLine = currentLine ? `${currentLine} ${word}` : word;
    let textWidth = font.widthOfTextAtSize(testLine, fontSize) + (isFirstLine ? indentSize : 0);

    if (textWidth < maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }

      // Se a palavra for maior que maxWidth, quebramos corretamente
      while (font.widthOfTextAtSize(word, fontSize) > maxWidth) {
        let splitIndex = Math.floor((maxWidth / font.widthOfTextAtSize(word, fontSize)) * word.length);
        lines.push(word.substring(0, splitIndex) + '-'); // Adiciona um hífen
        word = word.substring(splitIndex);
      }

      currentLine = word;
      isFirstLine = false; // Somente a primeira linha tem recuo
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function justifyText(line, font, fontSize, maxWidth, indentSize = 40, isFirstLine = false) {
  const words = line.split(' ');
  if (words.length === 1) return line; // Não justifica se houver apenas uma palavra

  const totalTextWidth = words.reduce((acc, word) => acc + font.widthOfTextAtSize(word, fontSize), 0);
  const totalSpaces = words.length - 1;
  let extraSpace = (maxWidth - totalTextWidth - (isFirstLine ? indentSize : 0)) / totalSpaces;

  let justifiedLine = words[0];
  for (let i = 1; i < words.length; i++) {
    let spaceWidth = font.widthOfTextAtSize(' ', fontSize);
    let numSpaces = Math.max(1, Math.round(extraSpace / spaceWidth));
    justifiedLine += ' '.repeat(numSpaces) + words[i];
  }

  return justifiedLine;
}

const textoRecibo = `Declaramos que recebemos a importância de R$ ${safeText(dados.valor)} (${(dados.valorExtenso)}), da Prefeitura Municipal de ${safeText(dados.selectedCategory)},referente a ${safeText(dados.selectedProduct)}, 
referente ao mês de: ${safeText(dados.mesRef)} para o Consórcio Intermunicipal de Saúde da 22ª Regional de Saúde de Ivaiporã.`;

// Quebra de texto com recuo no parágrafo
const wrappedText = wordWrap(textoRecibo, font, 12, 450);

let y = 650;
wrappedText.forEach((line, index) => {
  let textToDraw = (index < wrappedText.length - 1) ? justifyText(line, font, 12, 450, 40, index === 0) : line;
  let xPosition = index === 0 ? 80 + 40 : 80; // Adiciona recuo na primeira linha
  page.drawText(textToDraw, { x: xPosition, y, size: 12, font });
  y -= 16;
});

// DETALHES



// RODAPÉ
  page.drawText(`Ivaiporã, ${formatarData(safeText(dados.data))}`, { x: 410, y: 250, size: 11, font }); 

  const pdfBytes = await pdfDoc.save();
  download(pdfBytes, `ReciboCIS_${dados.selectedCategory}_${dados.data}.pdf`, 'application/pdf');

  limparFormulario();
};

const formatarData = (dataISO) => {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
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
          <option value="março">Março</option>
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
     <p>&copy; {new Date().getFullYear()} Tech Systems Ivaiporã. || CNPJ: 60.847.434/0001-53 </p>
   </footer>
    </>
  );
  
};

export default ReciboForm;
