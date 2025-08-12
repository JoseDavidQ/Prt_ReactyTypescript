import { API_HOST } from "../config"
import { type ApiSearchResponse, type Data } from "../Types"

export const searchData = async (search: string): Promise<[Error?, Data?]> => {
    try {
        const res = await fetch(`${API_HOST}/api/users?q=${search}`)
        if (!(await res).ok) return [new Error(`Error al buscar en el Archivo: ${(await res).statusText}`)]
        const json = await res.json()as ApiSearchResponse
        return [undefined, json.data]
    } catch (error) {
        if (error instanceof Error) return [error] 
    }
    return [new Error('Error desconocido')]
}