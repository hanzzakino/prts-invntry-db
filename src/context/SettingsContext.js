import { createContext, useContext, useState } from 'react'

const SettingsContext = createContext()

export const SettingsContextWrapper = ({ children }) => {
    const [view, setView] = useState('')

    const setViewPanel = (panel) => {
        setView(panel)
    }

    return (
        <SettingsContext.Provider
            value={{
                setViewPanel,
                view,
            }}
        >
            {children}
        </SettingsContext.Provider>
    )
}

export const useSettingsContext = () => useContext(SettingsContext)
