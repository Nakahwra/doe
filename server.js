// Configurar o servidor
const express = require("express")
const server = express()

// Configurar o servidor para aprensentar arquivos estaticos 
server.use(express.static('public'))

// Habilitar 'body' do formulário
server.use(express.urlencoded({extended: true}))

// Configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db  = new Pool({
    user: 'postgres',
    password: '081015',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

// Configurar a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true
})

// Configurar a apresentação da página
server.get("/", function(req, res){
    
    const query = `
        SELECT *
        FROM "donors";`

    db.query(query, function(err, result){
        if(err) return res.send("Erros de banco de dados!")

        const donors = result.rows
        return res.render("index.html", { donors })
    })

})

server.post("/", function(req, res){
    // Pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios!")
    }

    // Insere valores dentro do banco de dados
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)` 

    const values = [name, email, blood]

    db.query(query, values, function(err) {
        // fluxo de erro
        if(err) return res.send("Erro no banco de dados!")
        
        // fluxo ideal
        return res.redirect("/")
    })

})

// Ligar o servidor na porta 3000
server.listen(3000, function(){
    console.log("Servidor iniciado!")
});