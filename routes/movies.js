import { Router } from "express";
import { MovieController } from "../controllers/movies.js";

//* CORS
// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE

//* CORS PRE-Flight
//* OPTIONS

export const moviesRouter = Router()

moviesRouter.get("/", MovieController.getAll)

moviesRouter.get("/:id", MovieController.getById)

moviesRouter.post("/", MovieController.create)

moviesRouter.delete("/:id", MovieController.delete)

moviesRouter.patch("/:id", MovieController.update)

//* Todos los recursos que sean MOVIES se identifican con /movies
//* Asi es sin usar la dependencia de CORS (npm install)
// app.options("/", (req, res) => {
//     const origin = req.header("option")
//     if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//         res.header("Access-Control-Allow-Origin", origin)
//         res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
//     }
//     res.send(200)
// })