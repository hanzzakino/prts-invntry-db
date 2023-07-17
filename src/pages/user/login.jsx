import { useAuthContext } from '@/context/AuthContext'
import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import generalInfo from '../../../general-info'
// import { useEffect } from "react";

export default function Home() {
    const router = useRouter()
    const { authUser, signIn, isLoading } = useAuthContext()

    // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!isLoading && authUser) {
            router.push('/')
        }
    }, [authUser])

    return (
        <main>
            <Head>
                <title>{generalInfo.appName} | Login</title>
            </Head>
            {!isLoading && !authUser ? (
                <div>
                    <p>Login</p>
                    <button onClick={() => signIn('admin', 'admin')}>
                        Login
                    </button>
                </div>
            ) : (
                <p>Loading</p>
            )}
        </main>
    )
}
