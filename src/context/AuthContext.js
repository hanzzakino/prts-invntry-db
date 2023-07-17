import { createContext, useContext, useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const AuthContext = createContext()
export const AuthContextWrapper = ({ children }) => {
    const [authUser, setAuthUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [authUserLocal, setAuthUserLocal, unpersistAuthUserLocal] =
        useLocalStorage('authUser')

    const signIn = async (username, password) => {
        setIsLoading(true)
        try {
            const hashedPassword = password
            // const hashedPassword = sha256(password);
            let response = await fetch('/api/get-user', {
                method: 'POST',
                body: JSON.stringify({ username, password: hashedPassword }),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
            response = await response.json()

            if (response[0]) {
                setAuthUserLocal(response[0])
                setAuthUser(response[0])
            } else {
                setAuthUser(null)
            }
        } catch (e) {
            setAuthUser(null)
            console.log(e)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!authUser) getLocalStorageAuth()
    })

    const getLocalStorageAuth = () => {
        setIsLoading(true)
        setAuthUser(authUserLocal)
        setIsLoading(false)
    }

    const signOut = () => {
        setAuthUser(null)
        unpersistAuthUserLocal()
        setIsLoading(false)
    }

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                signIn,
                signOut,
                authUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext)
