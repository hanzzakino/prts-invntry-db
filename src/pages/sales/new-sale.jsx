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

    const onCustomerChange = (e) => {
        setFormContent((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }
    const onReset = () => {
        setFormContent({
            items: [],
            contact_number: '',
            date_sold: null,
            total_amount: 0,
            total_paid: 0,
            total_balance: 0,
            recorded_by: '',
            customer_name: '',
        })
        setSearchText('')
    }
    // const editItem = (item_pid) => {
    //     let itmToEdit = formContent.items.filter(itm => itm.product_id===item_pid)
    // }
    useEffect(() => {
        let totalAmt = 0
        formContent.items.forEach((itm) => (totalAmt += itm.amount))
        let totalPd = 0
        formContent.items.forEach((itm) => (totalPd += itm.paid))
        setFormContent((prevState) => ({
            ...prevState,
            total_amount: totalAmt,
            total_paid: totalPd,
            total_balance: totalAmt - totalPd,
        }))
    }, [formContent.items])
    const editQuantity = (e) => {
        const dupls = formContent.items.filter(
            (im) => im.product_id === e.target.id
        )
        // console.log('duplicate')
        const nondupls = formContent.items.filter(
            (im) => im.product_id !== e.target.id
        )
        // console.log(dupls)
        const newFromDupls = {
            ...dupls[0],
            product_id: dupls[0].product_id,
            type: dupls[0].type,
            quantity: Number(e.target.value),
            amount: dupls[0].price * Number(e.target.value),
            balance: dupls[0].price * Number(e.target.value),
        }
        setFormContent((prevState) => ({
            ...prevState,
            items: [...nondupls, newFromDupls],
        }))
    }
    const addNewItem = (item) => {
        const dupls = formContent.items.filter(
            (im) => im.product_id === item.product_id
        )
        if (dupls.length > 0) {
            // console.log('duplicate')
            const nondupls = formContent.items.filter(
                (im) => im.product_id !== item.product_id
            )
            // console.log(dupls)
            const newFromDupls = {
                ...dupls[0],
                product_id: dupls[0].product_id,
                type: dupls[0].type,
                quantity: dupls[0].quantity + 1,
                amount: item.store_price * (dupls[0].quantity + 1),
                balance: item.store_price * (dupls[0].quantity + 1),
            }
            setFormContent((prevState) => ({
                ...prevState,
                items: [...nondupls, newFromDupls],
            }))
        } else {
            setFormContent((prevState) => ({
                ...prevState,
                items: [
                    ...prevState.items,
                    {
                        product_id: item.product_id,
                        type: item.type,
                        tempItemDetail: item,
                        quantity: 1,
                        returns: 0,
                        change_item: 0,
                        price: item.store_price,
                        amount: item.store_price,
                        paid: 0,
                        balance: item.store_price,
                        cost: 0,
                        gross_income: 0,
                        payment_method: '',
                        delivery_info: [],
                    },
                ],
            }))
        }
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
                                <h1>
                                    New Sale - {result_count} -{' '}
                                    {formContent.total_amount}
                                </h1>
                                <h2>{dateNow.toDateString()}</h2>
                            </div>
                            <button onClick={onReset}>Reset Form</button>
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
                                <div
                                    onBlur={() => setViewResults(false)}
                                    onFocus={() => setViewResults(true)}
                                >
                                    <input
                                        className={styles.searchInput}
                                        value={searchText}
                                        onChange={searchTextChange}
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
                                                styles.searchResultsContainer +
                                                ' ' +
                                                (!viewResults &&
                                                    styles.hiddenResults)
                                            }
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
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            addNewItem(itm)
                                                        }}
                                                    >
                                                        Add Item
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <p>{JSON.stringify(formContent, null, 4)}</p>
                                {formContent.items.map((item, idx) => (
                                    <div
                                        className={styles.itemContainer}
                                        key={item.product_id + idx + 'itemlist'}
                                    >
                                        <span
                                            key={
                                                item.product_id +
                                                idx +
                                                'itemlist2a'
                                            }
                                        >
                                            <p
                                                key={
                                                    item.product_id +
                                                    idx +
                                                    'itemlist2'
                                                }
                                            >
                                                {item.product_id}&nbsp;-&nbsp;
                                                {item.tempItemDetail.name}
                                            </p>
                                        </span>
                                        <span
                                            key={
                                                item.product_id +
                                                idx +
                                                'itemlist2b'
                                            }
                                        >
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                id={item.product_id}
                                                onChange={editQuantity}
                                            />
                                            <p
                                                key={
                                                    item.product_id +
                                                    idx +
                                                    'itemlist3'
                                                }
                                            >
                                                {item.price}
                                                {' | '}
                                                {item.quantity}
                                                {' | '}
                                                {item.amount}
                                            </p>
                                        </span>
                                    </div>
                                ))}
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
