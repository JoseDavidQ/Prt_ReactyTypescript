import React, { useEffect, useState } from "react"
import type { Data } from "../Types"
import { useDebounce } from "@uidotdev/usehooks"
import { searchData } from "../services/search"
import { toast } from "sonner"
import "./search.css";

const DEBOUNCE_TIME = 250

export const Search = ({initialData}: {initialData: Data}) => {
    const [data, setData] = useState<Data>(initialData)
    const [search, setSearch] = useState<string>(() =>{
        const searchParams = new URLSearchParams(window.location.search)
        return searchParams.get('q') ?? ''
    })

    const debounceSearch = useDebounce(search, DEBOUNCE_TIME)

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) =>{
        setSearch(event.target.value)
    }

    useEffect(() =>{
        const newPathname = debounceSearch == ''
        ? window.location.pathname
        : `?q=${debounceSearch}`

        window.history.pushState({}, '', newPathname)
    }, [debounceSearch])

    useEffect(() =>{
        if (!debounceSearch){
            setData(initialData)
            return
        }
        //llamamos la api para filtrar los resultados
        searchData(debounceSearch)
        .then(response =>{
            const [err, newData] = response
            if (err) {
                toast.error(err.message)
                return
            }
            if(newData) setData(newData)
        })
    }), [debounceSearch, initialData]

    return (
        <div className="search-container">
            <h1>Buscar</h1>
            <form>
                <input
                onChange={handleSearch}
                type="search"
                placeholder="Buscar información..."
                defaultValue={search}
                className="search-input"
                />
            </form>
            <div className="card-grid">
                {data.map((row) => (
                <div className="card" key={row.id}>
                    <article>
                    {Object.entries(row).map(([key, value]) => (
                        <p key={key}>
                        <strong>{key}:</strong> {value}
                        </p>
                    ))}
                    </article>
                </div>
                ))}
            </div>
        </div>
    )
}