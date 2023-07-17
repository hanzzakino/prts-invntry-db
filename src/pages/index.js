import { useAuthContext } from '@/context/AuthContext'
import { useSettingsContext } from '@/context/SettingsContext'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

import Navbar from '@/components/Navbar'
import styles from '@/styles/Home.module.css'

import Head from 'next/head'
import generalInfo from '../../general-info'
import clientPromise from '@/lib/mongodb/mongodb'

export default function Home() {
    const router = useRouter()
    const { authUser, signOut, isLoading } = useAuthContext()
    const { view } = useSettingsContext()

    // eslint-disable-line react-hooks/exhaustive-deps
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
                <main className="pagecontainer">
                    <Navbar />
                    <div className="mainContainer">
                        <div className={styles.container}>
                            <div className={styles.userInfoContainer}>
                                <h1>
                                    Hello, {authUser.name}{' '}
                                    {authUser.access === 'admin' && '(Admin)'}
                                </h1>
                                <h1>{authUser.branch} BRANCH</h1>
                            </div>
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                        </div>
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
