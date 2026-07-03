const opcoes = {
    Nome: ["", "Raquele", "Julia", "Cecilia", "Ana Clara", "Isabelly"],
    Turma: ["", "INT-1", "INT-2", "INT-3", "INT-4", "INT-5"],
    Suco: ["", "Laranja", "Manga", "Maracujá", "Uva", "Goiaba"],
    Cor: ["", "Vermelho", "Verde", "Azul", "Amarelo", "Rosa"],
    Danca: ["", "Jazz", "Flex", "Força", "Coreografia", "Classico"]
};

const gabarito = {
    1: { Nome: "Raquele", Turma: "INT-2", Suco: "Goiaba", Cor: "Verde", Danca: "Força" },
    2: { Nome: "Ana Clara", Turma: "INT-1", Suco: "Laranja", Cor: "Amarelo", Danca: "Flex" },
    3: { Nome: "Cecilia", Turma: "INT-5", Suco: "Maracujá", Cor: "Rosa", Danca: "Jazz" },
    4: { Nome: "Julia", Turma: "INT-4", Suco: "Uva", Cor: "Azul", Danca: "Classico" },
    5: { Nome: "Isabelly", Turma: "INT-3", Suco: "Manga", Cor: "Vermelho", Danca: "Coreografia" }
};

// MODIFICADO: Cores muito mais vivas, marcantes e bonitas para as colunas
const coresHex = {
    "Vermelho": "#ffccd5", // Um vermelho melancia vivo
    "Verde": "#c7f9cc",    // Um verde menta bem alegre
    "Azul": "#bde0fe",     // Um azul céu destacado
    "Amarelo": "#fef08a",  // Amarelo sol bem nítido
    "Rosa": "#fbcfe8",     // Rosa choque suave e bem visível
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
    
    // Limpa os estilos de validação de borda anteriores ao mudar de opção
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
        estado[i] = { Nome: "", Turma: "", Suco: "", Cor: "", Danca: "" };
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
            // Aplica a cor de forma bem visível tanto nos menus quanto nas células de fundo
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

    // 1. Verde na primeira posição
    if (contradiz(1, "Cor", "Verde") || (encontrarPos("Cor", "Verde") && encontrarPos("Cor", "Verde") !== 1)) {
        statusPistas[1] = 'erro';
    } else if (estado[1]["Cor"] === "Verde") {
        statusPistas[1] = 'sucesso';
    }

    // 2. Julia exatamente à esquerda de Isabelly
    let pJulia = encontrarPos("Nome", "Julia"), pIsa = encontrarPos("Nome", "Isabelly");
    if (pJulia === 5 || pIsa === 1) statusPistas[2] = 'erro';
    if (pJulia && pIsa && pJulia + 1 !== pIsa) statusPistas[2] = 'erro';
    if (pJulia && contradiz(pJulia + 1, "Nome", "Isabelly")) statusPistas[2] = 'erro';
    if (pIsa && contradiz(pIsa - 1, "Nome", "Julia")) statusPistas[2] = 'erro';
    if (pJulia && pIsa && pJulia + 1 === pIsa) statusPistas[2] = 'sucesso';

    // 3. INT-5 no meio (posição 3)
    if (contradiz(3, "Turma", "INT-5") || (encontrarPos("Turma", "INT-5") && encontrarPos("Turma", "INT-5") !== 3)) {
        statusPistas[3] = 'erro';
    } else if (estado[3]["Turma"] === "INT-5") {
        statusPistas[3] = 'sucesso';
    }

    // 4. Amarelo exatamente à direita de Goiaba
    let pGoiaba = encontrarPos("Suco", "Goiaba"), pAmarelo = encontrarPos("Cor", "Amarelo");
    if (pGoiaba === 5 || pAmarelo === 1) statusPistas[4] = 'erro';
    if (pGoiaba && pAmarelo && pGoiaba + 1 !== pAmarelo) statusPistas[4] = 'erro';
    if (pGoiaba && contradiz(pGoiaba + 1, "Cor", "Amarelo")) statusPistas[4] = 'erro';
    if (pAmarelo && contradiz(pAmarelo - 1, "Suco", "Goiaba")) statusPistas[4] = 'erro';
    if (pGoiaba && pAmarelo && pGoiaba + 1 === pAmarelo) statusPistas[4] = 'sucesso';

    // 5. Jazz veste Rosa
    checarRelacaoDireta(5, "Danca", "Jazz", "Cor", "Rosa");

    // 6. Ana Clara ao lado de INT-2
    let pAC = encontrarPos("Nome", "Ana Clara"), pInt2 = encontrarPos("Turma", "INT-2");
    if (pAC) {
        let esq = pAC > 1 ? estado[pAC - 1].Turma : "FORA";
        let dir = pAC < 5 ? estado[pAC + 1].Turma : "FORA";
        if (esq !== "" && esq !== "INT-2" && dir !== "" && dir !== "INT-2") statusPistas[6] = 'erro';
    }
    if (pAC && pInt2) {
        if (Math.abs(pAC - pInt2) !== 1) statusPistas[6] = 'erro';
        else statusPistas[6] = 'sucesso';
    }

    // 7. Uva estuda na INT-4
    checarRelacaoDireta(7, "Suco", "Uva", "Turma", "INT-4");

    // 8. Força em algum lugar à esquerda de Flex
    let pForca = encontrarPos("Danca", "Força"), pFlex = encontrarPos("Danca", "Flex");
    if (pForca === 5 || pFlex === 1) statusPistas[8] = 'erro';
    if (pForca && pFlex) {
        if (pForca >= pFlex) statusPistas[8] = 'erro';
        else statusPistas[8] = 'sucesso';
    }

    // 9. Cecilia bebe Maracujá
    checarRelacaoDireta(9, "Nome", "Cecilia", "Suco", "Maracujá");

    // 10. Azul treina Classico
    checarRelacaoDireta(10, "Cor", "Azul", "Danca", "Classico");

    // 11. INT-1 bebe Laranja
    checarRelacaoDireta(11, "Turma", "INT-1", "Suco", "Laranja");

    // 12. Vermelho gosta de Coreografia
    checarRelacaoDireta(12, "Cor", "Vermelho", "Danca", "Coreografia");

    // 13. Raquele ao lado de Flex
    let pRaq = encontrarPos("Nome", "Raquele"), pFlexD = encontrarPos("Danca", "Flex");
    if (pRaq) {
        let esq = pRaq > 1 ? estado[pRaq - 1].Danca : "FORA";
        let dir = pRaq < 5 ? estado[pRaq + 1].Danca : "FORA";
        if (esq !== "" && esq !== "Flex" && dir !== "" && dir !== "Flex") statusPistas[13] = 'erro';
    }
    if (pRaq && pFlexD) {
        if (Math.abs(pRaq - pFlexD) !== 1) statusPistas[13] = 'erro';
        else statusPistas[13] = 'sucesso';
    }

    // 14. INT-3 na última posição
    if (contradiz(5, "Turma", "INT-3") || (encontrarPos("Turma", "INT-3") && encontrarPos("Turma", "INT-3") !== 5)) {
        statusPistas[14] = 'erro';
    } else if (estado[5]["Turma"] === "INT-3") {
        statusPistas[14] = 'sucesso';
    }

    // 15. Laranja entre Verde e Rosa (Verde < Laranja < Rosa)
    let pVerde = encontrarPos("Cor", "Verde"), pLaranja = encontrarPos("Suco", "Laranja"), pRosa = encontrarPos("Cor", "Rosa");
    if (pLaranja === 1 || pLaranja === 5) statusPistas[15] = 'erro';
    if (pVerde && pLaranja && pVerde >= pLaranja) statusPistas[15] = 'erro';
    if (pLaranja && pRosa && pLaranja >= pRosa) statusPistas[15] = 'erro';
    if (pVerde && pRosa && pVerde >= pRosa) statusPistas[15] = 'erro';
    if (pVerde && pLaranja && pRosa && pVerde < pLaranja && pLaranja < pRosa) statusPistas[15] = 'sucesso';

    for (let i = 1; i <= 15; i++) {
        const itemPista = document.getElementById(`pista-${i}`);
        itemPista.classList.remove("pista-errada", "pista-certa");

        if (statusPistas[i] === 'erro') {
            itemPista.classList.add("pista-errada");
        } else if (statusPistas[i] === 'sucesso') {
            itemPista.classList.add("pista-certa");
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

        if (select.value !== gabarito[pos][cat]) {
            tudoCorreto = false;
        }
    });

    const msgElemento = document.getElementById("mensagem-resultado");
    if (!jogoCompleto) {
        msgElemento.textContent = "Ainda restam campos vazios! Continue tentando.";
        msgElemento.className = "incorreto";
    } else if (tudoCorreto) {
        msgElemento.textContent = "🏆 Incrível! Resolveu o enigma perfeitamente!";
        msgElemento.className = "correto";
    } else {
        msgElemento.textContent = "❌ Algumas respostas estão incorretas. Reveja as marcações!";
        msgElemento.className = "incorreto";
    }
}