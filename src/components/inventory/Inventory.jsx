import styles from '@/styles/Inventory.module.css'

export default function Inventory() {
    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <h1>Inventory</h1>
            </div>
            <div className={styles.tableContainer}>
                <table
                // className="aicsdatatable"
                // style={{ fontSize: zoomValue.toString() + 'rem' }}
                // cellSpacing={0}
                >
                    <tbody>
                        <tr>
                            <th colSpan={1}>PERSONAL DETAILS</th>
                            <th colSpan={1}>SWD DETAILS</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
