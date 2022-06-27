const express = require('express')
const { json } = require('express/lib/response')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())
app.use(cors())
morgan.token('postData', (request) => {
    if(request.method === 'POST') return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))


app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const count = persons.length
    const currentTime = new Date()
    
    response.send(
        `<div>Phonebook has info for ${count} people</div>
        <br>
        <div>${currentTime}</div>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random() * 100000)
    const body = request.body
    
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'Content missing'
        })
    }
    if(persons.some(p => p.name === body.name)){
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }
    const person = {
        id: id,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== person)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})