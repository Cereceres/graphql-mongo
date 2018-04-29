const { MongoClient } = require('mongodb');
const URL = process.env.MONGO_URL || 'mongodb://localhost:27017/test';
let DB = null;
const collections = new Map();
let promise = null;
const database = module.exports = {
    connect:(url = URL) => {
        promise = new Promise((resolve, reject) => {
            if (DB) return resolve(DB);
            MongoClient.connect(url, (err, db) => {
                if (err) return reject(err);

                const dbo = db.db();
                DB = dbo;
                resolve(database);
            });
        });
        return promise;
    },

    find: async(collection, query) => {
        await promise;
        let collectionConnected = null;
        if (collections.has(collection)) collectionConnected = collections
            .get(collection);
        collectionConnected = collectionConnected || DB.collection(collection);
        if (!collections.has(collection)) collections
            .set(collection, collectionConnected);
        const data = await collectionConnected.find(query).toArray();

        return data;
    },

    insert: async(collection, data) => {
        await promise;
        let collectionConnected = null;
        if (collections.has(collection)) collectionConnected = collections
            .get(collection);
        collectionConnected = collectionConnected || DB.collection(collection);
        if (!collections.has(collection)) collections
            .set(collection, collectionConnected);
        const inserted = await collectionConnected.insertOne(data);
        return inserted.ops[0];
    },
    update: async(collection, query, data) => {
        await promise;
        let collectionConnected = null;
        if (collections.has(collection)) collectionConnected = collections
            .get(collection);
        collectionConnected = collectionConnected || DB.collection(collection);
        if (!collections.has(collection)) collections
            .set(collection, collectionConnected);
        await collectionConnected
            .updateMany(query, { $set: data });
        const updated = await database.find(collection, Object.assign(query, data));


        return updated;
    },

    remove: async(collection, query) => {
        await promise;
        let collectionConnected = null;
        if (collections.has(collection)) collectionConnected = collections
            .get(collection);
        collectionConnected = collectionConnected || DB.collection(collection);
        if (!collections.has(collection)) collections
            .set(collection, collectionConnected);
        const { result } = await collectionConnected.deleteMany(query);
        return result;
    },

};
