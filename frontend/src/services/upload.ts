import { API_HOST } from "../config"
import { type ApiUploadResponse, type Data } from "../Types"
export const uploadFile = async (file: File): Promise<[Error?, Data?]> => {
    const formData = new FormData()
    formData.append('file',file)

    try {
        const res = await fetch(`${API_HOST}/api/files`, {
            method: 'POST',
            body: formData
        })
        if (!(await res).ok) return [new Error(`Error al subir el Archivo: ${(await res).statusText}`)]
        const json = await res.json()as ApiUploadResponse
        return [undefined, json.data]
    } catch (error) {
        if (error instanceof Error) return [error] 
    }
    return [new Error('Error desconocido')]
}