// script.js

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const municipality = document.getElementById('municipality').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    if (municipality === '') {
        errorMessage.textContent = 'Por favor, selecione um município.';
        errorMessage.style.display = 'block';
        return;
    }

    const validMunicipalities = {
        'Arapuã': 'ar11',
        'Ariranha do Ivai': 'ar22',
        'Candido de Abreu': 'ca33',
        'Cruzmaltina': 'cr44',
        'Godoy Moreira': 'gm55',
        'Ivaiporã': 'iv66',
        'Jardim Alegre': 'ja77',
        'Lidianopolis': 'li88',
        'Lunardelli': 'lu99',
        'Manoel Ribas': 'mr11',
        'Mato Rico': 'mr22',
        'Nova Tebas': 'nt33',
        'Rio Branco do Ivai': 'rb44',
        'Rosario do Ivaí': 'ri55',
        'Santa Maria do Oeste': 'sm66',
        'São João do Ivai': 'sj77'
    };

    if (validMunicipalities[municipality] === password) {
        const municipalityUrl = municipality.toLowerCase().replace(/\s+/g, '') + '.html'; 
        window.location.href = municipalityUrl; 
        errorMessage.style.display = 'none';
    } else {
        errorMessage.textContent = 'Município ou senha incorretos!';
        errorMessage.style.display = 'block';
    }
});
