import { useAuthContext } from '@/context/AuthContext'
import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import generalInfo from '../../../general-info'
// import { useEffect } from "react";

export default function Home() {
    const router = useRouter()
    const { authUser, signIn, isLoading } = useAuthContext()

    useEffect(() => {
        if (!isLoading && authUser) {
            router.push('/')
        }
    }, [authUser]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <main>
            <Head>
                <title>{generalInfo.appName} | Login</title>
            </Head>
            {!isLoading && !authUser ? (
                <div>
                    <h1>Under Development</h1>
                    <p>Click on Login</p>
                    <p>Login</p>
                    <button onClick={() => signIn('admin', 'admin')}>
                        Admin Login
                    </button>
                    <button onClick={() => signIn('user', 'user')}>
                        User Login
                    </button>
                </div>
            ) : (
                <p>Loading</p>
            )}
        </main>
    )
}
