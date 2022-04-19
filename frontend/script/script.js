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

const converter = (minutos) => {
  const horas = Math.floor(minutos/ 60);          
  const min = minutos % 60;
  const textoHoras = (`00${horas}`).slice(-2);
  const textoMinutos = (`00${min}`).slice(-2);
  
  return `${textoHoras }:${textoMinutos}`;
};

console.log(converter(70));

function setData(){
    let activit = document.getElementById("activit").value
    let locate = document.getElementById("locate").value
    let start = document.getElementById("start").value
    let end = document.getElementById("and").value
    let user = document.getElementById("user").value
    let tma = converter(duracao(end, start))
    
    let dataAtual = new Date();
    let dia = dataAtual.getDate();
    let mes = (dataAtual.getMonth() + 1);
    let ano = dataAtual.getFullYear();
    let horas = dataAtual.getHours();
    let minutos = dataAtual.getMinutes();
    let data = dia +"/"+mes+"/"+ano

    const task = {
        TIPO_DE_SERVICO: activit,
        LOCALIDADE: locate,
        HORA_INICIO: start,
        HORA_FIM: end,
        TMA: tma,
        EQUIPE_EXECUTORA: user,
        Data: data
    }

    sendTask(task)
}

document.getElementById("send").addEventListener("click", setData)

const sendTask = async(task)=>{
    console.log(task)
    const result = await axios.post(`http://localhost:3000/tasks`,task);
}

const getTasks = async()=>{
    const result = await axios.get(`http://localhost:3000/tasks`);

    console.log(result)
}


getTasks()