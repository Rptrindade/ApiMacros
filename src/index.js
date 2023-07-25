const express = require('express')
const cors = require('cors')
const{ Pool } = require('pg')
require('dotenv').config()

const PORT = process.env.PORT || 3333

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
})

const app = express() 

app.use(express.json())

app.use(cors())

app.get('/', (req, res) => {console.log('Olá Mundo')})

app.get('/macros', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM Macros')
        return res.status(200).send(rows)
    } catch(err) {
        return res.status(400).send(err) 
    }
})

app.post('/newmacro', async (req, res) => {
    const { macro_name, frota } = req.body
    try {
        const newMacro = await pool.query('INSERT INTO Macros(nome_macro, frota) VALUES ($1, $2) RETURNING *;', [macro_name, frota])
        return res.status(200).send(newMacro.rows)
    } catch(err) { 
        res.status(400).send(err)
    }
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`))