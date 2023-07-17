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
    const [zoomValue, setZoomValue] = useState(1)
    const [searchText, setSearchText] = useState('')
    const [filterSeach, setFilterSeach] = useState({
        filter: '',
        filterValue: '',
    })

    // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!authUser) {
            router.push('/user/login')
        }
    }, [authUser])

    // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        try {
            if (
                searchText &&
                (!filterSeach.filter || !filterSeach.filterValue)
            ) {
                router.push({
                    pathname: '/inventory',
                    query: {
                        search: encodeURIComponent(searchText),
                    },
                })
            } else if (
                !searchText &&
                filterSeach.filter &&
                filterSeach.filterValue
            ) {
                router.push({
                    pathname: '/inventory',
                    query: {
                        filter: filterSeach.filter.toLowerCase(),
                        filterval: encodeURIComponent(filterSeach.filterValue),
                    },
                })
            } else if (
                searchText &&
                filterSeach.filter &&
                filterSeach.filterValue
            ) {
                router.push({
                    pathname: '/inventory',
                    query: {
                        search: searchText,
                        filter: filterSeach.filter.toLowerCase(),
                        filterval: encodeURIComponent(filterSeach.filterValue),
                    },
                })
            } else {
                router.push('/inventory')
            }
        } catch (e) {
            console.log(e)
        }
    }, [searchText, filterSeach])

    const searchTextChange = (e) => {
        setSearchText(e.target.value.toUpperCase())
    }
    const searchFilterChange = (e) => {
        if (e.target.id === 'filter') {
            setFilterSeach((prevState) => ({
                ...prevState,
                filter: e.target.value,
            }))
        } else {
            setFilterSeach((prevState) => ({
                ...prevState,
                filterValue: e.target.value.toUpperCase(),
            }))
        }
    }

    const dataRow = inventory_db.map((data, index) => (
        <tr
            key={data.product_id + index}
            className={
                styles.tableDataRow + ' ' + (data.stock === 0 && styles.noStock)
            }
        >
            <td key={data.product_id + index + '0'}>
                {data.stock === 0 ? 'Out of Stock' : data.stock}
            </td>
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
                            <div className={styles.searchContainer}>
                                <p>Search: </p>
                                <input
                                    className={styles.searchInput}
                                    value={searchText}
                                    onChange={searchTextChange}
                                    placeholder="Search"
                                    type="text"
                                />
                                <p>Filter: </p>
                                <select
                                    onChange={searchFilterChange}
                                    id="filter"
                                    value={filterSeach.filter}
                                >
                                    <option value="">NONE</option>
                                    <option value="TYPE">TYPE</option>
                                    <option value="BRAND">BRAND</option>
                                    <option value="MODEL">MODEL</option>
                                </select>
                                {filterSeach.filter !== '' && (
                                    <input
                                        className={styles.filterInput}
                                        value={filterSeach.filterValue}
                                        onChange={searchFilterChange}
                                        placeholder="Filter"
                                        type="text"
                                    />
                                )}
                            </div>

                            <div className={styles.zoomControlContainer}>
                                <button
                                    onClick={() =>
                                        setZoomValue((prev) => prev + 0.2)
                                    }
                                >
                                    +
                                </button>
                                <button onClick={() => setZoomValue(1)}>
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
                            <div className={styles.tableContainer}>
                                <table
                                    style={{
                                        fontSize: zoomValue.toString() + 'rem',
                                    }}
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
        const data = await db.collection('inventory').find({
            $and: [
                query.filter
                    ? {
                          [query.filter]: {
                              $regex: '^' + query.filterval,
                          },
                      }
                    : {},
                query.search
                    ? {
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
                          ],
                      }
                    : {},
            ],
        })

        const page = '1'
        const limit = '3'
        const asscending = '1' // 1 asscending | -1 descending
        const sortBy = 'stock'
        const data_fetched = await data
            .sort({ [sortBy]: Number(asscending) })
            .skip(Number(page) > 0 ? (Number(page) - 1) * Number(limit) : 0)
            .limit(Number(limit))
            .toArray()

        return {
            props: { inventory_db: JSON.parse(JSON.stringify(data_fetched)) },
        }
    } catch (e) {
        console.log('getServerSideProps error >>>', e)
    }
}
