import styles from '@/styles/Navbar.module.css'
import { useAuthContext } from '@/context/AuthContext'
import { useSettingsContext } from '@/context/SettingsContext'
import generalInfo from '../../general-info'
import { useRouter } from 'next/router'

export default function Navbar() {
    const router = useRouter()
    const { signOut } = useAuthContext()
    const { setViewPanel, view } = useSettingsContext()

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div>
                    <h1>{generalInfo.storeName}</h1>
                    <h2>{generalInfo.appName}</h2>
                </div>
                <div className={styles.navbarViews}>
                    <button onClick={() => router.push('/')}>Dashboard</button>
                    <button
                        onClick={() =>
                            router.push({
                                pathname: '/inventory',
                                query: {
                                    page: 1,
                                },
                            })
                        }
                    >
                        Inventory
                    </button>
                    <button
                        onClick={() => {
                            const dateNow = new Date()
                            dateNow.setHours(0, 0, 0, 0)
                            router.push({
                                pathname: '/sales',
                                query: {
                                    page: 1,
                                    date: dateNow.getTime(),
                                },
                            })
                        }}
                    >
                        Sales Record
                    </button>
                    <button disabled>Purchases Record</button>
                    <button disabled>Expenses Record</button>
                </div>
                <div className={styles.navbarViews}>
                    <button onClick={() => router.push('/sales/new-sale')}>
                        New Sale
                    </button>
                    <button disabled>New Purchase</button>
                    <button disabled>New Expense</button>
                </div>
                <div className={styles.navbarFooter}>
                    <button disabled>Settings</button>
                    <button onClick={signOut}>Logout</button>
                </div>
            </nav>
        </div>
    )
}
