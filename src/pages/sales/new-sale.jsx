import styles from '@/styles/NewSale.module.css'
import Head from 'next/head'
import generalInfo from '../../../general-info'
import Navbar from '@/components/Navbar'
import { useEffect, useState } from 'react'
import { useAuthContext } from '@/context/AuthContext'
import { useRouter } from 'next/router'
import { useSettingsContext } from '@/context/SettingsContext'
import clientPromise from '@/lib/mongodb/mongodb'

export default function NewSale({ inventory_db, result_count }) {
    const router = useRouter()
    const { authUser, signOut, isLoading } = useAuthContext()
    const { view } = useSettingsContext()

    useEffect(() => {
        if (!authUser) {
            router.push('/user/login')
        }
    }, [authUser]) // eslint-disable-line react-hooks/exhaustive-deps

    const [dateNow, setDateNow] = useState(new Date(Date.now()))
    const [viewResults, setViewResults] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [formContent, setFormContent] = useState({
        items: [],
        contact_number: '',
        date_sold: null,
        total_amount: 0,
        total_paid: 0,
        total_balance: 0,
        recorded_by: '',
        customer_name: '',
    })
    const { contact_number, customer_name } = formContent
    const [currentItem, setCurrentItem] = useState({
        product_id: '',
        type: '',
        quantity: 0,
        returns: 0,
        change_item: 0,
        price: 0,
        amount: 0,
        paid: 0,
        balance: 0,
        cost: 0,
        gross_income: 0,
        payment_method: '',
        delivery_info: [],
    })
    const {
        product_id,
        type,
        quantity,
        returns,
        change_item,
        price,
        amount,
        paid,
        balance,
        cost,
        gross_income,
        payment_method,
        delivery_info,
    } = currentItem

    const onCustomerChange = (e) => {
        setFormContent((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    useEffect(() => {
        try {
            router.push({
                pathname: '/sales/new-sale',
                query: {
                    ...(searchText && { search: searchText }),
                },
            })
        } catch (e) {
            console.log(e)
        }
    }, [searchText]) // eslint-disable-line react-hooks/exhaustive-deps
    const searchTextChange = (e) => {
        setSearchText(e.target.value.toUpperCase())
    }
    const clearSearch = (e) => {
        e.preventDefault()
        setSearchText('')
    }

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
                                <h1>New Sale - {result_count}</h1>
                                <h2>{dateNow.toDateString()}</h2>
                            </div>
                            <p>{JSON.stringify(formContent, null, 4)}</p>

                            <form className={styles.formContainer}>
                                <h2>Customer Info</h2>
                                <div className={styles.formGroupRow}>
                                    <input
                                        value={customer_name}
                                        id="customer_name"
                                        onChange={onCustomerChange}
                                        type="text"
                                        placeholder="Customer Name"
                                    />
                                    <input
                                        value={contact_number}
                                        id="contact_number"
                                        onChange={onCustomerChange}
                                        type="text"
                                        placeholder="Contact Number"
                                    />
                                </div>
                                <h2>Items</h2>
                                <div>
                                    <input
                                        className={styles.searchInput}
                                        value={searchText}
                                        onChange={searchTextChange}
                                        onBlur={() => setViewResults(false)}
                                        onFocus={() => setViewResults(true)}
                                        placeholder="Search"
                                        type="text"
                                    />
                                    <button
                                        // className={styles.clearButton}
                                        onClick={clearSearch}
                                    >
                                        Clear Search
                                    </button>

                                    {result_count !== 0 && (
                                        <div
                                            className={
                                                styles.searchResultsContainer
                                            }
                                            hidden={!viewResults}
                                        >
                                            {inventory_db.map((itm, idx) => (
                                                <div
                                                    key={
                                                        idx +
                                                        itm.product_id +
                                                        'res'
                                                    }
                                                >
                                                    <p
                                                        key={
                                                            idx +
                                                            itm.product_id +
                                                            'res1'
                                                        }
                                                    >
                                                        {itm.name} -{' '}
                                                        {'Stock:' + itm.stock}
                                                    </p>

                                                    <button
                                                        key={
                                                            idx +
                                                            itm.product_id +
                                                            'res'
                                                        }
                                                        disabled={
                                                            itm.stock === 0
                                                        }
                                                        onClick={(e) =>
                                                            e.preventDefault()
                                                        }
                                                    >
                                                        Add Item
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <p>
                                        SampleSampleSampleSampleSampleSampleSampleSampleSampleSampleSample
                                        SampleSampleSampleSampleSampleSampleSampleSample
                                    </p>
                                </div>
                            </form>
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
        const data = await db.collection('inventory').find({
            $or: [
                {
                    name: {
                        $regex: '^' + query.search,
                    },
                },
                {
                    model: {
                        $regex: '^' + query.search,
                    },
                },
                {
                    brand: {
                        $regex: '^' + query.search,
                    },
                },
                {
                    product_id: {
                        $regex: '^' + query.search,
                    },
                },
            ],
        })

        const limit = '10'
        const sort = 'name'
        const asc = '1'
        const page = '1'
        const data_fetched = await data
            .sort(sort ? { [sort]: Number(asc) } : { name: 1 })
            .skip(Number(page) > 0 ? (Number(page) - 1) * Number(limit) : 0)
            .limit(Number(limit))
            .toArray()

        const datacount = await db.collection('inventory').countDocuments({
            $or: [
                {
                    name: {
                        $regex: '^' + query.search,
                    },
                },
                {
                    model: {
                        $regex: '^' + query.search,
                    },
                },
                {
                    brand: {
                        $regex: '^' + query.search,
                    },
                },
                {
                    product_id: {
                        $regex: '^' + query.search,
                    },
                },
            ],
        })

        return {
            props: {
                inventory_db: JSON.parse(JSON.stringify(data_fetched)),
                result_count: datacount,
            },
        }
    } catch (e) {
        console.log('getServerSideProps error >>>', e)
    }
}
