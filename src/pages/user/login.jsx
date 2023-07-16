import { useAuthContext } from '@/context/AuthContext'
import { useSettingsContext } from '@/context/SettingsContext'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
// import { useEffect } from "react";

export default function Home() {
    const router = useRouter()
    const { authUser, signIn, isLoading } = useAuthContext()

    useEffect(() => {
        if (!isLoading && authUser) {
            router.push('/')
        }
    }, [authUser])

    return (
        <main>
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
