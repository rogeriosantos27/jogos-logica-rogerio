// 1. OPÇÕES DOS SELECTS BASEADAS NO SEU ENIGMA
const opcoes = {
    Camiseta: ["", "Azul", "Vermelho", "Amarelo", "Verde", "Preto"],
    Nome: ["", "Nikaelly", "Isadora", "Emilly", "Damarys", "Larissa"], // Exemplo baseado nas pistas
    Hambúrguer: ["", "Bacon extra", "Onion rings", "Sem alface", "Sem cebola", "Simples"],
    Refrigerante: ["", "Coca Cola", "Fanta Uva", "Cajuína", "Guaraná", "Pepsi"],
    Idade: ["", "11", "12", "14", "15", "13"],
    Esporte: ["", "Futebol", "Basquete", "Carimba", "Corrida", "Vôlei"]
};

// 2. GABARITO DO JOGO 3 (Ajuste os valores de cada posição com as respostas certas do seu enigma)
const gabarito = {
    1: { Camiseta: "Preto", Nome: "Isadora", Hambúrguer: "Sem alface", Refrigerante: "Cajuína", Idade: "13", Esporte: "Corrida" },
    2: { Camiseta: "Azul", Nome: "Nikaelly", Hambúrguer: "Bacon extra", Refrigerante: "Coca Cola", Idade: "12", Esporte: "Futebol" },
    3: { Camiseta: "Amarelo", Nome: "Damarys", Hambúrguer: "Onion rings", Refrigerante: "Guaraná", Idade: "11", Esporte: "Basquete" },
    4: { Camiseta: "Vermelho", Nome: "Emilly", Hambúrguer: "Sem cebola", Refrigerante: "Fanta Uva", Idade: "14", Esporte: "Carimba" },
    5: { Camiseta: "Verde", Nome: "Larissa", Hambúrguer: "Simples", Refrigerante: "Pepsi", Idade: "15", Esporte: "Vôlei" }
};

document.addEventListener("DOMContentLoaded", () => {
    gerarTabuleiro();
    document.getElementById("btn-verificar").addEventListener("click", verificarFimDeJogo);
});

// 3. GERAÇÃO DO TABULEIRO COM SUPORTE A IDENTIFICAÇÃO DE COLUNA
function gerarTabuleiro() {
    // Mapeia as linhas existentes criadas no seu HTML
    const linhas = document.querySelectorAll("#tabuleiro tbody tr");
    
    linhas.forEach(linha => {
        const categoria = linha.getAttribute("data-categoria");
        const listaOpcoes = opcoes[categoria] || [""];
        
        // Cria as 5 colunas para as amigas
        for (let i = 1; i <= 5; i++) {
            const td = document.createElement("td");
            td.setAttribute("data-col", i); // CRUCIAL: Vincula a célula à coluna i
            
            const select = document.createElement("select");
            select.setAttribute("data-posicao", i);
            select.setAttribute("data-categoria", categoria);
            
            listaOpcoes.forEach(opcao => {
                const option = document.createElement("option");
                option.value = opcao;
                option.textContent = opcao === "" ? "---" : opcao;
                select.appendChild(option);
            });
            
            // Ativa a verificação dinâmica ao mudar qualquer opção
            select.addEventListener("change", processarMudanca);
            
            // SE FOR A LINHA DA CAMISETA: Ativa o gatilho para colorir a coluna inteira
            if (categoria === "Camiseta") {
                select.addEventListener("change", colorirColuna);
            }
            
            td.appendChild(select);
            linha.appendChild(td);
        }
    });
}

// 4. FUNÇÃO QUE PINTA A COLUNA DE FORMA VIVA E FORTE
function colorirColuna(event) {
    const select = event.target;
    const posicao = select.getAttribute("data-posicao");
    // Transforma em minúsculo e remove acentos/caracteres se houver (Ex: "Amarelo" vira "amarelo")
    const corSelecionada = select.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Captura todas as células (td) daquela mesma coluna vertical
    const celulasColuna = document.querySelectorAll(`#tabuleiro tbody td[data-col='${posicao}']`);
    
    celulasColuna.forEach(td => {
        // Limpa classes antigas de cores para não acumular
        td.classList.remove('coluna-cor-azul', 'coluna-cor-vermelho', 'coluna-cor-amarelo', 'coluna-cor-verde', 'coluna-cor-preto');
        
        // Adiciona a classe correspondente se houver uma cor selecionada válida
        if (corSelecionada && corSelecionada !== "") {
            td.classList.add(`coluna-cor-${corSelecionada}`);
        }
    });
}

function processarMudanca() {
    const estado = obterEstadoAtual();
    validarPistas(estado);
}

