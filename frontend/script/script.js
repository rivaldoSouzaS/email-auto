
let url = `http://localhost:3000/`
let taksUpdate = []
let tips = []
tips = JSON.parse(localStorage.getItem("tipsList"))
let tipsLocal = []
tipsLocal = JSON.parse(localStorage.getItem("tipsListLocal"))
let indexToRemove

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

    return task;
}

const loadTable = async(result)=>{

    let bodyTable = document.querySelector('.body-table')
    bodyTable.innerText = ''

    for (let index = 0; index < result.data.length; index++) {
        let tr = bodyTable.insertRow()
            let td_id = tr.insertCell()
            let td_ativi = tr.insertCell()
            let td_local = tr.insertCell()
            let td_inicio = tr.insertCell()
            let td_fim = tr.insertCell()
            let td_tma = tr.insertCell()
            let td_equi = tr.insertCell()
            let td_data = tr.insertCell()
            td_id.innerText = index;
            td_ativi.innerText = result.data[index].TIPO_DE_SERVICO
            td_local.innerText = result.data[index].LOCALIDADE
            td_inicio.innerText = result.data[index].HORA_INICIO
            td_fim.innerText = result.data[index].HORA_FIM
            td_tma.innerText = result.data[index].TMA
            td_equi.innerText = result.data[index].EQUIPE_EXECUTORA
            td_data.innerText = result.data[index].DATA
        
        tr.addEventListener("click", event =>{
            //console.log(event.target.firstChild)
            //console.log(event.target.tagName)
            for (let index = 0; index < bodyTable.children.length; index++) {
                bodyTable.children[index].style.backgroundColor = 'white'
            }
            event.target.parentElement.style.backgroundColor = 'red'
            //console.log(event.target.parentElement.children)
            
            indexToRemove = parseInt(event.target.parentElement.children[0].textContent)
            console.log(indexToRemove)
            // document.getElementById("activit").value = event.target.parentElement.children[1].textContent
            // document.getElementById("locate").value = event.target.parentElement.children[2].textContent
            // document.getElementById("start").value = event.target.parentElement.children[3].textContent
            // document.getElementById("and").value = event.target.parentElement.children[4].textContent
            // document.getElementById("user").value = event.target.parentElement.children[6].textContent
            
            //console.log(bodyTable.children)
            console.log(taksUpdate)
        })
    }
}

// function teste(event){
//     console.log("ok")
// }

const editTasks = async() =>{
    let task = taksUpdate.data[indexToRemove]
    console.log(task)
    document.getElementById("activit").value = task.TIPO_DE_SERVICO
    document.getElementById("locate").value = task.LOCALIDADE
    document.getElementById("start").value = task.HORA_INICIO
    document.getElementById("and").value = task.HORA_FIM
    document.getElementById("user").value = task.EQUIPE_EXECUTORA
    document.getElementById("adTask").value = "Salvar"
    //-------------------------------------------------------------
    
}

const sendMail = async() =>{
    const result = await axios.post(`${url}email`);
    console.log(result)
}

const sendTask = async()=>{
    if(document.getElementById("adTask").value === "Salvar"){
        taksUpdate.data.splice(indexToRemove, 1);
        let task = setData()
        taksUpdate.data.push(task)
        console.log("essa mesmo ",taksUpdate.data)

        const result = await axios.put(`${url}tasks/edit`,taksUpdate.data);
        loadTable(result)
        //console.log("Itens removidos ", taksUpdate)
        document.getElementById("adTask").value = "Add"
    }
    else{
        let task = setData()
        const result = await axios.post(`${url}tasks`,task);
        taksUpdate = result.data
        loadTable(result)
    }
}

const getTasks = async()=>{
    const result = await axios.get(`${url}tasks`);
    taksUpdate = result
    loadTable(result)
}

const clearTasks = async() =>{
    const result = await axios.put(`${url}tasks`);
    window.location.reload();
}

function saveTips(){
    let boato = document.getElementById("save-tip").value
    
    if(boato === "Salvar localidade"){
        console.log("ok")
        let tip = document.getElementById("add-tip").value
        tipsLocal.push(tip)
        localStorage.setItem("tipsListLocal", JSON.stringify(tipsLocal))
    }
    if(boato === "Salvar atividade"){
        let tip = document.getElementById("add-tip").value
        tips.push(tip)
        localStorage.setItem("tipsList", JSON.stringify(tips))
    }
}

const loadTableTips = async(result)=>{
    let bodyTableTips = document.querySelector('.body-table-tips')
    bodyTableTips.innerText = ''

    for (let index = 0; index < result.length; index++) {
        let tr = bodyTableTips.insertRow()
            
            let td_ativi = tr.insertCell()
            td_ativi.innerText = result[index]
        
        tr.addEventListener("click", event =>{
            for (let index = 0; index < bodyTableTips.children.length; index++) {
                bodyTableTips.children[index].style.backgroundColor = 'white'
            }
            event.target.parentElement.style.backgroundColor = 'red'


            let text = event.target.parentElement.children[0].textContent
            
            if(document.getElementById("table-tips-th").textContent === "Atividades"){
                document.getElementById("activit").value = text
            }
            else{
                document.getElementById("locate").value = text
            }


            const infos = document.querySelector(".content-info");
            infos.classList.toggle("content-info-show");
        })
    }
}

const cancelTips = ()=>{
    const infos = document.querySelector(".content-info");
    infos.classList.toggle("content-info-show");
}

document.getElementById("adTask").addEventListener("click", sendTask)
document.getElementById("send").addEventListener("click", sendMail)
document.getElementById("edit").addEventListener("click", editTasks)
document.getElementById("clear").addEventListener("click", clearTasks)
document.getElementById("save-tip").addEventListener("click", saveTips)
document.getElementById("cancel-tip").addEventListener("click", cancelTips)

document.getElementById("buscar-localidade").addEventListener("click", event =>{
    toggleActivit(event)
    
})

document.getElementById("buscar-atividade").addEventListener("click", event =>{
    
    toggleActivit(event)
})

function toggleActivit(event){
    const infos = document.querySelector(".content-info");
    infos.classList.toggle("content-info-show");

    //console.log(event.target.parentElement.children[1].id)
    if(event.target.parentElement.children[1].id === "buscar-localidade"){
        document.getElementById("save-tip").value = "Salvar localidade"
        document.getElementById("table-tips-th").textContent = "Localidades"
        loadTableTips(tipsLocal)
    }
    else{
        document.getElementById("save-tip").value = "Salvar atividade"
        document.getElementById("table-tips-th").textContent = "Atividades"
        loadTableTips(tips)
    }
    
}

//console.log(result)
getTasks()
