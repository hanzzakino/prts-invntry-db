import clientPromise from '@/lib/mongodb/mongodb'

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default async (req, res) => {
    try {
        const client = await clientPromise
        const db = client.db('inventory-management')

        const get = await db.collection('inventory').aggregate(req.body).toArray()

        res.json(get)
    } catch (e) {
        console.log('api get error >>>', e)
        throw new Error(e).message
    }
}
