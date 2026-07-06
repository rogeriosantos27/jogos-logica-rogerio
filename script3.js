const opcoes = {
    Camiseta: ["", "Verde", "Amarela", "Azul", "Vermelha", "Preta"],
    Nome: ["", "Nikaelly", "Isadora", "Emilly", "Damarys", "Luna"],
    Hambúrguer: ["", "Bacon extra", "Sem cebola", "Bem passado", "Onion rings", "Sem alface"],
    Refrigerante: ["", "Coca Cola", "Fanta Uva", "Cajuína", "Guaraná", "Pepsi"],
    Idade: ["", "11", "12", "13", "14", "15"],
    Esporte: ["", "Basquete", "Corrida", "Futebol", "Vôlei", "Carimba"]
};

const gabarito = {
    1: { Camiseta: "Preta", Nome: "Isadora", Hambúrguer: "Sem alface", Refrigerante: "Cajuína", Idade: "15", Esporte: "Vôlei" },
    2: { Camiseta: "Amarela", Nome: "Nikaelly", Hambúrguer: "Bem passado", Refrigerante: "Guaraná", Idade: "12", Esporte: "Futebol" },
    3: { Camiseta: "Azul", Nome: "Luna", Hambúrguer: "Bacon extra", Refrigerante: "Coca Cola", Idade: "11", Esporte: "Corrida" },
    4: { Camiseta: "Vermelha", Nome: "Damarys", Hambúrguer: "Onion rings", Refrigerante: "Fanta Uva", Idade: "14", Esporte: "Basquete" },
    5: { Camiseta: "Verde", Nome: "Emilly", Hambúrguer: "Sem cebola", Refrigerante: "Pepsi", Idade: "13", Esporte: "Carimba" }
};

document.addEventListener("DOMContentLoaded", () => {
    gerarTabuleiro();
    document.getElementById("btn-verificar").addEventListener("click", verificarFimDeJogo);
});

