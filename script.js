// Função para alternar entre as seções do site
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar o ano no rodapé
    document.getElementById('ano-atual').textContent = new Date().getFullYear();
    
    // Configurar a Hora Mundial
    setInterval(atualizarHorasMundiais, 1000);
    atualizarHorasMundiais();
    
    // Configurar os listeners do menu
    const menuLinks = document.querySelectorAll('.menu-link');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover a classe active de todos os links
            menuLinks.forEach(l => l.classList.remove('active'));
            
            // Adicionar a classe active ao link clicado
            this.classList.add('active');
            
            // Ocultar todas as seções de conteúdo
            const sections = document.querySelectorAll('.content-section');
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Mostrar a seção correspondente ao link clicado
            const target = this.getAttribute('data-target');
            document.getElementById(target).style.display = 'block';
        });
    });
    
    // Configurar o formulário de contato
    const formContato = document.getElementById('form-contato');
    if (formContato) {
        formContato.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simular envio do formulário
            alert('Mensagem enviada com sucesso! Entrarei em contato em breve.');
            formContato.reset();
        });
    }
    
    // Configurar a Hora Mundial - Adicionar cidade
    document.getElementById('adicionar-cidade').addEventListener('click', adicionarCidade);
    
    // Configurar o Jogo Genius
    const blocos = document.querySelectorAll('.bloco');
    blocos.forEach(bloco => {
        bloco.addEventListener('click', function() {
            const cor = this.getAttribute('data-color');
            verificarJogada(cor);
        });
    });
    
    document.getElementById('iniciar-jogo').addEventListener('click', iniciarJogo);
});

// Funções para a calculadora
let displayValue = '0';
let primeiroValor = null;
let operador = null;
let aguardandoSegundoValor = false;

function atualizarDisplay() {
    const display = document.getElementById('display');
    display.value = displayValue;
}

function adicionarNumero(numero) {
    if (aguardandoSegundoValor) {
        displayValue = numero;
        aguardandoSegundoValor = false;
    } else {
        displayValue = displayValue === '0' ? numero : displayValue + numero;
    }
    atualizarDisplay();
}

function adicionarPonto() {
    if (!displayValue.includes('.')) {
        displayValue += '.';
        atualizarDisplay();
    }
}

function adicionarOperador(op) {
    const valorAtual = parseFloat(displayValue);
    
    if (primeiroValor === null) {
        primeiroValor = valorAtual;
    } else if (operador) {
        const resultado = calcular();
        displayValue = String(resultado);
        primeiroValor = resultado;
    }
    
    aguardandoSegundoValor = true;
    operador = op;
}

function calcular() {
    if (primeiroValor === null || operador === null) return;
    
    const segundoValor = parseFloat(displayValue);
    let resultado;
    
    switch (operador) {
        case '+':
            resultado = primeiroValor + segundoValor;
            break;
        case '-':
            resultado = primeiroValor - segundoValor;
            break;
        case '*':
            resultado = primeiroValor * segundoValor;
            break;
        case '/':
            resultado = primeiroValor / segundoValor;
            break;
        default:
            return;
    }
    
    displayValue = String(resultado);
    atualizarDisplay();
    
    return resultado;
}

function limpar() {
    displayValue = '0';
    primeiroValor = null;
    operador = null;
    aguardandoSegundoValor = false;
    atualizarDisplay();
}

// Funções para a Hora Mundial
function atualizarHorasMundiais() {
    const cidades = document.querySelectorAll('.cidade');
    
    cidades.forEach(cidade => {
        const timezone = cidade.getAttribute('data-timezone');
        const nomeCidade = cidade.getAttribute('data-city');
        const elementoHora = cidade.querySelector('.time');
        
        if (timezone) {
            const options = {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            
            const horaAtual = new Date().toLocaleTimeString('pt-BR', options);
            elementoHora.textContent = horaAtual;
        }
    });
}

function adicionarCidade() {
    const select = document.getElementById('lista-cidades');
    const timezone = select.value;
    
    if (!timezone) return;
    
    // Obter o nome da cidade a partir do valor do timezone
    const nomeCidade = select.options[select.selectedIndex].text;
    
    // Verificar se a cidade já existe
    const cidadeExistente = document.querySelector(`.cidade[data-timezone="${timezone}"]`);
    if (cidadeExistente) {
        alert('Esta cidade já está sendo exibida!');
        return;
    }
    
    // Criar novo elemento de cidade
    const relogioMundial = document.querySelector('.relogio-mundial');
    const novaCidade = document.createElement('div');
    novaCidade.className = 'cidade';
    novaCidade.setAttribute('data-city', nomeCidade);
    novaCidade.setAttribute('data-timezone', timezone);
    novaCidade.innerHTML = `
        <h4>${nomeCidade}</h4>
        <div class="time"></div>
    `;
    
    relogioMundial.appendChild(novaCidade);
    select.value = '';
}

// Funções para o Jogo Genius
let sequencia = [];
let sequenciaJogador = [];
let pontuacao = 0;
let jogoAtivo = false;
let esperandoJogada = false;

function iniciarJogo() {
    sequencia = [];
    sequenciaJogador = [];
    pontuacao = 0;
    jogoAtivo = true;
    document.getElementById('pontuacao').textContent = '0';
    document.getElementById('mensagem-genius').textContent = '';
    proximaRodada();
}

function proximaRodada() {
    esperandoJogada = false;
    sequenciaJogador = [];
    
    // Adicionar uma nova cor à sequência
    const cores = ['green', 'red', 'yellow', 'blue'];
    const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
    sequencia.push(corAleatoria);
    
    // Atualizar pontuação
    pontuacao = sequencia.length - 1;
    document.getElementById('pontuacao').textContent = pontuacao;
    
    // Mostrar a sequência para o jogador
    mostrarSequencia();
}

function mostrarSequencia() {
    let i = 0;
    const interval = setInterval(() => {
        if (i >= sequencia.length) {
            clearInterval(interval);
            esperandoJogada = true;
            return;
        }
        
        const cor = sequencia[i];
        const bloco = document.querySelector(`.bloco[data-color="${cor}"]`);
        
        bloco.classList.add('ativo');
        setTimeout(() => {
            bloco.classList.remove('ativo');
        }, 500);
        
        i++;
    }, 1000);
}

function verificarJogada(cor) {
    if (!esperandoJogada || !jogoAtivo) return;
    
    sequenciaJogador.push(cor);
    const bloco = document.querySelector(`.bloco[data-color="${cor}"]`);
    
    // Efeito visual ao clicar
    bloco.classList.add('clicado');
    setTimeout(() => {
        bloco.classList.remove('clicado');
    }, 200);
    
    // Verificar se a jogada está correta
    const indice = sequenciaJogador.length - 1;
    if (sequenciaJogador[indice] !== sequencia[indice]) {
        // Jogada errada - fim de jogo
        jogoAtivo = false;
        document.getElementById('mensagem-genius').textContent = 'Game Over! Tente novamente.';
        return;
    }
    
    // Verificar se completou a sequência
    if (sequenciaJogador.length === sequencia.length) {
        esperandoJogada = false;
        setTimeout(proximaRodada, 1000);
    }
}