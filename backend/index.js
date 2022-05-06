// Host: smtp.hostinger.com
// Porta: 465
// Criptografia: SSL/TLS
//  rivaldosouza@grupofiveinvestimentos.com.br
//  rivaldosouzagrupofive@gmail.com
//  Senha2022#
//  danielalves@grupofiveinvestimentos.com.br
//, walfranio@grupofiveinvestimentos.com.br, wictorsantos@grupofiveinvestimentos.com.br
//'rivaldosouza@grupofiveinvestimentos.com.br, walfranio@grupofiveinvestimentos.com.br, wictorsantos@grupofiveinvestimentos.com.br'
const nodemiler = require("nodemailer")
const {google} = require("googleapis")
const cors = require('cors')
const Exceljs = require('exceljs')
const FXLSX = require('xlsx')
const express = require("express")
const bodyParser = require("body-parser")
const app = express();
const { appengine } = require("googleapis/build/src/apis/appengine")

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())

let tasks = []

async function sendMail(){
    try {
        
        const transport = nodemiler.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true,
            auth:{
                user:'rivaldosouza@grupofiveinvestimentos.com.br',
                pass: 'Agility2022#'
            }
        })

        listEmails = await readMyXlsx(`rdd/LISTA-EMAILS.xlsx`)
        const recipients = StringEmails(listEmails)
        
        const mailOptions = {
            from: 'Rivaldo Souza <rivaldosouza@grupofiveinvestimentos.com.br>',
            to: recipients,
            subject:'RDD referente ao dia '+ dataAtualFormatada(),
            text:'Segue em anexo',
            attachments: [
                        {
                            filename: `RDD-Brejinho-${dataAtualFormatada()}.xlsx`,
                            path: `rdd/RDD-Brejinho.xlsx`
                        }
                    ]
        }

        const result = await transport.sendMail(mailOptions)
        return result
    } catch (error) {
        return error
    }
}

//sendMail().then(result => console.log('Email enviado', result)).catch(error => console.log(error.message))
//console.log(xlsxToJson)
//---------------------------------------------------------------------------------------------------------------

function dataAtualFormatada(){
    var data = new Date(),
    dia  = data.getDate().toString(),
    diaF = (dia.length == 1) ? '0'+dia : dia,
    mes  = (data.getMonth()+1).toString(),
    mesF = (mes.length == 1) ? '0'+mes : mes,
    anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
}

async function writeMyXlsx(tasks){
    const exceljsWorkbook = new Exceljs.Workbook()
    const exceljsSheet = exceljsWorkbook.addWorksheet('RDD')

    exceljsSheet.columns = [
        {header: 'TIPO_DE_SERVICO', key:'TIPO_DE_SERVICO', width: 60},
        {header: 'LOCALIDADE', key:'LOCALIDADE', width: 60},
        {header: 'HORA_INICIO', key:'HORA_INICIO', width: 30},
        {header: 'HORA_FIM', key:'HORA_FIM', width: 30},
        {header: 'TMA', key:'TMA', width: 30},
        {header: 'EQUIPE_EXECUTORA', key:'EQUIPE_EXECUTORA', width: 30},
        {header: 'DATA', key:'DATA', width: 30}
    ]

    for (let index = 0; index < tasks.length; index++) {
        await exceljsSheet.addRow(tasks[index])
    }
    
    exceljsSheet.getRow(1).font ={bold: true, color: {argb: 'FFFFFFFF'}}
    exceljsSheet.getRow(1).fill = {type: 'pattern', pattern: 'solid', bgColor: {argb: 'FF000000'}}
    await exceljsSheet.workbook.xlsx.writeFile('rdd/RDD-Brejinho.xlsx')
}

async function readMyXlsx(rout){
    const workbook = FXLSX.readFile(rout)
    const workbookSheets = workbook.SheetNames
    const sheet = workbookSheets[0]
    const xlsxToJson = await FXLSX.utils.sheet_to_json(workbook.Sheets[sheet], {raw: false})
    return xlsxToJson
}

const StringEmails = (jsonEmails) =>{
    let mails =""
    for(let i =0; i < jsonEmails.length; i++){
	    mails += jsonEmails[i].EMAIL +", "
    }
    const result = mails.substring(0, mails.length - 2)
    return result
}

app.post('/tasks', async (req, res) =>{
    const task = req.body

    await tasks.push(task)
    console.log(tasks)
    res.json(tasks)
})

app.post('/email', async (req, res) =>{
    await writeMyXlsx(tasks)
    setTimeout(function(){
        const result = sendMail().then(result => console.log('Email enviado', result)).catch(error => console.log(error.message))
        
    },5000);
})

app.get('/tasks', async (req, res) =>{
    res.json(tasks)
})

app.put('/tasks', async (req, res) =>{
    while(tasks.length) {
        tasks.pop();
    }
    console.log(tasks)
    res.json(tasks)
})

app.put('/tasks/edit', async (req, res) =>{
    const taskEdited = req.body
    while(tasks.length) {
        tasks.pop();
    }
    tasks = taskEdited
    console.log(taskEdited)
    res.json(tasks)
})

app.listen('3000', () =>{
    console.log('server running on port 3000');
})