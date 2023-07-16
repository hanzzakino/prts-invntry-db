import styles from '@/styles/Navbar.module.css'
import { useAuthContext } from '@/context/AuthContext'

export default function Navbar() {
    const { signOut } = useAuthContext()
    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div>
                    <h1>Store Management System</h1>
                </div>
                <div className={styles.navbarViews}>
                    <button>Dashboard</button>
                    <button>Inventory</button>
                    <button>Sales</button>
                    <button>Purchases</button>
                </div>
                <div className={styles.navbarViews}>
                    <button>New Sale</button>
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
