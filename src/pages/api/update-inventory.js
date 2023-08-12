import clientPromise from '@/lib/mongodb/mongodb'
import { ObjectId } from 'mongodb'

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default async (req, res) => {
    try {
        const client = await clientPromise
        const db = client.db('inventory-management')


        const { id } = req.query

        const post = await db
            .collection('inventory')
            .updateOne({ _id: new ObjectId(id) }, { $set: req.body })

        res.json(post)
    } catch (e) {
        console.log('api update error >>>', e)
        throw new Error(e).message
    }
}