function obterEstadoAtual() {
    const estado = {};
    for (let i = 1; i <= 5; i++) {
        estado[i] = { Camiseta: "", Nome: "", Hambúrguer: "", Refrigerante: "", Idade: "", Esporte: "" };
    }
    const selects = document.querySelectorAll("#tabuleiro select");
    selects.forEach(select => {
        const pos = select.getAttribute("data-posicao");
        const cat = select.getAttribute("data-categoria");
        estado[pos][cat] = select.value;
    });
    return estado;
}

// 5. VALIDAÇÃO DAS SUAS 19 PISTAS DA LANCHONETE
function validarPistas(estado) {
    const statusPistas = {}; 
    for (let i = 1; i <= 19; i++) statusPistas[i] = 'neutro';

    const encontrarPos = (categoria, valor) => {
        for (let i = 1; i <= 5; i++) {
            if (estado[i][categoria] === valor) return i;
        }
        return null;
    };

    const contradiz = (pos, categoria, valorEsperado) => {
        return estado[pos][categoria] !== "" && estado[pos][categoria] !== valorEsperado;
    };

    // Pista 1: Coca Cola entre Nikaelly e Fanta Uva
    let pNik = encontrarPos("Nome", "Nikaelly"), pCc = encontrarPos("Refrigerante", "Coca Cola"), pFu = encontrarPos("Refrigerante", "Fanta Uva");
    if (pNik && pCc && pFu) {
        if (pNik < pCc && pCc < pFu) statusPistas[1] = 'sucesso';
        else statusPistas[1] = 'erro';
    }

    // Pista 2: Isadora exatamente à esquerda de 12 anos
    let pIsa = encontrarPos("Nome", "Isadora"), p12 = encontrarPos("Idade", "12");
    if (pIsa && p12) {
        if (pIsa + 1 === p12) statusPistas[2] = 'sucesso';
        else statusPistas[2] = 'erro';
    } else if (pIsa === 5 || p12 === 1) statusPistas[2] = 'erro';

    // Pista 3: Na quarta posição está a garota de 14 anos
    if (estado[4]["Idade"] === "14") statusPistas[3] = 'sucesso';
    else if (contradiz(4, "Idade", "14")) statusPistas[3] = 'erro';

    // Pista 4: Futebol exatamente à direita de Cajuína
    let pFut = encontrarPos("Esporte", "Futebol"), pCaj = encontrarPos("Refrigerante", "Cajuína");
    if (pFut && pCaj) {
        if (pCaj + 1 === pFut) statusPistas[4] = 'sucesso';
        else statusPistas[4] = 'erro';
    } else if (pCaj === 5 || pFut === 1) statusPistas[4] = 'erro';

    // Pista 5: Camiseta Vermelha bebendo Fanta Uva
    let pVer = encontrarPos("Camiseta", "Vermelho");
    if (pVer && pFu) {
        if (pVer === pFu) statusPistas[5] = 'sucesso';
        else statusPistas[5] = 'erro';
    }

    // Pista 6: Basquete entre Futebol e Carimba
    let pBas = encontrarPos("Esporte", "Basquete"), pCar = encontrarPos("Esporte", "Carimba");
    if (pFut && pBas && pCar) {
        if (pFut < pBas && pBas < pCar) statusPistas[6] = 'sucesso';
        else statusPistas[6] = 'erro';
    }

    // Pista 7: 15 anos ao lado de Guaraná
    let p15 = encontrarPos("Idade", "15"), pGua = encontrarPos("Refrigerante", "Guaraná");
    if (p15 && pGua) {
        if (Math.abs(p15 - pGua) === 1) statusPistas[7] = 'sucesso';
        else statusPistas[7] = 'erro';
    }

    // Pista 8: Terceira posição pediu Bacon extra
    if (estado[3]["Hambúrguer"] === "Bacon extra") statusPistas[8] = 'sucesso';
    else if (contradiz(3, "Hambúrguer", "Bacon extra")) statusPistas[8] = 'erro';

    // Pista 9: 12 anos exatamente à direita de camiseta Preta
    let pPre = encontrarPos("Camiseta", "Preto");
    if (p12 && pPre) {
        if (pPre + 1 === p12) statusPistas[9] = 'sucesso';
        else statusPistas[9] = 'erro';
    } else if (pPre === 5 || p12 === 1) statusPistas[9] = 'erro';

    // Pista 10: Corrida exatamente à esquerda de Basquete
    let pCor = encontrarPos("Esporte", "Corrida");
    if (pCor && pBas) {
        if (pCor + 1 === pBas) statusPistas[10] = 'sucesso';
        else statusPistas[10] = 'erro';
    } else if (pCor === 5 || pBas === 1) statusPistas[10] = 'erro';

    // Pista 11: Onion rings ao lado de camiseta Verde
    let pOni = encontrarPos("Hambúrguer", "Onion rings"), pVrd = encontrarPos("Camiseta", "Verde");
    if (pOni && pVrd) {
        if (Math.abs(pOni - pVrd) === 1) statusPistas[11] = 'sucesso';
        else statusPistas[11] = 'erro';
    }

    // Pista 12: Carimba na quinta posição
    if (estado[5]["Esporte"] === "Carimba") statusPistas[12] = 'sucesso';
    else if (contradiz(5, "Esporte", "Carimba")) statusPistas[12] = 'erro';

    // Pista 13: Verde bebendo Pepsi
    let pPep = encontrarPos("Refrigerante", "Pepsi");
    if (pVrd && pPep) {
        if (pVrd === pPep) statusPistas[13] = 'sucesso';
        else statusPistas[13] = 'erro';
    }

    // Pista 14: 11 anos exatamente à esquerda de 14 anos
    let p11 = encontrarPos("Idade", "11"), p14 = encontrarPos("Idade", "14");
    if (p11 && p14) {
        if (p11 + 1 === p14) statusPistas[14] = 'sucesso';
        else statusPistas[14] = 'erro';
    } else if (p11 === 5 || p14 === 1) statusPistas[14] = 'erro';

    // Pista 15: Amarelo entre Sem alface e Vermelho
    let pAma = encontrarPos("Camiseta", "Amarelo"), pSal = encontrarPos("Hambúrguer", "Sem alface");
    if (pSal && pAma && pVer) {
        if (pSal < pAma && pAma < pVer) statusPistas[15] = 'sucesso';
        else statusPistas[15] = 'erro';
    }

    // Pista 16: Fanta Uva exatamente à esquerda de Pepsi
    if (pFu && pPep) {
        if (pFu + 1 === pPep) statusPistas[16] = 'sucesso';
        else statusPistas[16] = 'erro';
    } else if (pFu === 5 || pPep === 1) statusPistas[16] = 'erro';

    // Pista 17: Emilly à direita de camiseta Azul
    let pEmi = encontrarPos("Nome", "Emilly"), pAzl = encontrarPos("Camiseta", "Azul");
    if (pEmi && pAzl) {
        if (pEmi > pAzl) statusPistas[17] = 'sucesso';
        else statusPistas[17] = 'erro';
    }

    // Pista 18: Damarys exatamente à esquerda de Sem cebola
    let pDam = encontrarPos("Nome", "Damarys"), pSce = encontrarPos("Hambúrguer", "Sem cebola");
    if (pDam && pSce) {
        if (pDam + 1 === pSce) statusPistas[18] = 'sucesso';
        else statusPistas[18] = 'erro';
    } else if (pDam === 5 || pSce === 1) statusPistas[18] = 'erro';

    // Pista 19: Nikaelly ao lado de camiseta Azul
    if (pNik && pAzl) {
        if (Math.abs(pNik - pAzl) === 1) statusPistas[19] = 'sucesso';
        else statusPistas[19] = 'erro';
    }

    // Atualiza o estado visual das 19 caixas de pistas
    for (let i = 1; i <= 19; i++) {
        const item = document.getElementById(`pista-${i}`);
        if(item) {
            item.classList.remove("pista-errada", "pista-certa");
            if (statusPistas[i] === 'erro') item.classList.add("pista-errada");
            else if (statusPistas[i] === 'sucesso') item.classList.add("pista-certa");
        }
    }
}

// 6. VERIFICAÇÃO DO BOTÃO "VERIFICAR RESPOSTAS"
function verificarFimDeJogo() {
    const selects = document.querySelectorAll("#tabuleiro select");
    let tudoCorreto = true;
    let preenchido = true;

    selects.forEach(select => {
        if (select.value === "") preenchido = false;
        const pos = select.getAttribute("data-posicao");
        const cat = select.getAttribute("data-categoria");
        if (select.value !== gabarito[pos][cat]) tudoCorreto = false;
    });

    const msg = document.getElementById("mensagem-resultado");
    if (!preenchido) {
        msg.textContent = "Preencha todo o tabuleiro antes de verificar!";
        msg.style.color = "#ffdd57";
    } else if (tudoCorreto) {
        msg.textContent = "🏆 Sensacional! Você organizou a mesa da Lanchonete perfeitamente!";
        msg.style.color = "#2ecc71";
    } else {
        msg.textContent = "❌ Algumas conexões ainda estão incorretas. Confira as pistas coloridas!";
        msg.style.color = "#e74c3c";
    }
}