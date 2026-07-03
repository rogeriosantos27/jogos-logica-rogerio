const opcoes = {
    Professor: ["", "Vitor", "Adrielly", "Anderson", "Jessy", "Hariane"],
    Nome: ["", "Kauanny", "Clarice", "Ketlein", "Camilly", "Julia"],
    Coreografia: ["", "Junina", "Frevo", "Funk", "Samba", "Pau de Fita"],
    Idade: ["", "9", "10", "11", "12", "13"],
    Cor: ["", "Amarelo", "Verde", "Azul", "Vermelho", "Roxo"]
};

// Gabarito correto calculado pelas pistas
const gabarito = {
    1: { Professor: "Hariane", Nome: "Kauanny", Coreografia: "Pau de Fita", Idade: "11", Cor: "Verde" },
    2: { Professor: "Anderson", Nome: "Ketlein", Coreografia: "Funk", Idade: "10", Cor: "Amarelo" },
    3: { Professor: "Vitor", Nome: "Clarice", Coreografia: "Samba", Idade: "12", Cor: "Vermelho" },
    4: { Professor: "Adrielly", Nome: "Camilly", Coreografia: "Junina", Idade: "13", Cor: "Azul" },
    5: { Professor: "Jessy", Nome: "Julia", Coreografia: "Frevo", Idade: "9", Cor: "Roxo" }
};

const coresHex = {
    "Vermelho": "#ffccd5",
    "Verde": "#c7f9cc",
    "Azul": "#bde0fe",
    "Amarelo": "#fef08a",
    "Roxo": "#e9d5ff",
    "": ""
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
    atualizarCoresDasColunas(estado);
    validarPistas(estado);
    
    const selects = document.querySelectorAll("#tabuleiro select");
    selects.forEach(select => {
        select.style.borderColor = "rgba(255, 255, 255, 0.5)";
    });
    const msgElemento = document.getElementById("mensagem-resultado");
    msgElemento.textContent = "";
}

function obterEstadoAtual() {
    const estado = {};
    for (let i = 1; i <= 5; i++) {
        estado[i] = { Professor: "", Nome: "", Coreografia: "", Idade: "", Cor: "" };
    }
    const selects = document.querySelectorAll("#tabuleiro select");
    selects.forEach(select => {
        const pos = select.getAttribute("data-posicao");
        const cat = select.getAttribute("data-categoria");
        estado[pos][cat] = select.value;
    });
    return estado;
}

function atualizarCoresDasColunas(estado) {
    for (let i = 1; i <= 5; i++) {
        const corSelecionada = estado[i]["Cor"];
        const corFundo = coresHex[corSelecionada] || "";
        const selectsDaColuna = document.querySelectorAll(`#tabuleiro select[data-posicao="${i}"]`);
        selectsDaColuna.forEach(select => {
            select.style.backgroundColor = corFundo || "rgba(255, 255, 255, 0.9)";
            select.parentElement.style.backgroundColor = corFundo || "rgba(255, 255, 255, 0.15)";
        });
    }
}

