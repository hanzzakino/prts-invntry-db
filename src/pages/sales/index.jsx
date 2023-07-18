import { useAuthContext } from '@/context/AuthContext'
import styles from '@/styles/Sales.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Head from 'next/head'
import generalInfo from '../../../general-info'
import clientPromise from '@/lib/mongodb/mongodb'
import {
    BsChevronDoubleLeft,
    BsChevronDoubleRight,
    BsFillCaretUpFill,
    BsFillCaretDownFill,
} from 'react-icons/bs'

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

    const [sorter, setSorter] = useState({
        sort: '',
        asc: 1,
    })
    const [currentPage, setCurrentPage] = useState(1)

    const dataDisplayLimit = 20
    const paginationLength = 7 //Odd Numbers only
    const pagrightlen = Math.floor(paginationLength / 2)
    const totalPage = Math.ceil(result_count / dataDisplayLimit)
    const pagination = [
        ...Array(totalPage < paginationLength ? totalPage : paginationLength),
    ].map((x, i) =>
        currentPage - pagrightlen - 1 > 0 ? (
            currentPage - pagrightlen + i <= totalPage ? (
                <div key={i}>
                    <a
                        onClick={() =>
                            setCurrentPage((prevState) =>
                                Number(prevState - pagrightlen + i)
                            )
                        }
                        key={i + 'a'}
                    >
                        <div
                            key={i + 'abb'}
                            className={
                                currentPage - pagrightlen + i === currentPage &&
                                styles.selectedPage
                            }
                        >
                            {currentPage - pagrightlen + i}
                        </div>
                    </a>
                </div>
            ) : (
                ''
            )
        ) : (
            <div key={i}>
                <a onClick={() => setCurrentPage(Number(i + 1))} key={i + 'a'}>
                    <div
                        key={i + 'abb'}
                        className={i + 1 === currentPage && styles.selectedPage}
                    >
                        {i + 1}
                    </div>
                </a>
            </div>
        )
    )

    useEffect(() => {
        try {
            router.push({
                pathname: '/sales',
                query: {
                    page: currentPage,
                    ...(sorter.sort && {
                        sort: sorter.sort,
                        asc: sorter.asc,
                    }),
                },
            })
        } catch (e) {
            console.log(e)
        }
    }, [sorter, currentPage]) // eslint-disable-line react-hooks/exhaustive-deps

    const sortClick = (e) => {
        if (e.target.id === sorter.sort) {
            setSorter((prevState) => ({
                ...prevState,
                asc: prevState.asc * -1,
            }))
        } else {
            setSorter((prevState) => ({
                ...prevState,
                sort: e.target.id,
            }))
        }
    }

    const [zoomValue, setZoomValue] = useState(0.8)
    const [dateNow, setDateNow] = useState(new Date(Date.now()))

    const dataRow = (accessParam) => {
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
                {accessParam === 'admin' && (
                    <td key={data.branch + index + '0h'}>{data.branch}</td>
                )}
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
                                <div className={styles.paginationContainer}>
                                    <button onClick={() => setCurrentPage(1)}>
                                        <BsChevronDoubleLeft />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setCurrentPage((prevState) =>
                                                prevState === 1
                                                    ? 1
                                                    : prevState - 1
                                            )
                                        }
                                    >
                                        Previous
                                    </button>
                                    {pagination}
                                    <button
                                        onClick={() =>
                                            setCurrentPage((prevState) =>
                                                prevState === totalPage
                                                    ? totalPage
                                                    : prevState + 1
                                            )
                                        }
                                    >
                                        Next
                                    </button>
                                    <button
                                        onClick={() =>
                                            setCurrentPage(totalPage)
                                        }
                                    >
                                        <BsChevronDoubleRight />
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
                                                <span
                                                    onClick={sortClick}
                                                    id="date_sold"
                                                >
                                                    DATE
                                                    {sorter.sort ===
                                                    'date_sold' ? (
                                                        sorter.asc === -1 ? (
                                                            <BsFillCaretUpFill id="caretIcon" />
                                                        ) : (
                                                            <BsFillCaretDownFill id="caretIcon" />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span
                                                    onClick={sortClick}
                                                    id="customer_name"
                                                >
                                                    CUSTOMER NAME
                                                    {sorter.sort ===
                                                    'customer_name' ? (
                                                        sorter.asc === -1 ? (
                                                            <BsFillCaretUpFill id="caretIcon" />
                                                        ) : (
                                                            <BsFillCaretDownFill id="caretIcon" />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span
                                                    onClick={sortClick}
                                                    id="contact_number"
                                                >
                                                    CONTACT NUMBER
                                                    {sorter.sort ===
                                                    'contact_number' ? (
                                                        sorter.asc === -1 ? (
                                                            <BsFillCaretUpFill id="caretIcon" />
                                                        ) : (
                                                            <BsFillCaretDownFill id="caretIcon" />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span
                                                    onClick={sortClick}
                                                    id="items.product_id"
                                                >
                                                    PRODUCT ID
                                                    {sorter.sort ===
                                                    'items.product_id' ? (
                                                        sorter.asc === -1 ? (
                                                            <BsFillCaretUpFill id="caretIcon" />
                                                        ) : (
                                                            <BsFillCaretDownFill id="caretIcon" />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span
                                                    onClick={sortClick}
                                                    id="items.type"
                                                >
                                                    TYPE
                                                    {sorter.sort ===
                                                    'items.type' ? (
                                                        sorter.asc === -1 ? (
                                                            <BsFillCaretUpFill id="caretIcon" />
                                                        ) : (
                                                            <BsFillCaretDownFill id="caretIcon" />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span
                                                    onClick={sortClick}
                                                    id="items.price"
                                                >
                                                    PRICE
                                                    {sorter.sort ===
                                                    'items.price' ? (
                                                        sorter.asc === -1 ? (
                                                            <BsFillCaretUpFill id="caretIcon" />
                                                        ) : (
                                                            <BsFillCaretDownFill id="caretIcon" />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span
                                                    onClick={sortClick}
                                                    id="items.quantity"
                                                >
                                                    QTY
                                                    {sorter.sort ===
                                                    'items.quantity' ? (
                                                        sorter.asc === -1 ? (
                                                            <BsFillCaretUpFill id="caretIcon" />
                                                        ) : (
                                                            <BsFillCaretDownFill id="caretIcon" />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span
                                                    onClick={sortClick}
                                                    id="items.change_item"
                                                >
                                                    CI
                                                    {sorter.sort ===
                                                    'items.change_item' ? (
                                                        sorter.asc === -1 ? (
                                                            <BsFillCaretUpFill id="caretIcon" />
                                                        ) : (
                                                            <BsFillCaretDownFill id="caretIcon" />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span
                                                    onClick={sortClick}
                                                    id="items.return_item"
                                                >
                                                    RI
                                                    {sorter.sort ===
                                                    'items.return_item' ? (
                                                        sorter.asc === -1 ? (
                                                            <BsFillCaretUpFill id="caretIcon" />
                                                        ) : (
                                                            <BsFillCaretDownFill id="caretIcon" />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span
                                                    onClick={sortClick}
                                                    id="items.amount"
                                                >
                                                    AMOUNT
                                                    {sorter.sort ===
                                                    'items.amount' ? (
                                                        sorter.asc === -1 ? (
                                                            <BsFillCaretUpFill id="caretIcon" />
                                                        ) : (
                                                            <BsFillCaretDownFill id="caretIcon" />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span
                                                    onClick={sortClick}
                                                    id="items.paid"
                                                >
                                                    PAID
                                                    {sorter.sort ===
                                                    'items.paid' ? (
                                                        sorter.asc === -1 ? (
                                                            <BsFillCaretUpFill id="caretIcon" />
                                                        ) : (
                                                            <BsFillCaretDownFill id="caretIcon" />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span
                                                    onClick={sortClick}
                                                    id="items.balance"
                                                >
                                                    BALANCE
                                                    {sorter.sort ===
                                                    'items.balance' ? (
                                                        sorter.asc === -1 ? (
                                                            <BsFillCaretUpFill id="caretIcon" />
                                                        ) : (
                                                            <BsFillCaretDownFill id="caretIcon" />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span
                                                    onClick={sortClick}
                                                    id="items.cost"
                                                >
                                                    COST
                                                    {sorter.sort ===
                                                    'items.cost' ? (
                                                        sorter.asc === -1 ? (
                                                            <BsFillCaretUpFill id="caretIcon" />
                                                        ) : (
                                                            <BsFillCaretDownFill id="caretIcon" />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span
                                                    onClick={sortClick}
                                                    id="items.gross_income"
                                                >
                                                    GI
                                                    {sorter.sort ===
                                                    'items.gross_income' ? (
                                                        sorter.asc === -1 ? (
                                                            <BsFillCaretUpFill id="caretIcon" />
                                                        ) : (
                                                            <BsFillCaretDownFill id="caretIcon" />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span
                                                    onClick={sortClick}
                                                    id="items.payment_method"
                                                >
                                                    PAYMENT METHOD
                                                    {sorter.sort ===
                                                    'items.payment_method' ? (
                                                        sorter.asc === -1 ? (
                                                            <BsFillCaretUpFill id="caretIcon" />
                                                        ) : (
                                                            <BsFillCaretDownFill id="caretIcon" />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span
                                                    onClick={sortClick}
                                                    id="items.delivery"
                                                >
                                                    DELIVERY
                                                    {sorter.sort ===
                                                    'items.delivery' ? (
                                                        sorter.asc === -1 ? (
                                                            <BsFillCaretUpFill id="caretIcon" />
                                                        ) : (
                                                            <BsFillCaretDownFill id="caretIcon" />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </span>
                                            </th>
                                            <th colSpan={1}>
                                                <span
                                                    onClick={sortClick}
                                                    id="recorded_by"
                                                >
                                                    RECORDED BY
                                                    {sorter.sort ===
                                                    'recorded_by' ? (
                                                        sorter.asc === -1 ? (
                                                            <BsFillCaretUpFill id="caretIcon" />
                                                        ) : (
                                                            <BsFillCaretDownFill id="caretIcon" />
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </span>
                                            </th>
                                            {authUser.access === 'admin' && (
                                                <th colSpan={1}>
                                                    <span
                                                        onClick={sortClick}
                                                        id="branch"
                                                    >
                                                        BRANCH
                                                        {sorter.sort ===
                                                        'branch' ? (
                                                            sorter.asc ===
                                                            -1 ? (
                                                                <BsFillCaretUpFill id="caretIcon" />
                                                            ) : (
                                                                <BsFillCaretDownFill id="caretIcon" />
                                                            )
                                                        ) : (
                                                            ''
                                                        )}
                                                    </span>
                                                </th>
                                            )}
                                        </tr>
                                        {dataRow(authUser.access)}
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

        const limit = '20'

        const data_fetched = await data
            .sort(
                query.sort
                    ? { [query.sort]: Number(query.asc) }
                    : { date_sold: -1 }
            )
            .skip(
                Number(query.page) > 0
                    ? (Number(query.page) - 1) * Number(limit)
                    : 0
            )
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
