import '@/styles/globals.css'
import { primaryFont } from '../utils/googleFonts'

import { AuthContextWrapper } from '@/context/AuthContext'
import { SettingsContextWrapper } from '@/context/SettingsContext'

export default function MyApp({ Component, pageProps }) {
    return (
        <AuthContextWrapper>
            <SettingsContextWrapper>
                <main className={primaryFont.className}>
                    <Component {...pageProps} />
                </main>
            </SettingsContextWrapper>
        </AuthContextWrapper>
    )
}
