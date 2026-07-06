// 1. ESTRUTURA DE DADOS DAS PERGUNTAS DO QUIZ
const questoesQuiz = [
    {
        imagem: "maracatu.jpg", // Nome do seu arquivo de imagem na pasta
        pergunta: "Na coreografia de Maracatu, as bailarinas precisam formar um círculo. Tio Jessy explicou que cada bailarina deve ficar exatamente entre duas colegas. Se há 12 bailarinas na roda, quantas bailarinas cada bailarina consegue ter ao seu lado?",
        alternativas: ["3", "2", "4"],
        correta: 1 // Índice da resposta certa (0 = "3", 1 = "2", 2 = "4")
    }
    // Você poderá adicionar as próximas perguntas aqui seguindo o mesmo formato
];

let perguntaAtual = 0;
let travado = false; // Impede múltiplos cliques seguidos

document.addEventListener("DOMContentLoaded", () => {
    carregarQuestao();
    
    // Vincula o evento de clique em todos os botões de alternativa
    const botoes = document.querySelectorAll(".btn-alternativa");
    botoes.forEach(botao => {
        botao.addEventListener("click", verificarResposta);
    });
});

// 2. MONTA A QUESTÃO NA TELA DINAMICAMENTE
function carregarQuestao() {
    travado = false;
    const dados = questoesQuiz[perguntaAtual];
    
    document.getElementById("img-quiz").src = dados.imagem;
    document.getElementById("pergunta-campo").textContent = dados.pergunta;
    document.getElementById("mensagem-feedback").textContent = "";
    
    const botoes = document.querySelectorAll(".btn-alternativa");
    botoes.forEach((botao, index) => {
        botao.textContent = dados.alternativas[index];
        botao.classList.remove("correta", "errada"); // Reseta as cores
    });
}

// 3. VALIDA O CLIQUE DO JOGADOR
function verificarResposta(event) {
    if (travado) return; // Se já clicou, ignora novos cliques
    travado = true;

    const botaoClicado = event.target;
    const indiceSelecionado = parseInt(botaoClicado.getAttribute("data-index"));
    const dadosQuestao = questoesQuiz[perguntaAtual];
    const feedback = document.getElementById("mensagem-feedback");

    if (indiceSelecionado === dadosQuestao.correta) {
        // ACERTOU
        botaoClicado.classList.add("correta");
        feedback.textContent = "🏆 Resposta Correta!";
        feedback.style.color = "#2ecc71";
        
        // Se houver mais perguntas no futuro, você pode avançar após um delay:
        /*
        setTimeout(() => {
            perguntaAtual++;
            if (perguntaAtual < questoesQuiz.length) {
                carregarQuestao();
            } else {
                feedback.textContent = "🎉 Parabéns! Você concluiu o Quiz com sucesso!";
            }
        }, 2000);
        */
    } else {
        // ERROU
        botaoClicado.classList.add("errada");
        feedback.textContent = "❌ Tente novamente!";
        feedback.style.color = "#e74c3c";
        
        // Destrava após 1 segundo para o jogador tentar outra opção
        setTimeout(() => {
            botaoClicado.classList.remove("errada");
            feedback.textContent = "";
            travado = false;
        }, 1200);
    }
}