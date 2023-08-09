import clientPromise from '@/lib/mongodb/mongodb'

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default async (req, res) => {
    try {
        const client = await clientPromise
        const db = client.db('inventory-management')

        const post = await db.collection('sales-record').insertOne(req.body)
        console.log('recorded')

        res.json(post)
    } catch (e) {
        console.log('api post error >>>', e)
        throw new Error(e).message
    }
}