function validarPistas(estado) {
    const statusPistas = {}; 
    for (let i = 1; i <= 15; i++) statusPistas[i] = 'neutro';

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

    // 1. Junina exatamente entre 12 anos e Frevo (12 < Junina < Frevo)
    let p12 = encontrarPos("Idade", "12"), pJun = encontrarPos("Coreografia", "Junina"), pFre = encontrarPos("Coreografia", "Frevo");
    if (pJun === 1 || pJun === 5) statusPistas[1] = 'erro';
    if (p12 && pJun && p12 + 1 !== pJun) statusPistas[1] = 'erro';
    if (pJun && pFre && pJun + 1 !== pFre) statusPistas[1] = 'erro';
    if (p12 && contradiz(p12 + 1, "Coreografia", "Junina")) statusPistas[1] = 'erro';
    if (pJun && contradiz(pJun + 1, "Coreografia", "Frevo")) statusPistas[1] = 'erro';
    if (p12 && pJun && pFre && p12 + 1 === pJun && pJun + 1 === pFre) statusPistas[1] = 'sucesso';

    // 2. Funk exatamente após Pau de Fita
    let pPau = encontrarPos("Coreografia", "Pau de Fita"), pFun = encontrarPos("Coreografia", "Funk");
    if (pFun === 1 || pPau === 5) statusPistas[2] = 'erro';
    if (pPau && pFun && pPau + 1 !== pFun) statusPistas[2] = 'erro';
    if (pPau && contradiz(pPau + 1, "Coreografia", "Funk")) statusPistas[2] = 'erro';
    if (pFun && contradiz(pFun - 1, "Coreografia", "Pau de Fita")) statusPistas[2] = 'erro';
    if (pPau && pFun && pPau + 1 === pFun) statusPistas[2] = 'sucesso';

    // 3. Samba imediatamente antes de Camilly
    let pSam = encontrarPos("Coreografia", "Samba"), pCam = encontrarPos("Nome", "Camilly");
    if (pCam === 1 || pSam === 5) statusPistas[3] = 'erro';
    if (pSam && pCam && pSam + 1 !== pCam) statusPistas[3] = 'erro';
    if (pSam && contradiz(pSam + 1, "Nome", "Camilly")) statusPistas[3] = 'erro';
    if (pCam && contradiz(pCam - 1, "Coreografia", "Samba")) statusPistas[3] = 'erro';
    if (pSam && pCam && pSam + 1 === pCam) statusPistas[3] = 'sucesso';

    // 4. Anderson lidera Funk e aluna nao e Julia
    let pAnd = encontrarPos("Professor", "Anderson");
    if (pAnd && contradiz(pAnd, "Coreografia", "Funk")) statusPistas[4] = 'erro';
    if (pFun && contradiz(pFun, "Professor", "Anderson")) statusPistas[4] = 'erro';
    if (pAnd && estado[pAnd]["Nome"] === "Julia") statusPistas[4] = 'erro';
    if (pAnd && pFun && pAnd === pFun && estado[pAnd]["Nome"] !== "" && estado[pAnd]["Nome"] !== "Julia") statusPistas[4] = 'sucesso';

    // 5. Hariane em 1 ou 5, ao lado de Anderson
    let pHar = encontrarPos("Professor", "Hariane");
    if (pHar && pHar !== 1 && pHar !== 5) statusPistas[5] = 'erro';
    if (pHar && pAnd) {
        if (Math.abs(pHar - pAnd) !== 1) statusPistas[5] = 'erro';
        else if ((pHar === 1 || pHar === 5) && Math.abs(pHar - pAnd) === 1) statusPistas[5] = 'sucesso';
    } else if (pHar) {
        let vizinhoAnd = false;
        if (pHar > 1 && estado[pHar - 1]["Professor"] === "Anderson") vizinhoAnd = true;
        if (pHar < 5 && estado[pHar + 1]["Professor"] === "Anderson") vizinhoAnd = true;
        let limit = (pHar === 1) ? 2 : 4;
        if (estado[limit]["Professor"] !== "" && estado[limit]["Professor"] !== "Anderson") statusPistas[5] = 'erro';
    }

    // 6. Ketlein e Clarice lado a lado
    let pKet = encontrarPos("Nome", "Ketlein"), pCla = encontrarPos("Nome", "Clarice");
    if (pKet) {
        let esq = pKet > 1 ? estado[pKet - 1].Nome : "FORA";
        let dir = pKet < 5 ? estado[pKet + 1].Nome : "FORA";
        if (esq !== "" && esq !== "Clarice" && dir !== "" && dir !== "Clarice") statusPistas[6] = 'erro';
    }
    if (pKet && pCla) {
        if (Math.abs(pKet - pCla) !== 1) statusPistas[6] = 'erro';
        else statusPistas[6] = 'sucesso';
    }

    // 7. Azul imediatamente apos Vermelho
    let pAzu = encontrarPos("Cor", "Azul"), pVer = encontrarPos("Cor", "Vermelho");
    if (pAzu === 1 || pVer === 5) statusPistas[7] = 'erro';
    if (pVer && pAzu && pVer + 1 !== pAzu) statusPistas[7] = 'erro';
    if (pVer && contradiz(pVer + 1, "Cor", "Azul")) statusPistas[7] = 'erro';
    if (pAzu && contradiz(pAzu - 1, "Cor", "Vermelho")) statusPistas[7] = 'erro';
    if (pVer && pAzu && pVer + 1 === pAzu) statusPistas[7] = 'sucesso';

    // 8. Kauanny imediatamente antes de 10 anos
    let pKau = encontrarPos("Nome", "Kauanny"), p10 = encontrarPos("Idade", "10");
    if (p10 === 1 || pKau === 5) statusPistas[8] = 'erro';
    if (pKau && p10 && pKau + 1 !== p10) statusPistas[8] = 'erro';
    if (pKau && contradiz(pKau + 1, "Idade", "10")) statusPistas[8] = 'erro';
    if (p10 && contradiz(p10 - 1, "Nome", "Kauanny")) statusPistas[8] = 'erro';
    if (pKau && p10 && pKau + 1 === p10) statusPistas[8] = 'sucesso';

    // 9. Vitor = Vermelho = Clarice
    let pVit = encontrarPos("Professor", "Vitor");
    if (pVit && pVer && pVit !== pVer) statusPistas[9] = 'erro';
    if (pVit && pCla && pVit !== pCla) statusPistas[9] = 'erro';
    if (pVer && pCla && pVer !== pCla) statusPistas[9] = 'erro';
    if (pVit && contradiz(pVit, "Cor", "Vermelho")) statusPistas[9] = 'erro';
    if (pVit && contradiz(pVit, "Nome", "Clarice")) statusPistas[9] = 'erro';
    if (pVit && pVer && pCla && pVit === pVer && pVer === pCla) statusPistas[9] = 'sucesso';

    // 10. Frevo < 10 anos (9 anos)
    if (pFre && contradiz(pFre, "Idade", "9")) statusPistas[10] = 'erro';
    let p9 = encontrarPos("Idade", "9");
    if (p9 && contradiz(p9, "Coreografia", "Frevo")) statusPistas[10] = 'erro';
    if (pFre && p9 && pFre === p9) statusPistas[10] = 'sucesso';

    // 11. Verde = Hariane
    checarRelacaoDireta(11, "Cor", "Verde", "Professor", "Hariane");

    // 12. Amarelo = Ketlein
    checarRelacaoDireta(12, "Cor", "Amarelo", "Nome", "Ketlein");

    // 13. Verde ao lado de Funk
    let pVerd = encontrarPos("Cor", "Verde");
    if (pVerd) {
        let esq = pVerd > 1 ? estado[pVerd - 1].Coreografia : "FORA";
        let dir = pVerd < 5 ? estado[pVerd + 1].Coreografia : "FORA";
        if (esq !== "" && esq !== "Funk" && dir !== "" && dir !== "Funk") statusPistas[13] = 'erro';
    }
    if (pVerd && pFun) {
        if (Math.abs(pVerd - pFun) !== 1) statusPistas[13] = 'erro';
        else statusPistas[13] = 'sucesso';
    }

    // 14. Vermelho em algum lugar antes de 9 anos
    if (pVer === 5 || p9 === 1) statusPistas[14] = 'erro';
    if (pVer && p9) {
        if (pVer >= p9) statusPistas[14] = 'erro';
        else statusPistas[14] = 'sucesso';
    }

    // 15. Julia em algum lugar após Azul
    let pJul = encontrarPos("Nome", "Julia");
    if (pAzu === 5 || pJul === 1) statusPistas[15] = 'erro';
    if (pAzu && pJul) {
        if (pAzu >= pJul) statusPistas[15] = 'erro';
        else statusPistas[15] = 'sucesso';
    }

    // Aplicar a cor/riscado nas pistas html
    for (let i = 1; i <= 15; i++) {
        const itemPista = document.getElementById(`pista-${i}`);
        if(itemPista) {
            itemPista.classList.remove("pista-errada", "pista-certa");
            if (statusPistas[i] === 'erro') itemPista.classList.add("pista-errada");
            else if (statusPistas[i] === 'sucesso') itemPista.classList.add("pista-certa");
        }
    }
}

function verificarFimDeJogo() {
    const selects = document.querySelectorAll("#tabuleiro select");
    let jogoCompleto = true;
    let tudoCorreto = true;

    selects.forEach(select => {
        const pos = select.getAttribute("data-posicao");
        const cat = select.getAttribute("data-categoria");
        if (select.value === "") jogoCompleto = false;
        if (select.value !== gabarito[pos][cat]) tudoCorreto = false;
    });

    const msgElemento = document.getElementById("mensagem-resultado");
    if (!jogoCompleto) {
        msgElemento.textContent = "Ainda restam campos vazios! Continue tentando.";
        msgElemento.className = "incorreto";
    } else if (tudoCorreto) {
        msgElemento.textContent = "🏆 Incrível! Você desvendou o festival perfeitamente!";
        msgElemento.className = "correto";
    } else {
        msgElemento.textContent = "❌ Algumas respostas estão incorretas. Reveja o tabuleiro!";
        msgElemento.className = "incorreto";
    }
}