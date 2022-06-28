const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('Please provide appropriate argument')
    console.log('node mongo.js <password>')
    console.log('node mongo.js <password> <name> <number>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://hottungsten:${password}@cluster0.a5lgr6q.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 5){
    mongoose
    .connect(url)
    .then((result) => {
        console.log('connected')
        const person = new Person({
            name: process.argv[3],
            number: process.argv[4]
        })

        return person.save()
    })
    .then(() => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}
else{
    mongoose
        .connect(url)
        .then((result => {
            Person.find({}).then(result => {
                console.log('Phonebook:')
                result.forEach(person =>{
                    console.log(person.name, person.number)
                })
                mongoose.connection.close()
            })
        }))
        .catch((err) => console.log(err))
}
