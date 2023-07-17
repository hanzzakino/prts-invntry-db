import styles from '@/styles/NewSale.module.css'
import Head from 'next/head'
import generalInfo from '../../../general-info'
import Navbar from '@/components/Navbar'
import { useEffect, useState } from 'react'
import { useAuthContext } from '@/context/AuthContext'
import { useRouter } from 'next/router'
import { useSettingsContext } from '@/context/SettingsContext'

export default function NewSale() {
    const router = useRouter()
    const { authUser, signOut, isLoading } = useAuthContext()
    const { view } = useSettingsContext()

    // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!authUser) {
            router.push('/user/login')
        }
    }, [authUser])

    const [dateNow, setDateNow] = useState(new Date(Date.now()))

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
                                <div></div>
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
