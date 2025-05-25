  function darBaixa(registroEscoteiro) {
            console.log("acionaram o dar baixa")
            fetch("/escoteiro/darBaixa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    registroEscoteiro: registroEscoteiro
                })
            })
                .then(res => {
                    console.log("entrei no fetch")
                    // console.log(body)
                    if (res.ok) {
                        return res.json().then(data => {
                            //  console.log("Resposta da API:", data);
                            alert(`Mensalidade do escoteiro ${registroEscoteiro} atualizada para 'Em dia'.`);

                            window.location.reload();
                        })
                    } else {
                        return res.json().then(data => {
                            throw new Error(data.erro || "Erro ao dar baixa na mensalidade.");
                        });
                    }
                })
                .catch(error => {
                    console.error("Erro na requisição de dar baixa: ", error);
                });
        }