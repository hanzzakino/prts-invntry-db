import clientPromise from '@/lib/mongodb/mongodb'

export default async (req, res) => {
    try {
        const client = await clientPromise
        const db = client.db('inventory-management')
        const { username, password } = req.body
        const get = await db
            .collection('user')
            .find({
                $and: [{ username: username }, { password: password }],
            })
            .toArray()

        res.json(get)
    } catch (e) {
        console.log('api get error >>>', e)
        throw new Error(e).message
    }
}
