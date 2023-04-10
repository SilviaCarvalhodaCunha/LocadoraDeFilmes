import express, { Application } from "express";
import { createMovie, deleteMovieId, listAllMovies, searchMovieId, updateMovieId } from "./logics";
import { connectDatabase } from "./database";
import { checkIdExists, existingNameCheck } from "./middleware";

const app: Application = express()
app.use(express.json())

app.post('/movies', existingNameCheck, createMovie)
app.get('/movies', listAllMovies)
app.get('/movies/:id', checkIdExists, searchMovieId)
app.patch('/movies/:id', checkIdExists, existingNameCheck, updateMovieId)
app.delete('/movies/:id', checkIdExists, deleteMovieId)

const PORT: number = 3000
const runningMsg = `Server running on http://localhost:${PORT}`
app.listen(PORT, async() => {
    await connectDatabase()
    console.log(runningMsg)
})