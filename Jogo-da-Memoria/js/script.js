const botoesPrincipais = document.querySelectorAll('.botao');
let imagens = document.querySelectorAll('.imagem');
const usernameInput = document.querySelector('#username');
const reiniciar = document.querySelector('.reiniciar');
const novojogo = document.querySelector('.novojogo');
const listaNumeroDeJogadores = document.querySelectorAll('.jogadores');
let contadorChange = 1;
let imagemAberta = "";
let imagemAnterior = "";
let botoesDoJogo = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18];
let numeroDeJogadores = 2;
let contadorMultiplayer = 0;
let listaPontoDosJogadores = [0, 0];
let iniciarJogo = false;
let contadorTentativas = 0;
let finalDoJogo = 0;
let rankingSinglePlayer = [];
let rankingContraCPU = [];
let memoriaCPU = {};

// Função para adicionar um jogador ao ranking
function adicionarAoRanking(nome, tentativas, pares) {
    if (numeroDeJogadores == 1) {
        rankingSinglePlayer.push({ nome: nome, tentativas: tentativas });
        rankingSinglePlayer.sort((a, b) => a.tentativas - b.tentativas);
    } else if (numeroDeJogadores == 2) {
        rankingContraCPU.push({ nome: nome, pares: pares });
        rankingContraCPU.sort((a, b) => b.pares - a.pares);
    }
}

// Função para exibir o ranking
function exibirRanking() {
    let rankingHTML = '<h2>Ranking</h2>';

    if (numeroDeJogadores == 1) {
        rankingHTML += '<h2>Single Player</h2>';
        rankingHTML += '<table><tr><th>#</th><th>Nome</th><th>Tentativas</th></tr>';
        rankingSinglePlayer.forEach((jogo, index) => {
            rankingHTML += `<tr><td>${index + 1}</td><td>${jogo.nome}</td><td>${jogo.tentativas}</td></tr>`;
        });
        rankingHTML += '</table>';
    } else if (numeroDeJogadores == 2) {
        rankingHTML += '<h2>Contra CPU</h2>';
        rankingHTML += '<table><tr><th>#</th><th>Nome</th><th>Pares</th></tr>';
        rankingContraCPU.forEach((jogo, index) => {
            rankingHTML += `<tr><td>${index + 1}</td><td>${jogo.nome}</td><td>${jogo.pares}</td></tr>`;
        });
        rankingHTML += '</table>';
    }

    document.getElementById('ranking').innerHTML = rankingHTML;
}

// Embaralha os botões do jogo
for (let i = botoesDoJogo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [botoesDoJogo[i], botoesDoJogo[j]] = [botoesDoJogo[j], botoesDoJogo[i]];
}

// Atribui uma imagem a cada botão
for (let i = 0; i < imagens.length; i++) {
    imagens[i].src = "./images/(" + botoesDoJogo[i] + ").png";
    imagens[i].accessKey = botoesDoJogo[i];
}

// Função para determinar o jogador ativo
function jogadorAtivo(contadorMultiplayer) {
    for (let i = 0; i < numeroDeJogadores; i++) {
        if (contadorMultiplayer == i) {
            for (j = 0; j < numeroDeJogadores; j++) {
                if (document.querySelectorAll('.player')[j].classList.contains('player-ativo')) {
                    document.querySelectorAll('.player')[j].classList.remove('player-ativo');
                }
            }
            document.querySelectorAll('.player')[i].classList.add('player-ativo');
        }
    }
}

