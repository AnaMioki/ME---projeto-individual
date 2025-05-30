function exibirEscoteiros(escoteiros) {
    const listaDiv = document.getElementById('escoteiros-lista');
    const mensagemDiv = document.getElementById('mensagem');

    if (escoteiros.length === 0) {
        listaDiv.style.display = 'none';
        mensagemDiv.style.display = 'block'; 
        mensagemDiv.innerText = 'Adicione um escoteiro';
    } else {
        mensagemDiv.style.display = 'none';
        listaDiv.style.display = 'block'; 
        listaDiv.innerHTML = escoteiros.map(escoteiro => `<p>${escoteiro.nome} - ${escoteiro.registro}</p>`).join('');
    }
}


window.onload = function() {
    buscarEscoteiros();
};