import styles from '@/styles/Navbar.module.css'
import { useAuthContext } from '@/context/AuthContext'
import { useSettingsContext } from '@/context/SettingsContext'
import generalInfo from '../../../general-info'

export default function Navbar() {
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
                    <button onClick={() => setViewPanel('')}>Dashboard</button>
                    <button onClick={() => setViewPanel('Inventory')}>
                        Inventory
                    </button>
                    <button>Sales Record</button>
                    <button>Purchases Record</button>
                </div>
                <div className={styles.navbarViews}>
                    <button onClick={() => setViewPanel('New Sale')}>
                        New Sale
                    </button>
                    <button>New Purchase</button>
                </div>
                <div className={styles.navbarFooter}>
                    <button>Settings</button>
                    <button onClick={signOut}>Logout</button>
                </div>
            </nav>
        </div>
    )
}
