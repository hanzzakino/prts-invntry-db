import styles from '@/styles/Dashboard.module.css'
import { useAuthContext } from '@/context/AuthContext'

export default function Dashboard() {
    const { authUser } = useAuthContext()

    return (
        <div className={styles.container}>
            <div className={styles.userInfoContainer}>
                <h1>
                    Hello, {authUser.name}{' '}
                    {authUser.access === 'admin' && '(Admin)'}
                </h1>
                <h1>{authUser.branch} BRANCH</h1>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
        </div>
    )
}
