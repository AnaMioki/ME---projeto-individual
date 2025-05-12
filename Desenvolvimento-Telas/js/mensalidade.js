function exibirEscoteiros(escoteiros) {
    const listaDiv = document.getElementById('escoteiros-lista');
    const mensagemDiv = document.getElementById('mensagem');

    if (escoteiros.length === 0) {
        listaDiv.style.display = 'none';
        mensagemDiv.style.display = 'block'; // Exibe a mensagem
        mensagemDiv.innerText = 'Adicione um escoteiro';
    } else {
        mensagemDiv.style.display = 'none';
        listaDiv.style.display = 'block'; // Exibe a lista de escoteiros
        listaDiv.innerHTML = escoteiros.map(escoteiro => `<p>${escoteiro.nome} - ${escoteiro.registro}</p>`).join('');
    }
}

// Chama a função de busca assim que a página carregar
window.onload = function() {
    buscarEscoteiros();
};