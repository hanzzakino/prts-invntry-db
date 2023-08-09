import '@/styles/globals.css'
import { primaryFont } from '../utils/googleFonts'
import { AuthContextWrapper } from '@/context/AuthContext'
import { SettingsContextWrapper } from '@/context/SettingsContext'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Router from 'next/router'
import { DatabaseContextWrapper } from '@/context/DatabaseContext'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

export default function MyApp({ Component, pageProps }) {
    return (
        <AuthContextWrapper>
            <DatabaseContextWrapper>
                <SettingsContextWrapper>
                    <main className={primaryFont.className}>
                        <Component {...pageProps} />
                    </main>
                </SettingsContextWrapper>
            </DatabaseContextWrapper>
        </AuthContextWrapper>
    )
}
