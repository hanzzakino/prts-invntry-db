import '@/styles/globals.css'
import { primaryFont } from '../utils/googleFonts'
import { AuthContextWrapper } from '@/context/AuthContext'
import { SettingsContextWrapper } from '@/context/SettingsContext'

import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

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
                        <ToastContainer
                            position="top-right"
                            autoClose={3500}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                        />
                    </main>
                </SettingsContextWrapper>
            </DatabaseContextWrapper>
        </AuthContextWrapper>
    )
}