function gerarTabuleiro() {
    const lines = document.querySelectorAll("#tabuleiro tbody tr");
    lines.forEach(linha => {
        const categoria = linha.getAttribute("data-categoria");
        const listaOpcoes = opcoes[categoria];
        for (let i = 1; i <= 5; i++) {
            const td = document.createElement("td");
            const select = document.createElement("select");
            select.setAttribute("data-posicao", i);
            select.setAttribute("data-categoria", categoria);
            listaOpcoes.forEach(opcao => {
                const option = document.createElement("option");
                option.value = opcao;
                option.textContent = opcao === "" ? "---" : opcao;
                select.appendChild(option);
            });
            select.addEventListener("change", processarMudanca);
            td.appendChild(select);
            linha.appendChild(td);
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

    const checarRelacaoDireta = (pistaNum, cat1, val1, cat2, val2) => {
        let pos1 = encontrarPos(cat1, val1);
        let pos2 = encontrarPos(cat2, val2);
        if (pos1 && pos2 && pos1 !== pos2) { statusPistas[pistaNum] = 'erro'; return; }
        if (pos1 && contradiz(pos1, cat2, val2)) { statusPistas[pistaNum] = 'erro'; return; }
        if (pos2 && contradiz(pos2, cat1, val1)) { statusPistas[pistaNum] = 'erro'; return; }
        if (pos1 && pos2 && pos1 === pos2) { statusPistas[pistaNum] = 'sucesso'; }
    };

    // 1. Coca entre Nikaelly e Fanta Uva
    let pNik = encontrarPos("Nome", "Nikaelly"), pCoc = encontrarPos("Refrigerante", "Coca Cola"), pFan = encontrarPos("Refrigerante", "Fanta Uva");
    if (pNik && pCoc && pFan) {
        if (pNik < pCoc && pCoc < pFan) statusPistas[1] = 'sucesso';
        else statusPistas[1] = 'erro';
    }

    // 2. Isadora à esquerda de 12 anos
    let pIsa = encontrarPos("Nome", "Isadora"), p12 = encontrarPos("Idade", "12");
    if (pIsa && p12) {
        if (pIsa + 1 === p12) statusPistas[2] = 'sucesso';
        else statusPistas[2] = 'erro';
    } else if (pIsa === 5 || p12 === 1) statusPistas[2] = 'erro';

    // 3. 4ª posição é 14 anos
    if (estado[4]["Idade"] === "14") statusPistas[3] = 'sucesso';
    else if (contradiz(4, "Idade", "14")) statusPistas[3] = 'erro';

    // 4. Futebol à direita de Cajuína
    let pFut = encontrarPos("Esporte", "Futebol"), pCaj = encontrarPos("Refrigerante", "Cajuína");
    if (pFut && pCaj) {
        if (pCaj + 1 === pFut) statusPistas[4] = 'sucesso';
        else statusPistas[4] = 'erro';
    }

    // 5. Vermelha bebe Fanta Uva
    checarRelacaoDireta(5, "Camiseta", "Vermelha", "Refrigerante", "Fanta Uva");

    // 6. Basquete entre Futebol e Carimba
    let pBas = encontrarPos("Esporte", "Basquete"), pCar = encontrarPos("Esporte", "Carimba");
    if (pFut && pBas && pCar) {
        if (pFut < pBas && pBas < pCar) statusPistas[6] = 'sucesso';
        else statusPistas[6] = 'erro';
    }

    // 7. 15 anos ao lado de Guaraná
    let p15 = encontrarPos("Idade", "15"), pGua = encontrarPos("Refrigerante", "Guaraná");
    if (p15 && pGua) {
        if (Math.abs(p15 - pGua) === 1) statusPistas[7] = 'sucesso';
        else statusPistas[7] = 'erro';
    }

    // 8. 3ª posição é Bacon Extra
    if (estado[3]["Hambúrguer"] === "Bacon extra") statusPistas[8] = 'sucesso';
    else if (contradiz(3, "Hambúrguer", "Bacon extra")) statusPistas[8] = 'erro';

    // 9. 12 anos à direita de Preta
    let pPre = encontrarPos("Camiseta", "Preta");
    if (p12 && pPre) {
        if (pPre + 1 === p12) statusPistas[9] = 'sucesso';
        else statusPistas[9] = 'erro';
    }

    // 10. Corrida à esquerda de Basquete
    let pCor = encontrarPos("Esporte", "Corrida");
    if (pCor && pBas) {
        if (pCor + 1 === pBas) statusPistas[10] = 'sucesso';
        else statusPistas[10] = 'erro';
    }

    // 11. Onion Rings ao lado de Verde
    let pOni = encontrarPos("Hambúrguer", "Onion rings"), pVer = encontrarPos("Camiseta", "Verde");
    if (pOni && pVer) {
        if (Math.abs(pOni - pVer) === 1) statusPistas[11] = 'sucesso';
        else statusPistas[11] = 'erro';
    }

    // 12. Carimba na 5ª posição
    if (estado[5]["Esporte"] === "Carimba") statusPistas[12] = 'sucesso';
    else if (contradiz(5, "Esporte", "Carimba")) statusPistas[12] = 'erro';

    // 13. Verde bebe Pepsi
    checarRelacaoDireta(13, "Camiseta", "Verde", "Refrigerante", "Pepsi");

    // 14. 11 anos à esquerda de 14 anos
    let p11 = encontrarPos("Idade", "11"), p14 = encontrarPos("Idade", "14");
    if (p11 && p14) {
        if (p11 + 1 === p14) statusPistas[14] = 'sucesso';
        else statusPistas[14] = 'erro';
    }

    // 15. Amarela entre Sem Alface e Vermelha
    let pAma = encontrarPos("Camiseta", "Amarela"), pAlf = encontrarPos("Hambúrguer", "Sem alface"), pVem = encontrarPos("Camiseta", "Vermelha");
    if (pAlf && pAma && pVem) {
        if (pAlf < pAma && pAma < pVem) statusPistas[15] = 'sucesso';
        else statusPistas[15] = 'erro';
    }

    // 16. Fanta Uva à esquerda de Pepsi
    let pPep = encontrarPos("Refrigerante", "Pepsi");
    if (pFan && pPep) {
        if (pFan + 1 === pPep) statusPistas[16] = 'sucesso';
        else statusPistas[16] = 'erro';
    }

    // 17. Emilly à direita de Azul
    let pEmi = encontrarPos("Nome", "Emilly"), pAzu = encontrarPos("Camiseta", "Azul");
    if (pEmi && pAzu) {
        if (pEmi > pAzu) statusPistas[17] = 'sucesso';
        else statusPistas[17] = 'erro';
    }

    // 18. Damarys à esquerda de Sem Cebola
    let pDam = encontrarPos("Nome", "Damarys"), pCeb = encontrarPos("Hambúrguer", "Sem cebola");
    if (pDam && pCeb) {
        if (pDam + 1 === pCeb) statusPistas[18] = 'sucesso';
        else statusPistas[18] = 'erro';
    }

    // 19. Nikaelly ao lado de Azul
    if (pNik && pAzu) {
        if (Math.abs(pNik - pAzu) === 1) statusPistas[19] = 'sucesso';
        else statusPistas[19] = 'erro';
    }

    for (let i = 1; i <= 19; i++) {
        const item = document.getElementById(`pista-${i}`);
        if(item) {
            item.classList.remove("pista-errada", "pista-certa");
            if (statusPistas[i] === 'erro') item.classList.add("pista-errada");
            else if (statusPistas[i] === 'sucesso') item.classList.add("pista-certa");
        }
    }
}

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
        msg.textContent = "Preencha tudo antes!";
        msg.className = "incorreto";
    } else if (tudoCorreto) {
        msg.textContent = "🏆 Você venceu!";
        msg.className = "correto";
    } else {
        msg.textContent = "❌ Algo está errado.";
        msg.className = "incorreto";
    }
}