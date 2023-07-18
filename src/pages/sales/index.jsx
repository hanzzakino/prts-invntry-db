import { useAuthContext } from '@/context/AuthContext'
import styles from '@/styles/Sales.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Head from 'next/head'
import generalInfo from '../../../general-info'
import clientPromise from '@/lib/mongodb/mongodb'

export default function Sales({ sales_db, result_count }) {
    /////////////////////////
    const router = useRouter()
    const { authUser, isLoading } = useAuthContext()
    useEffect(() => {
        if (!authUser) {
            router.push('/user/login')
        }
    }, [authUser]) // eslint-disable-line react-hooks/exhaustive-deps
    /////////////////////////

    const [zoomValue, setZoomValue] = useState(0.8)
    const [dateNow, setDateNow] = useState(new Date(Date.now()))

    const dataRow = () => {
        return sales_db.map((data, index) => (
            <tr
                key={data.items.product_id + index}
                className={
                    styles.tableDataRow +
                    ' ' +
                    (data.stock === 0 && styles.noStock)
                }
            >
                <td key={data.date_sold + index + '01'}>
                    {new Date(data.date_sold).toLocaleDateString()}
                </td>
                <td key={data.customer_name + index + '02'}>
                    {data.customer_name}
                </td>
                <td key={data.contact_number + index + '03'}>
                    {data.contact_number}
                </td>
                <td key={data.items.product_id + index + '04'}>
                    {data.items.product_id}
                </td>
                <td key={data.items.type + index + '05'}>{data.items.type}</td>
                <td key={data.items.price + index + '06'}>
                    {data.items.price}
                </td>
                <td key={data.items.quantity + index + '07'}>
                    {data.items.quantity}
                </td>
                <td key={data.items.change_item + index + '08'}>
                    {data.items.change_item}
                </td>
                <td key={data.items.return_item + index + '09'}>
                    {data.items.return_item}
                </td>
                <td key={data.items.amount + index + '0a'}>
                    {data.items.amount}
                </td>
                <td key={data.items.paid + index + '0b'}>{data.items.paid}</td>
                <td key={data.items.balance + index + '0c'}>
                    {data.items.balance}
                </td>
                <td key={data.items.cost + index + '0d'}>{data.items.cost}</td>
                <td key={data.items.gross_income + index + '0e'}>
                    {data.items.gross_income}
                </td>
                <td key={data.items.payment_method + index + '0f'}>
                    {data.items.payment_method}
                </td>
                <td key={data.items.delivery + index + '0g'}>
                    {data.items.delivery === ''
                        ? 'WALK-IN'
                        : data.items.delivery}
                </td>
                <td key={data.recorded_by + index + '0h'}>
                    {data.recorded_by}
                </td>
            </tr>
        ))
    }

    return (
        <>
            <Head>
                <title>{generalInfo.appName} | Sales</title>
            </Head>
            {!isLoading && authUser ? (
                <main className="pagecontainer">
                    <Navbar />
                    <div className="mainContainer">
                        <div className={styles.container}>
                            <div className={styles.titleContainer}>
                                <h1>Sales {result_count}</h1>
                                <h2>{dateNow.toDateString()}</h2>
                            </div>

                            <div className={styles.controlContainer}>
                                <div>
                                    <button
                                        onClick={() =>
                                            setZoomValue((prev) => prev + 0.2)
                                        }
                                    >
                                        +
                                    </button>
                                    <button onClick={() => setZoomValue(0.8)}>
                                        Reset Zoom
                                    </button>
                                    <button
                                        onClick={() =>
                                            setZoomValue((prev) => prev - 0.2)
                                        }
                                    >
                                        -
                                    </button>
                                </div>
                            </div>
                            <div className={styles.tableContainer}>
                                <table
                                    style={{
                                        fontSize: zoomValue.toString() + 'rem',
                                    }}
                                    cellSpacing={0}
                                >
                                    <tbody>
                                        <tr>
                                            <th colSpan={1}>
                                                <span id="date_sold">DATE</span>
                                            </th>
                                            <th colSpan={1}>
                                                <span id="customer_name">
                                                    CUSTOMER NAME
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span id="contact_number">
                                                    CONTACT NUMBER
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span id="product_id">
                                                    PRODUCT ID
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span id="type">TYPE</span>
                                            </th>
                                            <th colSpan={1}>
                                                <span id="price">PRICE</span>
                                            </th>
                                            <th colSpan={1}>
                                                <span id="quantity">QTY</span>
                                            </th>
                                            <th colSpan={1}>
                                                <span id="change_item">CI</span>
                                            </th>
                                            <th colSpan={1}>
                                                <span id="return_item">RI</span>
                                            </th>
                                            <th colSpan={1}>
                                                <span id="amount">AMOUNT</span>
                                            </th>
                                            <th colSpan={1}>
                                                <span id="paid">PAID</span>
                                            </th>
                                            <th colSpan={1}>
                                                <span id="balance">
                                                    BALANCE
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span id="cost">COST</span>
                                            </th>
                                            <th colSpan={1}>
                                                <span id="gross_income">
                                                    GI
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span id="payment_method">
                                                    PAYMENT METHOD
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span id="delivery">
                                                    DELIVERY
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span id="recorded_by">
                                                    RECORDED BY
                                                </span>
                                            </th>
                                        </tr>
                                        {dataRow()}
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

        const data = await db.collection('sales-record').aggregate([
            {
                $unwind: { path: '$items' },
            },
        ])

        const sort = 'date_sold'
        const asc = '-1'
        const page = '1'
        const limit = '20'
        const data_fetched = await data
            .sort(sort ? { [sort]: Number(asc) } : { date_sold: 1 })
            .skip(Number(page) > 0 ? (Number(page) - 1) * Number(limit) : 0)
            .limit(Number(limit))
            .toArray()

        const datacount = await db
            .collection('sales-record')
            .aggregate([
                {
                    $unwind: { path: '$items' },
                },
                {
                    $count: 'documentCount',
                },
            ])
            .toArray()

        return {
            props: {
                sales_db: JSON.parse(JSON.stringify(data_fetched)),
                result_count: JSON.parse(JSON.stringify(datacount))[0]
                    .documentCount,
            },
        }
    } catch (e) {
        console.log('getServerSideProps error >>>', e)
    }
}
