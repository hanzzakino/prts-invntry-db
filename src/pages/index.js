import { useAuthContext } from '@/context/AuthContext'
import { useSettingsContext } from '@/context/SettingsContext'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Dashboard from '@/components/dashboard/Dashboard'
import Navbar from '@/components/shared/Navbar'
import styles from '@/styles/Home.module.css'

export default function Home() {
    const router = useRouter()
    const { authUser, signOut, isLoading } = useAuthContext()
    const { view } = useSettingsContext()

    useEffect(() => {
        if (!authUser) {
            router.push('/user/login')
        }
    }, [authUser])

    return (
        <>
            {!isLoading && authUser ? (
                <main className={styles.container}>
                    <Navbar />
                    <div className={styles.mainContainer}>
                        {view === 'dashboard' && <Dashboard />}
                    </div>
                </main>
            ) : (
                <p>Loading</p>
            )}
        </>
    )
}
