import express from 'express'
import cors from 'cors'
import multer from 'multer'
import csvToJson from 'convert-csv-to-json'

const app = express()
const port = process.env.PORT ?? 3000

// Para guardar los archivos en memoria por mediod de multer
const storage = multer.memoryStorage()
const upload = multer({storage})

let userData: Array<Record<string, string>> = []


app.use(cors()) // Activar CORS

app.post('/api/files',upload.single('file') , async (req, res) => {
    // Extraemos le archivo de la request
    const {file} = req 

    // Validar que se encuentre el archivo en la peticion
    if (!file){
        return res.status(500).json({message:'No se cargo ningun archivo y debe ser obligitario la carga de archivo'})
    }

    // Validar el tipo de archivo que llega (csv)
    if (file.mimetype !== 'text/csv'){
        return res.status(500).json({message: "El archivo debe de ser en CSV"})
    }

    let json: Array<Record<string, string>> = []
    // Transformar el archivo (Buffer) a string
    try {
        const rawCsv = Buffer.from(file.buffer).toString('utf-8')
        // Transformamos el archivo String (csv) a JSON
        json = csvToJson.fieldDelimiter(',').csvStringToJson(rawCsv)
    } catch (error) {
        return res.status(500).json({message: 'error de convertir el archivo'})
    }     
    // Guardamos el JSON en la memoria
    userData = json
    // Retornamos el estado 200 con el mensaje y el JSON
    return res.status(200).json({data: userData, message: 'El archivo se cargo correctamente'})
})


app.get('/api/users', async (req, res) =>{
    // Extraemos el parametro de busqueda `q` para la request
    const {q} = req.query

    // Validar que tenemos el parametro de busqueda
    if (!q){
        return res.status(500).json({message: 'El parametro de busqueda `q` es necesario'})
    }

    if (Array.isArray(q)){
        return res.status(500).json({message: 'El parametro de busqueda `q` debe ser un string'})
    }

    // Hacer el filtro de los datos hacia la memoria con el parametro de busqueda
    const search = q.toString().toLowerCase()

    const filterData = userData.filter(row =>{
        return Object
        .values(row)
        .some(value => value.toLowerCase().includes
        (search))
    })

    return res.status(200).json({data: filterData})
})


app.listen(port, () =>{
    console.log(`el servidor esta corriendo en http://localhost:${port}`)
})