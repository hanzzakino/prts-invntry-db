import styles from '@/styles/Navbar.module.css'
import { useAuthContext } from '@/context/AuthContext'
import { useSettingsContext } from '@/context/SettingsContext'

export default function Navbar() {
    const { signOut } = useAuthContext()
    const { setViewPanel, view } = useSettingsContext()
    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div>
                    <h1>Store Management System</h1>
                    <p>{view}</p>
                </div>
                <div className={styles.navbarViews}>
                    <button onClick={() => setViewPanel('dashboard')}>
                        Dashboard
                    </button>
                    <button>Inventory</button>
                    <button>Sales Record</button>
                    <button>Purchases Record</button>
                </div>
                <div className={styles.navbarViews}>
                    <button onClick={() => setViewPanel('newsale')}>
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
