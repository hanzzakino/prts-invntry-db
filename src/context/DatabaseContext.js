import { createContext, useContext, useState, useEffect } from 'react'
import NProgress from 'nprogress'
import { toast } from 'react-toastify'

const DatabaseContext = createContext()

export const DatabaseContextWrapper = ({ children }) => {
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
    const onFormReset = () => {
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
        toast.success('Reset Done')
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
                addSale(finalData)
                formContent.items.forEach((itm) => {
                    const newStockData = {
                        stock:
                            itm.returns > 0
                                ? itm.tempItemDetail.stock + itm.returns
                                : itm.tempItemDetail.stock - itm.quantity,
                    }
                    updateInventory(newStockData, itm.tempItemDetail._id)
                })
                toast.success('Sale Recorded')
            } else {
                toast.warn('Fill all input')
            }
        } catch (e) {
            console.log(e)
            toast.error(e)
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
        }
    }

    const addSale = async (data) => {
        NProgress.start()
        try {
            let response = await fetch('/api/add-sale', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
            response = await response.json()
        } catch (e) {
            console.log(e)
        } finally {
            NProgress.done()
        }
    }
    const updateInventory = async (data, id) => {
        try {
            let response = await fetch('/api/update-inventory?id=' + id, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
            response = await response.json()
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <DatabaseContext.Provider
            value={{
                addSale,
                updateInventory,
                formContent,
                setFormContent,
                onFormReset,
                onSubmitClick,
            }}
        >
            {children}
        </DatabaseContext.Provider>
    )
}

export const useDatabaseContext = () => useContext(DatabaseContext)
