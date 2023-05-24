const {default: mongoose} = require('mongoose')

// const URL_DB = 'mongodb+srv://ali_bahrampoor:7St1YjKvE6uDXRNd@cluster0.hnkf9.mongodb.net/test'
const URL_DB = process.env.DATABASE_URL
mongoose.set('strictQuery', true)

mongoose.connect(URL_DB).then(res => {
    console.log('db connected with mongoose')
}).catch(err => {
    console.log('error connection')
})

