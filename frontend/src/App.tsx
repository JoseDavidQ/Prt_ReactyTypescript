import { useState } from 'react'
import {Toaster, toast} from 'sonner'
import './App.css'
import { uploadFile } from './services/upload'
import {type Data } from './Types'
import { Search } from './steps/search'

const APP_STATUS = { // Mensajes para manejar los estados de la aplicacion 
  IDLE: 'idle', // Al momento de entrar
  ERROR: 'error', // Mensaje de error
  READY_UPLOAD: 'ready_upload', // Al elegir el arcivo
  UPLOADING: 'uploading', // mientras carga el archivo
  READY_USAGE: 'ready_usage' // Despues de subir el archivo
} as const

const BUTTON_TEXT ={
  [APP_STATUS.READY_UPLOAD]: 'Subir Archivo',
  [APP_STATUS.UPLOADING]: 'Subiendo...'
}

type AppStatusType = typeof APP_STATUS[keyof typeof APP_STATUS]

function App() {
  const [appStatus, setAppStatus] = useState<AppStatusType>(APP_STATUS.IDLE)
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState<Data>([])

  const handleInputChange = (event: React
    .ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
      if (files && files.length > 0) {
        setFile(files[0]); 
        setAppStatus(APP_STATUS.READY_UPLOAD);
      }
};


  const handleSubmit = async (event: React
    .FormEvent<HTMLFormElement>) =>{
    event.preventDefault()

    if(appStatus !== APP_STATUS.READY_UPLOAD || !file){
      return
    }

    setAppStatus(APP_STATUS.UPLOADING)

    const [err, newData] = await uploadFile(file)
    console.log({newData})
    if (err){
      setAppStatus(APP_STATUS.ERROR)
      toast.error(err.message)
      return
    }

    setAppStatus(APP_STATUS.READY_USAGE)
    if (newData) setData(newData)
    toast.success('Archivo se ha subido correctamente')
  }

  const showButton = appStatus == APP_STATUS.READY_UPLOAD || appStatus == APP_STATUS.UPLOADING
  const showInput = appStatus !== APP_STATUS.READY_USAGE

  return (
    <>
    <Toaster/>
    <h4>Practica: subir CSV + busqueda</h4>
    { 
      showInput && (
          <form onSubmit={handleSubmit}>
            <label>
              <input disabled={appStatus == APP_STATUS.UPLOADING} 
              onChange={handleInputChange} name='file' type="file" accept='.csv'/>
            </label>
            {showButton && (
              <button disabled={appStatus == APP_STATUS.UPLOADING}>
              {BUTTON_TEXT[appStatus]}
              </button>
            )}
        </form>
       )
    }

    {
      appStatus == APP_STATUS.READY_USAGE && (
        <Search initialData={data}/>
      )
    }
      </>
  )
}

export default App