// Função para determinar o vencedor
function vencedor(listaPontoDosJogadores) {
    const nomejogador = usernameInput.value;
    let maiorPontuacao = 0;
    let empate = false;
    for (let i = 0; i < listaPontoDosJogadores.length; i++) {
        if (listaPontoDosJogadores[i] > maiorPontuacao) {
            maiorPontuacao = listaPontoDosJogadores[i];
        }
    }
    let vencedor = listaPontoDosJogadores.findIndex(v => v == maiorPontuacao);

    listaPontoDosJogadores.splice(vencedor, 1);

    for (let j = 0; j < listaPontoDosJogadores.length; j++) {
        if (listaPontoDosJogadores[j] == maiorPontuacao) {
            empate = true;
        }
    }

    if (empate) {
        let mensagemEmpate;
        mensagemEmpate = "Fim do jogo, " + nomejogador + "! O jogo terminou empatado! Você terminou com " + maiorPontuacao + " pares!";
        adicionarAoRanking(nomejogador, null, maiorPontuacao);
        document.querySelector('.empate').innerHTML = mensagemEmpate;
        document.querySelector('.empate').classList.remove('inativo');
    } else {
        let mensagemVitoria;
        if (numeroDeJogadores == 1) {
            mensagemVitoria = "Fim do jogo, " + nomejogador + "! Você terminou com " + contadorTentativas + " tentativas!";
            adicionarAoRanking(nomejogador, contadorTentativas, null);
        } else if (numeroDeJogadores == 2) {
            if (vencedor == 0) {
                mensagemVitoria = "Fim do jogo, " + nomejogador + "! Você ganhou o Jogo! com " + maiorPontuacao + " pares!";
                adicionarAoRanking(nomejogador, null, maiorPontuacao);
            } else {
                mensagemVitoria = "Fim do jogo, " + nomejogador + "! Você perdeu o Jogo! Você terminou com " + listaPontoDosJogadores[0] + " pares!";
                adicionarAoRanking(nomejogador, null, listaPontoDosJogadores[0]);
            }
        }
        document.querySelector('.vitoria').innerHTML = mensagemVitoria;
        document.querySelector('.vitoria').classList.remove('inativo');
    }
    exibirRanking();
}

for (let i = 0; i < listaNumeroDeJogadores.length; i++) {
    // Função para controlar a configuração inicial do jogo
    listaNumeroDeJogadores[i].onclick = function () {
        const nomejogador = usernameInput.value;
        if (!nomejogador) {
            alert('Por favor, digite seu nome.');
            return;
        }
        if (i < 2) {
            numeroDeJogadores = i + 1;
            document.querySelector('.inicio-do-jogo').classList.add('inativo');
            if (numeroDeJogadores == 1) {
                for (let k = 0; k < document.querySelectorAll('.player').length; k++) {
                    document.querySelectorAll('.player')[k].classList.add('inativo');
                }
                document.querySelector('.um-player').classList.remove('inativo');
            } else if (numeroDeJogadores > 1) {
                for (let j = 0; j < document.querySelectorAll('.player').length; j++) {
                    if (j > (numeroDeJogadores - 1)) {
                        document.querySelectorAll('.player')[j].classList.add('inativo');
                    }
                }
            }
            iniciarJogo = true;
            exibirRanking();
        }
    };
}

// Função para a jogada da CPU
function jogadaCPU() {
    let botoesNaoClicados = Array.from(botoesPrincipais).filter((botao, index) => imagens[index].classList.contains('oculto'));

    if (botoesNaoClicados.length > 0) {
        let botaoEncontrado = false;

        for (let i = 0; i < botoesNaoClicados.length; i++) {
            let index = Array.from(botoesPrincipais).indexOf(botoesNaoClicados[i]);
            let valorbotao = botoesDoJogo[index];

            if (memoriaCPU[valorbotao] && memoriaCPU[valorbotao] !== botoesNaoClicados[i] && Math.random() > 0.6) {
                botoesNaoClicados[i].click();
                delete memoriaCPU[valorbotao];
                botaoEncontrado = true;
                break;
            }
        }

        if (!botaoEncontrado) {
            let botaoAleatorio = botoesNaoClicados[Math.floor(Math.random() * botoesNaoClicados.length)];
            botaoAleatorio.click();
            let index = Array.from(botoesPrincipais).indexOf(botaoAleatorio);
            let valorbotao = botoesDoJogo[index];
            memoriaCPU[valorbotao] = botaoAleatorio;
        }
    }
}

