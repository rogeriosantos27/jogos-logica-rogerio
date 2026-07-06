const opcoes = {
    Camisa: ["", "Roxo", "Marrom", "Azul", "Rosa", "Branco"],
    Nome: ["", "Ruth", "Mary", "Kamila", "Ludmyla", "Laysa"],
    Talento: ["", "Canto", "Dança", "Malabarismo", "Imitação", "Música"],
    Idade: ["", "22", "27", "24", "19", "30"],
    Fruta: ["", "Abacaxi", "Banana", "Maçã", "Uva", "Morango"],
    Prato: ["", "Lasanha", "Almôndega", "Macarronada", "Pratinho", "Feijoada"]
};

// Gabarito validado logicamente através das 21 pistas matematicamente corretas
const gabarito = {
    1: { Camisa: "Rosa", Nome: "Ludmyla", Talento: "Imitação", Idade: "22", Fruta: "Morango", Prato: "Feijoada" },
    2: { Camisa: "Branco", Nome: "Ruth", Talento: "Dança", Idade: "27", Fruta: "Abacaxi", Prato: "Macarronada" },
    3: { Camisa: "Marrom", Nome: "Laysa", Talento: "Música", Idade: "19", Fruta: "Maçã", Prato: "Pratinho" },
    4: { Camisa: "Azul", Nome: "Mary", Talento: "Malabarismo", Idade: "30", Fruta: "Banana", Prato: "Lasanha" },
    5: { Camisa: "Roxo", Nome: "Kamila", Talento: "Canto", Idade: "24", Fruta: "Uva", Prato: "Almôndega" }
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
        estado[i] = { Camisa: "", Nome: "", Talento: "", Idade: "", Fruta: "", Prato: "" };
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
    for (let i = 1; i <= 21; i++) statusPistas[i] = 'neutro';

    const encontrarPos = (categoria, valor) => {
        for (let i = 1; i <= 5; i++) {
            if (estado[i][categoria] === valor) return i;
        }
        return null;
    };

    const contradiz = (pos, categoria, valorEsperado) => {
        return estado[pos][categoria] !== "" && estado[pos][categoria] !== valorEsperado;
    };

    // 1. Lasanha entre 22 anos e Almôndega
    let p22 = encontrarPos("Idade", "22"), pLas = encontrarPos("Prato", "Lasanha"), pAlm = encontrarPos("Prato", "Almôndega");
    if (p22 && pLas && pAlm) {
        if (p22 < pLas && pLas < pAlm) statusPistas[1] = 'sucesso';
        else statusPistas[1] = 'erro';
    }

    // 2. 4ª posição gosta de Lasanha
    if (estado[4]["Prato"] === "Lasanha") statusPistas[2] = 'sucesso';
    else if (contradiz(4, "Prato", "Lasanha")) statusPistas[2] = 'erro';

    // 3. Macarronada na 2ª posição
    if (estado[2]["Prato"] === "Macarronada") statusPistas[3] = 'sucesso';
    else if (contradiz(2, "Prato", "Macarronada")) statusPistas[3] = 'erro';

    // 4. Ruth exatamente à esquerda de Pratinho
    let pRut = encontrarPos("Nome", "Ruth"), pPra = encontrarPos("Prato", "Pratinho");
    if (pRut && pPra) {
        if (pRut + 1 === pPra) statusPistas[4] = 'sucesso';
        else statusPistas[4] = 'erro';
    }

    // 5. Uva gosta de Almôndega
    let pUva = encontrarPos("Fruta", "Uva");
    if (pUva && pAlm) {
        if (pUva === pAlm) statusPistas[5] = 'sucesso';
        else statusPistas[5] = 'erro';
    }

    // 6. Ruth exatamente à esquerda de Maçã
    let pMac = encontrarPos("Fruta", "Maçã");
    if (pRut && pMac) {
        if (pRut + 1 === pMac) statusPistas[6] = 'sucesso';
        else statusPistas[6] = 'erro';
    }

    // 7. Morango e Abacaxi lado a lado
    let pMor = encontrarPos("Fruta", "Morango"), pAba = encontrarPos("Fruta", "Abacaxi");
    if (pMor && pAba) {
        if (Math.abs(pMor - pAba) === 1) statusPistas[7] = 'sucesso';
        else statusPistas[7] = 'erro';
    }

    // 8. Branco ao lado de Morango
    let pBra = encontrarPos("Camisa", "Branco");
    if (pBra && pMor) {
        if (Math.abs(pBra - pMor) === 1) statusPistas[8] = 'sucesso';
        else statusPistas[8] = 'erro';
    }

    // 9. Roxa ao lado de 30 anos
    let pRox = encontrarPos("Camisa", "Roxo"), p30 = encontrarPos("Idade", "30");
    if (pRox && p30) {
        if (Math.abs(pRox - p30) === 1) statusPistas[9] = 'sucesso';
        else statusPistas[9] = 'erro';
    }

    // 10. Marrom à esquerda de 24 anos
    let pMar = encontrarPos("Camisa", "Marrom"), p24 = encontrarPos("Idade", "24");
    if (pMar && p24) {
        if (pMar < p24) statusPistas[10] = 'sucesso';
        else statusPistas[10] = 'erro';
    }

    // 11. 2ª posição tem 27 anos
    if (estado[2]["Idade"] === "27") statusPistas[11] = 'sucesso';
    else if (contradiz(2, "Idade", "27")) statusPistas[11] = 'erro';

    // 12. 22 anos exatamente à esquerda de Ruth
    if (p22 && pRut) {
        if (p22 + 1 === pRut) statusPistas[12] = 'sucesso';
        else statusPistas[12] = 'erro';
    }

    // 13. Canto exatamente à direita de Mary
    let pCan = encontrarPos("Talento", "Canto"), pMry = encontrarPos("Nome", "Mary");
    if (pCan && pMry) {
        if (pMry + 1 === pCan) statusPistas[13] = 'sucesso';
        else statusPistas[13] = 'erro';
    }

    // 14. Malabarismo exatamente à esquerda de Canto
    let pMal = encontrarPos("Talento", "Malabarismo");
    if (pMal && pCan) {
        if (pMal + 1 === pCan) statusPistas[14] = 'sucesso';
        else statusPistas[14] = 'erro';
    }

    // 15. Macarronada exatamente à direita de Imitação
    let pImi = encontrarPos("Talento", "Imitação");
    let pMacarr = encontrarPos("Prato", "Macarronada");
    if (pImi && pMacarr) {
        if (pImi + 1 === pMacarr) statusPistas[15] = 'sucesso';
        else statusPistas[15] = 'erro';
    }

    // 16. Canto está em uma das pontas
    if (pCan) {
        if (pCan === 1 || pCan === 5) statusPistas[16] = 'sucesso';
        else statusPistas[16] = 'erro';
    }

    // 17. Kamila à direita de Marrom
    let pKam = encontrarPos("Nome", "Kamila");
    if (pKam && pMar) {
        if (pKam > pMar) statusPistas[17] = 'sucesso';
        else statusPistas[17] = 'erro';
    }

    // 18. Ludmyla exatamente à esquerda de 27 anos
    let pLud = encontrarPos("Nome", "Ludmyla");
    let p27 = encontrarPos("Idade", "27");
    if (pLud && p27) {
        if (pLud + 1 === p27) statusPistas[18] = 'sucesso';
        else statusPistas[18] = 'erro';
    }

    // 19. Mary está de Azul
    let pAzu = encontrarPos("Camisa", "Azul");
    if (pMry && pAzu) {
        if (pMry === pAzu) statusPistas[19] = 'sucesso';
        else statusPistas[19] = 'erro';
    }

    // 20. Abacaxi exatamente à direita de Feijoada
    let pFei = encontrarPos("Prato", "Feijoada");
    if (pAba && pFei) {
        if (pFei + 1 === pAba) statusPistas[20] = 'sucesso';
        else statusPistas[20] = 'erro';
    }

    // 21. Música está de Marrom
    let pMus = encontrarPos("Talento", "Música");
    if (pMus && pMar) {
        if (pMus === pMar) statusPistas[21] = 'sucesso';
        else statusPistas[21] = 'erro';
    }

    // Atualização de classes visuais nas pistas
    for (let i = 1; i <= 21; i++) {
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
        msg.textContent = "Preencha todo o tabuleiro antes de verificar!";
        msg.className = "incorreto";
    } else if (tudoCorreto) {
        msg.textContent = "🏆 Sensacional! Você desvendou o Show de Talentos perfeitamente!";
        msg.className = "correto";
    } else {
        msg.textContent = "❌ Algumas conexões ainda estão incorretas. Confira as pistas vermelhas!";
        msg.className = "incorreto";
    }
}