// Host: smtp.hostinger.com
// Porta: 465
// Criptografia: SSL/TLS
const nodemiler = require("nodemailer")

function dataAtualFormatada(){
    var data = new Date(),
    dia  = data.getDate().toString(),
    diaF = (dia.length == 1) ? '0'+dia : dia,
    mes  = (data.getMonth()+1).toString(),
    mesF = (mes.length == 1) ? '0'+mes : mes,
    anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
}

console.log(dataAtualFormatada())

let transporter = nodemiler.createTransport({
    host: "smtp.hostinger.com",
    port: "465",
    secure: true,
    auth:{
        user: "rivaldosouza@grupofiveinvestimentos.com.br",
        pass:"Senha2022#"
    }
})

transporter.sendMail({
    from: "Rivaldo Souza <rivaldosouza@grupofiveinvestimentos.com.br>",
    to:"rivaldosouza@grupofiveinvestimentos.com.br",
    subject:"RDD referente ao dia "+dataAtualFormatada(),
    text: "Segue em anexo",
    attachments: [
        {
            filename: `RDD_Brejinho.xlsx`,
            path: `rdd/RDD_Brejinho.xlsx`
        }
    ]
}).then(msg =>{
    console.log(msg)
}).catch(err =>{
    console.log(err)
})