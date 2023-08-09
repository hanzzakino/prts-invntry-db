import { createContext, useContext } from 'react'

const DatabaseContext = createContext()

export const DatabaseContextWrapper = ({ children }) => {
   
    const addNewSale = async (data) => {
        try {
            let response = await fetch('/api/add-sale', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
            response = await response.json()
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <DatabaseContext.Provider
            value={{
                addNewSale
            }}
        >
            {children}
        </DatabaseContext.Provider>
    )
}

export const useDatabaseContext = () => useContext(DatabaseContext)
