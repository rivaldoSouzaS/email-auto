
let url = `http://localhost:3000/`

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

//console.log(converter(70));

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
        DATA: data
    }

    sendTask(task)
}

const loadTable = async(result)=>{

    let bodyTable = document.querySelector('.body-table')
    bodyTable.innerText = ''

    for (let index = 0; index < result.data.length; index++) {
        let tr = bodyTable.insertRow()
            let td_ativi = tr.insertCell()
            let td_local = tr.insertCell()
            let td_inicio = tr.insertCell()
            let td_fim = tr.insertCell()
            let td_tma = tr.insertCell()
            let td_equi = tr.insertCell()
            let td_data = tr.insertCell()

            td_ativi.innerText = result.data[index].TIPO_DE_SERVICO
            td_local.innerText = result.data[index].LOCALIDADE
            td_inicio.innerText = result.data[index].HORA_INICIO
            td_fim.innerText = result.data[index].HORA_FIM
            td_tma.innerText = result.data[index].TMA
            td_equi.innerText = result.data[index].EQUIPE_EXECUTORA
            td_data.innerText = result.data[index].DATA
            
    }
}

const sendMail = async() =>{
    const result = await axios.post(`${url}email`);
    console.log(result)
}

const sendTask = async(task)=>{
    
    const result = await axios.post(`${url}tasks`,task);
    loadTable(result)
}

const getTasks = async()=>{
    const result = await axios.get(`${url}tasks`);
    loadTable(result)
}

const clearTasks = async() =>{
    const result = await axios.put(`${url}tasks`);
    window.location.reload();
}

document.getElementById("adTask").addEventListener("click", setData)
document.getElementById("send").addEventListener("click", sendMail)

document.getElementById("clear").addEventListener("click", clearTasks)

//console.log(result)
getTasks()