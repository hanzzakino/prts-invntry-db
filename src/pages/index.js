import { useAuthContext } from '@/context/AuthContext'
import { useSettingsContext } from '@/context/SettingsContext'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Dashboard from '@/components/dashboard/Dashboard'
import Navbar from '@/components/shared/Navbar'
import styles from '@/styles/Home.module.css'
import NewSale from '@/components/sales/NewSale'
import Inventory from '@/components/inventory/Inventory'
import Head from 'next/head'
import generalInfo from '../../general-info'
import clientPromise from '@/lib/mongodb/mongodb'

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
            <Head>
                <title>{generalInfo.appName}</title>
            </Head>
            {!isLoading && authUser ? (
                <main className={styles.container}>
                    <Navbar />
                    <div className={styles.mainContainer}>
                        {view === '' && <Dashboard />}
                        {view === 'New Sale' && <NewSale />}
                        {view === 'Inventory' && <Inventory />}
                    </div>
                </main>
            ) : (
                <p>Loading</p>
            )}
        </>
    )
}

export async function getServerSideProps({ query }) {
    try {
        const client = await clientPromise
        const db = client.db('inventory-management')
        const data = await db.collection('inventory').find({})

        const data_fetched = await data.limit(10).toArray()

        return {
            props: { inventory_db: JSON.parse(JSON.stringify(data_fetched)) },
        }
    } catch (e) {
        console.log('getServerSideProps error >>>', e)
    }
}
