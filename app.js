const express = require("express") // require => commonJs
const crypto = require("node:crypto")
const movies = require("./movies.json")
// const cors = require('cors')

const { validateMovie, validatePartialMovie } = require("./schemas/movies")

const app = express()
app.use(express.json())
// app.use(cors({
//     origin: (origin, callback) => {
//         const ACCEPTED_ORIGINS = [
//             'http://localhost:8080',
//             'http://localhost:1234',
//             'https://movies.com',
//             'https://midu.dev'
//         ]

//         if (ACCEPTED_ORIGINS.includes(origin)) {
//             return callback(null, true)
//         }

//         if (!origin) {
//             return callback(null, true)
//         }

//         return callback(new Error('Not allowed by CORS'))
//     }
// }))
app.disable("x-powered-by") // deshabilitar el header X-Powered-By: Express

app.get("/", (req, res) => {
    res.json({ message: "hola mundo" })
})

// CORS
// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE

// CORS PRE-Flight
// OPTIONS

// .Todos los recursos que sean MOVIES se identifican con /movies
app.get('/movies', (req, res) => {
    const origin = req.header("origin")
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header("Access-Control-Allow-Origin", origin)
    }

    const { genre } = req.query
    if (genre) {
        const filteredMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
        return res.json(filteredMovies)
    }
    res.json(movies)
})

app.get("/movies/:id", (req, res) => {
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)

    res.status(404).json({ message: "Movie Not Found" })
})

app.post("/movies", (req, res) => {
    const result = validateMovie(req.body);

    if (!result.succes) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    };
    // title, genre, year, director, duration, rate: rate ?? 0, poster
    movies.push(newMovie)

    res.status(201).json(newMovie) // actualizar la cache del cliente
})

app.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' })
    }

    movies.splice(movieIndex, 1)

    return res.json({ message: 'Movie deleted' })
})

app.patch("/movies/:id", (req, res) => {
    const result = validatePartialMovie(req.body)
    if (!result.succes) return res.status(400).json({ error: JSON.parse(result.error.message) })

    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return res.status(404).json({ message: "Movie Not Found" })

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }
    movies[movieIndex] = updateMovie

    res.json(updateMovie)
})

const ACCEPTED_ORIGINS = [
    "http://192.168.100.1028:8080",
    'http://localhost:8080',
    'http://localhost:1234',
    'https://movies.com',
    'https://midu.dev'
]

//  Asi es sin usar la dependencia de CORS
app.options("/movies/:id", (req, res) => {
    const origin = req.header("option")
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header("Access-Control-Allow-Origin", origin)
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
    }
    res.send(200)
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log(`servidor escuchando en el puerto http://localhost:${PORT}`)
})