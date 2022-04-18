// Host: smtp.hostinger.com
// Porta: 465
// Criptografia: SSL/TLS

//rivaldosouzagrupofive@gmail.com
//Senha2022#
const nodemiler = require("nodemailer")
const {google} = require("googleapis")
const FXLSX = require('xlsx')
const express = require("express")
const app = express();
const { appengine } = require("googleapis/build/src/apis/appengine")

app.use(express.json())

const workbook = FXLSX.readFile(`rdd/RDD_Brejinho.xlsx`)
const workbookSheets = workbook.SheetNames
const sheet = workbookSheets[0]
const xlsxToJson = FXLSX.utils.sheet_to_json(workbook.Sheets[sheet], {raw: false})

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
            to: 'rivaldosouzaxxii@gmail.com',
            subject:'Deu certo essa bomba',
            text:'deu certo finalmente',
            attachments: [
                        {
                            filename: `RDD_Brejinho.xlsx`,
                            path: `rdd/RDD_Brejinho.xlsx`
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

app.listen('3000', () =>{
    console.log('server running on port 3000');
})