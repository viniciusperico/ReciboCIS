<?php
// Conexão com o banco de dados PostgreSQL
$host = "localhost";
$port = "5432";
$dbname = "recibocis";
$user = "postgres";
$password = "12qwaszx";

// Estabelecendo a conexão com o banco de dados
$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password options='--client_encoding=UTF8'");

// Verificar se a conexão foi estabelecida com sucesso
if (!$conn) {
    die("Erro ao conectar ao banco de dados: " . pg_last_error());
}

// Verificar se o formulário foi submetido
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Coletar dados do formulário
    $nome = $_POST['nome'];
    $funcao = $_POST['funcao'];
    $tipo_recibo = $_POST['tipo-recibo'];
    $data_recibo = $_POST['data-recibo'];
    $mes_referencia = $_POST['mes-referencia'];
    $valor = $_POST['valor']; // Assumindo que o valor já está formatado como "R$ 7589,85"
    $valor = str_replace(array('R$', '.', ' '), '', $valor); // Remove o símbolo de moeda, pontos e espaços em branco
    $valor = str_replace(',', '.', $valor); // Substitui vírgula por ponto para formato numérico
    $valor = floatval($valor); // Converte para float
    $email = $_POST['email'];
    $detalhamento = $_POST['detalhamento'];

    // Preparar a consulta SQL para evitar injeção de SQL
    $query = "INSERT INTO recibos (nome, funcao, tipo_recibo, data_recibo, mes_referencia, valor, email, detalhamento) 
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
    
    // Executar a consulta preparada
    $result = pg_query_params($conn, $query, array($nome, $funcao, $tipo_recibo, $data_recibo, $mes_referencia, $valor, $email, $detalhamento));

    // Verificar se a inserção foi bem-sucedida
    if ($result) {
        echo "Recibo salvo com sucesso!";
    } else {
        echo "Erro ao salvar recibo: " . pg_last_error($conn);
    }
}

echo

// Fechar a conexão com o banco de dados
pg_close($conn);
?>