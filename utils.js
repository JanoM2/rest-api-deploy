//* Una manera de como leer un json en ESModules
// import fs from "node:fs"
// const movies = JSON.parse(fs.readFileSync("./movies.json", "utf-8"))

//* import es una palabra reservada/keyword de ES Modules que ademas de importar
//* tambien contiene informacion 

//* Esta es la manera recomendada por ahora de leer un json en ES Modules

import { createRequire } from "node:module"

const require = createRequire(import.meta.url) //* Esto seria la direccion del archivo actual
export const readJSON = (path) => require(path)
