// Host: smtp.hostinger.com
// Porta: 465
// Criptografia: SSL/TLS
//rivaldosouzagrupofive@gmail.com
//Senha2022#
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

const CLIENT_ID = '423384737903-msrbt81085p12ips5g1m4o1jq8000q8i.apps.googleusercontent.com'
const CLIENTE_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04uqLnTAlPvSSCgYIARAAGAQSNwF-L9Ir51aJJGDyFdnEbnHiJRWnN68DDKk6zyGcYV4O-Mzb6Uk3xvkU4H5jSJDXPcqbnS5GRTk'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENTE_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

async function sendMail(){
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemiler.createTransport({
            service:'gmail',
            auth:{
                type:'oauth2',
                user:'rivaldosouzagrupofive@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENTE_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: 'Rivaldo Souza <rivaldosouzagrupofive@gmail.com>',
            to: 'rivaldosouzaxxii@gmail.com, rivaldosilva@si.fiponline.edu.br',
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

app.post('/tasks', async (req, res) =>{
    const task = req.body

    await tasks.push(task)
    console.log(tasks)
    res.json(tasks)
})

app.post('/email', async (req, res) =>{
    await writeMyXlsx(tasks)
    setTimeout(function(){
        sendMail().then(result => console.log('Email enviado', result)).catch(error => console.log(error.message))
    },5000);
    
})

app.get('/tasks', async (req, res) =>{
    res.json(tasks)
})

app.listen('3000', () =>{
    console.log('server running on port 3000');
})