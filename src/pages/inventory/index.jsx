import { useAuthContext } from '@/context/AuthContext'
import { useSettingsContext } from '@/context/SettingsContext'
import styles from '@/styles/Inventory.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Head from 'next/head'
import generalInfo from '../../../general-info'
import clientPromise from '@/lib/mongodb/mongodb'

export default function Inventory({ inventory_db }) {
    const router = useRouter()
    const { authUser, signOut, isLoading } = useAuthContext()
    const { view } = useSettingsContext()
    const [searchText, setSearchText] = useState('')

    useEffect(() => {
        if (!authUser) {
            router.push('/user/login')
        }
    }, [authUser])

    const dataRow = inventory_db.map((data, index) => (
        <tr key={data.product_id + index} className={styles.tableDataRow}>
            <td key={data.product_id + index + '0'}>{data.stock}</td>
            <td key={data.product_id + index + '1'}>{data.type}</td>
            <td key={data.product_id + index + '2'}>{data.name}</td>
            <td key={data.product_id + index + '3'}>{data.brand}</td>
            <td key={data.product_id + index + '4'}>{data.model}</td>
            <td key={data.product_id + index + '5'}>{data.product_id}</td>
            <td key={data.product_id + index + '6'}>{data.supplier_price}</td>
            <td key={data.product_id + index + '7'}>{data.store_price}</td>
        </tr>
    ))

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
                            <div className={styles.titleContainer}>
                                <h1>Inventory</h1>
                            </div>
                            {/* <p>{JSON.stringify(inventory_db)}</p> */}
                            <input
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Search"
                                type="text"
                            />
                            <div className={styles.tableContainer}>
                                <table
                                    // className="aicsdatatable"
                                    // style={{ fontSize: zoomValue.toString() + 'rem' }}
                                    cellSpacing={0}
                                >
                                    <tbody>
                                        <tr>
                                            <th colSpan={1}>STOCK</th>
                                            <th colSpan={1}>TYPE</th>
                                            <th colSpan={1}>NAME</th>
                                            <th colSpan={1}>BRAND</th>
                                            <th colSpan={1}>MODEL</th>
                                            <th colSpan={1}>PRODUCT ID</th>
                                            <th colSpan={1}>SUPPLIER PRICE</th>
                                            <th colSpan={1}>STORE PRICE</th>
                                        </tr>
                                        {dataRow}
                                    </tbody>
                                </table>
                            </div>
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
