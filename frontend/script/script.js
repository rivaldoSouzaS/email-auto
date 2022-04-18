function parse(horario) {
    let [hora, minuto] = horario.split(':').map(v => parseInt(v));
    if (!minuto) {
        minuto = 0;
    }
    return minuto + (hora * 60);
}

function duracao(fim, inicio) {
    return (parse(fim) - parse(inicio));
}

function setData(){
    let activit = document.getElementById("activit").value
    let locate = document.getElementById("locate").value
    let start = document.getElementById("start").value
    let end = document.getElementById("and").value
    let user = document.getElementById("user").value

    const task = {
        TIPO_DE_SERVICO: activit,
        LOCALIDADE: locate,
        HORA_INICIO: start,
        HORA_FIM: end,
        EQUIPE_EXECUTORA: user
    }

    

    console.log(duracao(end, start));


    return task
}



document.getElementById("send").addEventListener("click", setData)