for (let i = 0; i < botoesPrincipais.length; i++) {
    // Função para controlar o fluxo do jogo
    botoesPrincipais[i].onclick = function () {
        if (iniciarJogo && imagens[i].classList.contains('oculto') && !imagens[i].classList.contains('imagem-ativa')) {
            if (contadorChange == 1) {
                botoesPrincipais[i].classList.add('vira');
                imagens[i].classList.remove('oculto');
                contadorChange = contadorChange + 1;
                imagemAberta = parseInt(imagens[i].accessKey, 10);
                imagemAnterior = i;
            } else if (contadorChange == 2) {
                botoesPrincipais[i].classList.add('vira');
                imagens[i].classList.remove('oculto');
                contadorChange = contadorChange + 1;
                if (parseInt(imagens[i].accessKey, 10) === imagemAberta) {
                    imagens[i].classList.add('imagem-ativa');
                    botoesPrincipais[i].classList.add('botao-ativo');
                    imagens[imagemAnterior].classList.add('imagem-ativa');
                    botoesPrincipais[imagemAnterior].classList.add('botao-ativo');
                    for (let k = 0; k < document.querySelectorAll('.player').length; k++) {
                        if (document.querySelectorAll('.player')[k].classList.contains('player-ativo')) {
                            listaPontoDosJogadores[k] = listaPontoDosJogadores[k] + 1;
                            if (k === 1 && listaPontoDosJogadores[k] > 0) {
                                document.querySelectorAll('.player')[k].innerHTML = "<h2>CPU</h2><p>" + listaPontoDosJogadores[k] + "</p>";
                            } else {
                                document.querySelectorAll('.player')[k].innerHTML = "<h2>P" + (k + 1) + "</h2><p>" + listaPontoDosJogadores[k] + "</p>";
                            }
                        }
                    }
                    finalDoJogo = finalDoJogo + 1;
                } else {
                    contadorMultiplayer = (contadorMultiplayer + 1) % numeroDeJogadores;
                    jogadorAtivo(contadorMultiplayer);
                    contadorTentativas = 1;
                    document.querySelector('.tentativas').innerHTML = "Tentativas: " + contadorTentativas;
                }
            } else if (contadorChange > 2 && contadorChange % 2 == 0) {
                botoesPrincipais[i].classList.add('vira');
                imagens[i].classList.remove('oculto');
                contadorChange = contadorChange + 1;
                if (parseInt(imagens[i].accessKey, 10) === imagemAberta) {
                    imagens[i].classList.add('imagem-ativa');
                    botoesPrincipais[i].classList.add('botao-ativo');
                    imagens[imagemAnterior].classList.add('imagem-ativa');
                    botoesPrincipais[imagemAnterior].classList.add('botao-ativo');
                    for (let k = 0; k < document.querySelectorAll('.player').length; k++) {
                        if (document.querySelectorAll('.player')[k].classList.contains('player-ativo')) {
                            listaPontoDosJogadores[k] = listaPontoDosJogadores[k] + 1;
                            if (k === 1 && listaPontoDosJogadores[k] > 0) {
                                document.querySelectorAll('.player')[k].innerHTML = "<h2>CPU</h2><p>" + listaPontoDosJogadores[k] + "</p>";
                            } else {
                                document.querySelectorAll('.player')[k].innerHTML = "<h2>P" + (k + 1) + "</h2><p>" + listaPontoDosJogadores[k] + "</p>";
                            }
                        }
                    }
                    finalDoJogo = finalDoJogo + 1;
                    if (finalDoJogo == 18) {
                        vencedor(listaPontoDosJogadores);
                    }
                } else {
                    contadorMultiplayer = (contadorMultiplayer + 1) % numeroDeJogadores;
                    jogadorAtivo(contadorMultiplayer);
                    contadorTentativas = contadorTentativas + 1;
                    document.querySelector('.tentativas').innerHTML = "Tentativas: " + contadorTentativas;
                }
            } else if (contadorChange > 2 && contadorChange % 2 == 1) {
                for (let j = 0; j < botoesPrincipais.length; j++) {
                    if (!imagens[j].classList.contains('oculto') && !imagens[j].classList.contains('imagem-ativa')) {
                        imagens[j].classList.add('oculto');
                        botoesPrincipais[j].classList.remove('vira');
                    }
                }
                botoesPrincipais[i].classList.add('vira');
                imagens[i].classList.remove('oculto');
                contadorChange = contadorChange + 1;
                imagemAberta = parseInt(imagens[i].accessKey, 10);
                imagemAnterior = i;
            }
        }
        if (contadorMultiplayer == 1) {
            setTimeout(jogadaCPU, 2000);
        }
    };
}

