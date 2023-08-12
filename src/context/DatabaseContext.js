import { createContext, useContext } from 'react'
import NProgress from 'nprogress'

const DatabaseContext = createContext()

export const DatabaseContextWrapper = ({ children }) => {
   
    const addSale = async (data) => {
        NProgress.start()
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
        } finally {
            NProgress.done()
        }
    }
    const updateInventory = async (data, id) => {
        try {
            let response = await fetch('/api/update-inventory?id=' + id, {
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
                addSale,
                updateInventory
            }}
        >
            {children}
        </DatabaseContext.Provider>
    )
}

export const useDatabaseContext = () => useContext(DatabaseContext)
