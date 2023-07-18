import { useAuthContext } from '@/context/AuthContext'
import { useSettingsContext } from '@/context/SettingsContext'
import styles from '@/styles/Inventory.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Head from 'next/head'
import generalInfo from '../../../general-info'
import clientPromise from '@/lib/mongodb/mongodb'
import {
    BsFillCaretUpFill,
    BsFillCaretDownFill,
    BsChevronDoubleLeft,
    BsChevronDoubleRight,
} from 'react-icons/bs'

export default function Inventory({ inventory_db, result_count }) {
    const router = useRouter()
    const { authUser, signOut, isLoading } = useAuthContext()
    const { view } = useSettingsContext()
    const [zoomValue, setZoomValue] = useState(0.8)
    const [searchText, setSearchText] = useState('')
    const [filterSeach, setFilterSeach] = useState({
        filter: '',
        filterValue: '',
    })
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
        if (!authUser) {
            router.push('/user/login')
        }
    }, [authUser]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        try {
            router.push({
                pathname: '/inventory',
                query: {
                    page: currentPage,
                    ...(filterSeach.filter &&
                        filterSeach.filterValue && {
                            filter: filterSeach.filter.toLowerCase(),
                            filterval: encodeURIComponent(
                                filterSeach.filterValue
                            ),
                        }),
                    ...(searchText && { search: searchText }),
                    ...(sorter.sort && {
                        sort: sorter.sort,
                        asc: sorter.asc,
                    }),
                },
            })
        } catch (e) {
            console.log(e)
        }
    }, [searchText, filterSeach, sorter, currentPage]) // eslint-disable-line react-hooks/exhaustive-deps

    const clearSearch = () => {
        setSearchText('')
        setFilterSeach({
            filter: '',
            filterValue: '',
        })
        setCurrentPage(1)
        setSorter({
            sort: '',
            asc: 1,
        })
    }

    const searchTextChange = (e) => {
        setSearchText(e.target.value.toUpperCase())
        setCurrentPage(1)
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
        setCurrentPage(1)
    }
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

    const dataRow = (accessParam) => {
        return inventory_db.map((data, index) => (
            <tr
                key={data.product_id + index}
                className={
                    styles.tableDataRow +
                    ' ' +
                    (data.stock === 0 && styles.noStock)
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
                {accessParam === 'admin' && (
                    <td key={data.product_id + index + '6'}>
                        {data.supplier_price}
                    </td>
                )}
                <td key={data.product_id + index + '7'}>{data.store_price}</td>
            </tr>
        ))
    }

    return (
        <>
            <Head>
                <title>{generalInfo.appName} | Inventory</title>
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
                                <button
                                    className={styles.clearButton}
                                    onClick={clearSearch}
                                >
                                    Clear Search
                                </button>
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
                                                    id="stock"
                                                >
                                                    STOCK
                                                    {sorter.sort === 'stock' ? (
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
                                                    id="type"
                                                >
                                                    TYPE
                                                    {sorter.sort === 'type' ? (
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
                                                    id="name"
                                                >
                                                    NAME
                                                    {sorter.sort === 'name' ? (
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
                                                    id="brand"
                                                >
                                                    BRAND
                                                    {sorter.sort === 'brand' ? (
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
                                                    id="model"
                                                >
                                                    MODEL
                                                    {sorter.sort === 'model' ? (
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
                                                    id="product_id"
                                                >
                                                    PRODUCT_ID
                                                    {sorter.sort ===
                                                    'product_id' ? (
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
                                                        id="supplier_price"
                                                    >
                                                        SUPPLIER PRICE
                                                        {sorter.sort ===
                                                        'supplier_price' ? (
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
                                            <th colSpan={1}>
                                                <span
                                                    onClick={sortClick}
                                                    id="store_price"
                                                >
                                                    STORE PRICE
                                                    {sorter.sort ===
                                                    'store_price' ? (
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

        const limit = '20'
        const data_fetched = await data
            .sort(
                query.sort ? { [query.sort]: Number(query.asc) } : { name: 1 }
            )
            .skip(
                Number(query.page) > 0
                    ? (Number(query.page) - 1) * Number(limit)
                    : 0
            )
            .limit(Number(limit))
            .toArray()

        const datacount = await db.collection('inventory').countDocuments({
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