// Função para reiniciar o jogo
reiniciar.onclick = function () {
    for (let i = 0; i < botoesPrincipais.length; i++) {
        if (!imagens[i].classList.contains('oculto')) {
            imagens[i].classList.add('oculto');
            botoesPrincipais[i].classList.remove('vira');
        }
        if (imagens[i].classList.contains('imagem-ativa')) {
            imagens[i].classList.remove('imagem-ativa');
            botoesPrincipais[i].classList.remove('vira');
            botoesPrincipais[i].classList.remove('botao-ativo');
        }
    }

    for (let i = 0; i < document.querySelectorAll('.player').length; i++) {
        if (document.querySelectorAll('.player')[i].classList.contains('player-ativo')) {
            document.querySelectorAll('.player')[i].classList.remove('player-ativo');
        }
    }
    document.querySelectorAll('.player')[0].classList.add('player-ativo');
    contadorMultiplayer = 0;
    contadorTentativas = 0;
    contadorJogadasCPU = 0;
    document.querySelector('.tentativas').innerHTML = "Tentativas: 0";
    listaPontoDosJogadores = [0, 0];

    document.querySelectorAll('.player')[0].innerHTML = "<h2>P1</h2><p>0</p></button>";
    document.querySelectorAll('.player')[1].innerHTML = "<h2>CPU</h2><p>0</p></button>";
    finalDoJogo = 0;
    if (!document.querySelector('.vitoria').classList.contains('inativo')) {
        document.querySelector('.vitoria').classList.add('inativo');
    }
    if (!document.querySelector('.empate').classList.contains('inativo')) {
        document.querySelector('.empate').classList.add('inativo');
    }
};

// Função para embaralhar as botões e iniciar um novo jogo
novojogo.onclick = function embaralhar() {
    listaPontoDosJogadores = [0, 0];
    document.querySelectorAll('.player')[0].innerHTML = "<h2>P1</h2><p>0</p></button>";
    document.querySelectorAll('.player')[1].innerHTML = "<h2>CPU</h2><p>0</p></button>";
    iniciarJogo = false;
    finalDoJogo = 0;
    if (!document.querySelector('.vitoria').classList.contains('inativo')) {
        document.querySelector('.vitoria').classList.add('inativo');
    }
    if (!document.querySelector('.empate').classList.contains('inativo')) {
        document.querySelector('.empate').classList.add('inativo');
    }
    for (let i = 0; i < document.querySelectorAll('.player').length; i++) {
        if (document.querySelectorAll('.player')[i].classList.contains('player-ativo')) {
            document.querySelectorAll('.player')[i].classList.remove('player-ativo');
        }
    }
    document.querySelectorAll('.player')[0].classList.add('player-ativo');
    contadorMultiplayer = 0;
    contadorTentativas = 0;
    contadorJogadasCPU = 0;
    document.querySelector('.tentativas').innerHTML = "Tentativas: 0";

    for (let i = 0; i < botoesPrincipais.length; i++) {
        if (!imagens[i].classList.contains('oculto')) {
            imagens[i].classList.add('oculto');
            botoesPrincipais[i].classList.remove('vira');
        }
        if (imagens[i].classList.contains('imagem-ativa')) {
            imagens[i].classList.remove('imagem-ativa');
            botoesPrincipais[i].classList.remove('vira');
            botoesPrincipais[i].classList.remove('botao-ativo');
        }
    }
    for (let i = 0; i < document.querySelectorAll('.player').length; i++) {
        if (document.querySelectorAll('.player')[i].classList.contains('inativo')) {
            document.querySelectorAll('.player')[i].classList.remove('inativo');
        }
    }
    if (!document.querySelector('.um-player').classList.contains('inativo')) {
        document.querySelector('.um-player').classList.add('inativo');
    }
    document.querySelector('.inicio-do-jogo').classList.remove('inativo');

    // Função para embaralhar as botões do jogo e atualizar as imagens dos botões de acordo com a nova ordem.
    setTimeout(() => {
        for (let i = botoesDoJogo.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [botoesDoJogo[i], botoesDoJogo[j]] = [botoesDoJogo[j], botoesDoJogo[i]];
        }

        for (let i = 0; i < imagens.length; i++) {
            imagens[i].src = "./images/(" + botoesDoJogo[i] + ").png";
            imagens[i].accessKey = botoesDoJogo[i];
        }
    }, 2000);
};
