import styles from '@/styles/NewSale.module.css'
import Head from 'next/head'
import generalInfo from '../../../general-info'
import Navbar from '@/components/Navbar'
import { useEffect, useState, useRef } from 'react'
import { useAuthContext } from '@/context/AuthContext'
import { useRouter } from 'next/router'
import { useSettingsContext } from '@/context/SettingsContext'
import clientPromise from '@/lib/mongodb/mongodb'
import { useDatabaseContext } from '@/context/DatabaseContext'
import { BsTrash2 } from 'react-icons/bs'

export default function NewSale({ inventory_db, result_count }) {
    const router = useRouter()
    const { authUser, signOut, isLoading } = useAuthContext()
    const { addNewSale } = useDatabaseContext()
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
        total_amount: 0.0,
        total_paid: 0.0,
        total_balance: 0.0,
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
            total_amount: 0.0,
            total_paid: 0.0,
            total_balance: 0.0,
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
    const quantityChange = (e) => {
        const dupls = formContent.items.filter(
            (im) => im.product_id === e.target.id
        )
        // console.log(dupls[0])
        if (Number(e.target.value) <= dupls[0].tempItemDetail.stock) {
            // console.log('duplicate')
            const nondupls = formContent.items.filter(
                (im) => im.product_id !== e.target.id
            )
            // console.log(dupls)
            const newFromDupls = {
                ...dupls[0],
                quantity:
                    Number(e.target.value) !== 0
                        ? Math.abs(Number(e.target.value))
                        : 1,
                amount:
                    dupls[0].price *
                    (Number(e.target.value) !== 0
                        ? Math.abs(Number(e.target.value))
                        : 1),
                balance:
                    dupls[0].price *
                    (Number(e.target.value) !== 0
                        ? Math.abs(Number(e.target.value))
                        : 1),
            }
            setFormContent((prevState) => ({
                ...prevState,
                items: [...nondupls, newFromDupls],
            }))
        }
    }
    const paidChange = (e) => {
        const dupls = formContent.items.filter(
            (im) => im.product_id === e.target.id
        )

        if (
            Number(e.target.value) <= dupls[0].amount &&
            Number(e.target.value) >= 0
        ) {
            // console.log('duplicate')
            const nondupls = formContent.items.filter(
                (im) => im.product_id !== e.target.id
            )
            // console.log(dupls)
            const newFromDupls = {
                ...dupls[0],
                product_id: dupls[0].product_id,
                type: dupls[0].type,
                paid: Math.abs(Number(e.target.value)),
                balance: dupls[0].amount - Math.abs(Number(e.target.value)),
            }
            setFormContent((prevState) => ({
                ...prevState,
                items: [...nondupls, newFromDupls],
            }))
        }
    }
    const fullyPaymentChange = (e) => {
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
            paid: e.target.checked ? dupls[0].amount : 0,
            balance: e.target.checked ? 0 : dupls[0].amount,
        }
        setFormContent((prevState) => ({
            ...prevState,
            items: [...nondupls, newFromDupls],
        }))
    }
    const paymnentMethodChange = (e) => {
        const dupls = formContent.items.filter(
            (im) => im.product_id === e.target.id
        )
        const nondupls = formContent.items.filter(
            (im) => im.product_id !== e.target.id
        )
        const newFromDupls = {
            ...dupls[0],
            payment_method: e.target.value,
        }
        setFormContent((prevState) => ({
            ...prevState,
            items: [...nondupls, newFromDupls],
        }))
    }
    const deliveryInfoChange = (e) => {
        const dupls = formContent.items.filter(
            (im) => im.product_id === e.target.id
        )
        const nondupls = formContent.items.filter(
            (im) => im.product_id !== e.target.id
        )
        const newFromDupls = {
            ...dupls[0],
            delivery: e.target.value.toUpperCase(),
        }
        setFormContent((prevState) => ({
            ...prevState,
            items: [...nondupls, newFromDupls],
        }))
    }
    const returnChange = (e) => {
        const dupls = formContent.items.filter(
            (im) => im.product_id === e.target.id
        )
        const nondupls = formContent.items.filter(
            (im) => im.product_id !== e.target.id
        )
        const newFromDupls = {
            ...dupls[0],
            returns: e.target.checked ? dupls[0].quantity : 0,
            amount: e.target.checked
                ? -Math.abs(dupls[0].price * dupls[0].quantity)
                : Math.abs(dupls[0].price * dupls[0].quantity),
            balance: e.target.checked
                ? -Math.abs(dupls[0].price * dupls[0].quantity)
                : Math.abs(dupls[0].price * dupls[0].quantity),
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
            if (dupls[0].quantity + 1 <= dupls[0].tempItemDetail.stock) {
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
            }
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
                        paid: 0.0,
                        balance: item.store_price,
                        cost: 0.0,
                        gross_income: 0.0,
                        payment_method: 'CASH',
                        delivery: 'WALK-IN',
                    },
                ],
            }))
        }
    }
    const deleteItem = (e) => {
        const nondupls = formContent.items.filter(
            (im) => im.product_id !== e.target.id
        )
        setFormContent((prevState) => ({
            ...prevState,
            items: [...nondupls],
        }))
    }
    useEffect(() => {
        try {
            router.push({
                pathname: '/sales/new-sale',
                query: {
                    ...(searchText && {
                        search: searchText === 'EMPTY_SEARCH' ? '' : searchText,
                    }),
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
    const ref = useRef(null)
    const firstItemAdd = (e) => {
        e.preventDefault()
        setSearchText('EMPTY_SEARCH')
        ref.current.focus()
    }

    const onSubmitClick = (currentAuthUser) => {
        try {
            if (
                formContent.items.length > 0 &&
                formContent.customer_name !== ''
            ) {
                const finalData = {
                    items: formContent.items,
                    contact_number: formContent.contact_number,
                    date_sold: Number(new Date(Date.now()).getTime()),
                    total_amount: formContent.total_amount,
                    total_paid: formContent.total_paid,
                    total_balance: formContent.total_balance,
                    recorded_by: currentAuthUser.username,
                    branch:
                        currentAuthUser.access === 'admin'
                            ? ''
                            : currentAuthUser.branch,
                    customer_name: formContent.customer_name,
                }
                addNewSale(finalData)
            }
        } catch (e) {
            console.log(e)
        } finally {
            setFormContent({
                items: [],
                contact_number: '',
                date_sold: null,
                total_amount: 0.0,
                total_paid: 0.0,
                total_balance: 0.0,
                recorded_by: '',
                customer_name: '',
            })
            setSearchText('')
        }
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
                                <h1>New Sale</h1>
                                <h2>{dateNow.toDateString()}</h2>
                            </div>

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
                                    <p>Search Item: </p>
                                    <input
                                        ref={ref}
                                        className={styles.searchInput}
                                        value={
                                            searchText === 'EMPTY_SEARCH'
                                                ? ''
                                                : searchText
                                        }
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

                                    {result_count !== 0 ? (
                                        <div
                                            className={
                                                styles.searchResultsContainer +
                                                ' ' +
                                                styles.itemBox +
                                                ' ' +
                                                (!viewResults
                                                    ? styles.hiddenResults
                                                    : '')
                                            }
                                        >
                                            {inventory_db.map((itm, idx) => (
                                                <div
                                                    className={styles.itemBox}
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
                                    ) : (
                                        <></>
                                    )}
                                </div>

                                <div className={styles.itemsContainer}>
                                    {formContent.total_amount !== 0 ? (
                                        <div
                                            className={
                                                styles.itemContainer +
                                                ' ' +
                                                styles.boldContents
                                            }
                                        >
                                            <div className={styles.itemNo}>
                                                <p>Item No.</p>
                                            </div>
                                            <div className={styles.itemInfo}>
                                                <p>PRODUCT ID</p>
                                            </div>
                                            <div className={styles.itemCost}>
                                                <div className={styles.ic1}>
                                                    <p>PRICE</p>
                                                </div>
                                                <div className={styles.ic2}>
                                                    <p>QTY</p>
                                                </div>
                                                <div className={styles.ic3}>
                                                    <p>RETURN</p>
                                                </div>
                                                <div className={styles.ic4}>
                                                    <p>AMOUNT</p>
                                                </div>
                                                <div className={styles.ic5}>
                                                    <p></p>
                                                </div>
                                                <div className={styles.ic6}>
                                                    PAID
                                                </div>
                                                <div className={styles.ic7}>
                                                    <p>METHOD</p>
                                                </div>
                                                <div className={styles.ic8}>
                                                    <p>DELIVERY</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className={
                                                styles.itemContainerEmpty
                                            }
                                        >
                                            <h2>NO ITEM</h2>
                                            <button onClick={firstItemAdd}>
                                                Add Item
                                            </button>
                                        </div>
                                    )}
                                    {formContent.items
                                        .sort((a, b) => {
                                            let fa = a.product_id.toLowerCase(),
                                                fb = b.product_id.toLowerCase()

                                            if (fa < fb) {
                                                return -1
                                            }
                                            if (fa > fb) {
                                                return 1
                                            }
                                            return 0
                                        })
                                        .map((item, idx) => (
                                            <div
                                                className={
                                                    styles.itemContainer +
                                                    ' ' +
                                                    styles.itemBox
                                                }
                                                key={
                                                    item.product_id +
                                                    idx +
                                                    'itemlist'
                                                }
                                            >
                                                <div
                                                    className={styles.itemNo}
                                                    key={
                                                        item.product_id +
                                                        idx +
                                                        'itemlist2f'
                                                    }
                                                >
                                                    <p>{idx + 1}</p>
                                                </div>
                                                <div
                                                    className={styles.itemInfo}
                                                    key={
                                                        item.product_id +
                                                        idx +
                                                        'itemlist2a'
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            styles.itemName1
                                                        }
                                                        key={
                                                            item.product_id +
                                                            idx +
                                                            'itemlistC1A'
                                                        }
                                                    >
                                                        {item.product_id}
                                                    </span>
                                                    <span
                                                        className={
                                                            styles.itemName2
                                                        }
                                                        key={
                                                            item.product_id +
                                                            idx +
                                                            'itemlistC1B'
                                                        }
                                                    >
                                                        {
                                                            item.tempItemDetail
                                                                .name
                                                        }
                                                    </span>
                                                </div>
                                                <div
                                                    key={
                                                        item.product_id +
                                                        idx +
                                                        'itemlist2b'
                                                    }
                                                    className={styles.itemCost}
                                                >
                                                    <div
                                                        key={
                                                            item.product_id +
                                                            idx +
                                                            'itemlistC1'
                                                        }
                                                        className={styles.ic1}
                                                    >
                                                        <p
                                                            key={
                                                                item.product_id +
                                                                idx +
                                                                'itemlist3x'
                                                            }
                                                        >
                                                            {item.price.toFixed(
                                                                2
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div
                                                        key={
                                                            item.product_id +
                                                            idx +
                                                            'itemlistC2'
                                                        }
                                                        className={styles.ic2}
                                                    >
                                                        <label
                                                            key={
                                                                item.product_id +
                                                                idx +
                                                                'itemlistC2A'
                                                            }
                                                            htmlFor={
                                                                item.product_id
                                                            }
                                                        >
                                                            &times;&nbsp;&nbsp;
                                                        </label>
                                                        <input
                                                            key={
                                                                item.product_id +
                                                                idx +
                                                                'itemlist2C2B'
                                                            }
                                                            type="number"
                                                            value={
                                                                item.quantity
                                                            }
                                                            id={item.product_id}
                                                            onChange={
                                                                quantityChange
                                                            }
                                                        />
                                                    </div>
                                                    <div
                                                        key={
                                                            item.product_id +
                                                            idx +
                                                            'itemlistC3'
                                                        }
                                                        className={styles.ic3}
                                                    >
                                                        <input
                                                            key={
                                                                item.product_id +
                                                                idx +
                                                                'itemlistC3A'
                                                            }
                                                            id={item.product_id}
                                                            onChange={
                                                                returnChange
                                                            }
                                                            type="checkbox"
                                                            checked={
                                                                item.returns !==
                                                                    0 &&
                                                                item.amount < 0
                                                            }
                                                        />
                                                    </div>
                                                    <div
                                                        key={
                                                            item.product_id +
                                                            idx +
                                                            'itemlistC4'
                                                        }
                                                        className={styles.ic4}
                                                    >
                                                        <p
                                                            key={
                                                                item.product_id +
                                                                idx +
                                                                'itemlist3c'
                                                            }
                                                        >
                                                            {item.amount.toFixed(
                                                                2
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div
                                                        key={
                                                            item.product_id +
                                                            idx +
                                                            'itemlistC5'
                                                        }
                                                        className={styles.ic5}
                                                    >
                                                        <input
                                                            key={
                                                                item.product_id +
                                                                idx +
                                                                'itemlistC5A'
                                                            }
                                                            id={item.product_id}
                                                            onChange={
                                                                fullyPaymentChange
                                                            }
                                                            type="checkbox"
                                                            checked={
                                                                item.balance ===
                                                                0
                                                            }
                                                        />
                                                    </div>
                                                    <div
                                                        key={
                                                            item.product_id +
                                                            idx +
                                                            'itemlistC6'
                                                        }
                                                        className={styles.ic6}
                                                    >
                                                        <input
                                                            key={
                                                                item.product_id +
                                                                idx +
                                                                'itemlistC6A'
                                                            }
                                                            className={
                                                                styles.payment
                                                            }
                                                            type="number"
                                                            step="0.01"
                                                            value={item.paid}
                                                            id={item.product_id}
                                                            onChange={
                                                                paidChange
                                                            }
                                                        />
                                                    </div>
                                                    <div
                                                        key={
                                                            item.product_id +
                                                            idx +
                                                            'itemlistC7'
                                                        }
                                                        className={styles.ic7}
                                                    >
                                                        <select
                                                            key={
                                                                item.product_id +
                                                                idx +
                                                                'itemlistC7A'
                                                            }
                                                            className={
                                                                styles.method
                                                            }
                                                            value={
                                                                item.payment_method
                                                            }
                                                            id={item.product_id}
                                                            onChange={
                                                                paymnentMethodChange
                                                            }
                                                        >
                                                            <option
                                                                value={'CASH'}
                                                            >
                                                                CASH
                                                            </option>
                                                            <option
                                                                value={'GCASH'}
                                                            >
                                                                GCASH
                                                            </option>
                                                            <option
                                                                value={'OTHER'}
                                                            >
                                                                OTHER
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div
                                                        key={
                                                            item.product_id +
                                                            idx +
                                                            'itemlistC8'
                                                        }
                                                        className={styles.ic8}
                                                    >
                                                        <input
                                                            key={
                                                                item.product_id +
                                                                idx +
                                                                'itemlistC8A1'
                                                            }
                                                            id={item.product_id}
                                                            value={
                                                                item.delivery
                                                            }
                                                            onChange={
                                                                deliveryInfoChange
                                                            }
                                                        />
                                                    </div>
                                                    <div className={styles.ic9}>
                                                        <button
                                                            id={item.product_id}
                                                            onClick={deleteItem}
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    {formContent.total_amount !== 0 && (
                                        <>
                                            <div
                                                className={
                                                    styles.itemContainer +
                                                    ' ' +
                                                    styles.boldContents +
                                                    ' ' +
                                                    styles.borderTop
                                                }
                                            >
                                                <div className={styles.itemNo}>
                                                    <p></p>
                                                </div>
                                                <div
                                                    className={styles.itemInfo}
                                                >
                                                    <p></p>
                                                </div>
                                                <div
                                                    className={styles.itemCost}
                                                >
                                                    <div className={styles.ic1}>
                                                        <p></p>
                                                    </div>
                                                    <div className={styles.ic2}>
                                                        <p>TOTAL:</p>
                                                    </div>
                                                    <div className={styles.ic3}>
                                                        <p></p>
                                                    </div>
                                                    <div className={styles.ic4}>
                                                        <p>
                                                            {
                                                                formContent.total_amount
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className={styles.ic5}>
                                                        <p></p>
                                                    </div>
                                                    <div className={styles.ic6}>
                                                        <p>
                                                            {
                                                                formContent.total_paid
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className={styles.ic7}>
                                                        <p></p>
                                                    </div>
                                                    <div className={styles.ic8}>
                                                        <p></p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className={
                                                    styles.itemContainer +
                                                    ' ' +
                                                    styles.boldContents
                                                }
                                            >
                                                <div className={styles.itemNo}>
                                                    <p></p>
                                                </div>
                                                <div
                                                    className={styles.itemInfo}
                                                >
                                                    <p></p>
                                                </div>
                                                <div
                                                    className={styles.itemCost}
                                                >
                                                    <div className={styles.ic1}>
                                                        <p></p>
                                                    </div>
                                                    <div className={styles.ic2}>
                                                        <p>BALANCE:</p>
                                                    </div>
                                                    <div className={styles.ic3}>
                                                        <p></p>
                                                    </div>
                                                    <div className={styles.ic4}>
                                                        <p>
                                                            {
                                                                formContent.total_balance
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className={styles.ic5}>
                                                        <p></p>
                                                    </div>
                                                    <div className={styles.ic6}>
                                                        <p></p>
                                                    </div>
                                                    <div className={styles.ic7}>
                                                        <p></p>
                                                    </div>
                                                    <div className={styles.ic8}>
                                                        <p></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </form>
                            <div className={styles.submitButtons}>
                                <div>
                                    <button onClick={onReset}>
                                        Reset Form
                                    </button>
                                </div>
                                <div>
                                    <button
                                        onClick={() => {
                                            onSubmitClick(authUser)
                                        }}
                                    >
                                        Record Sale
                                    </button>
                                </div>
                            </div>
                            {/* <p>{JSON.stringify(formContent, null, 2)}</p> */}
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
