const database = require('./mongo');

const regexpToInsert = /^insert.*$/;
const regexpToUpdate = /^update.*$/;
const regexpToDelete = /^delete.*$/;
const getCollection = require('./get-collection');
const handler = Object.freeze({
    get:() => async(obj, args, context, info) => {
        await database.connect();
        let collection = null;
        if (info.parentType == 'Query') collection = info.fieldName;

        if (!collection) collection = getCollection(info.fieldName);

        const isToInserted = info.parentType == 'Mutation' && regexpToInsert.test(info.fieldName);

        if (isToInserted) return await database
            .insert(collection, args.input || args)
            .then((res) => ({ [info.fieldName]: res }));

        const isToUpdate = info.parentType == 'Mutation' && regexpToUpdate.test(info.fieldName);

        if (isToUpdate) return await database
            .update(collection, args.query || {}, args.input || args)
            .then((res) => ({ [info.fieldName]: res }));

        const isToDelete = info.parentType == 'Mutation' && regexpToDelete.test(info.fieldName);
        if (isToDelete) return await database
            .remove(collection, args.query || args)
            .then((res) => ({ [info.fieldName]: res }));

        if (collection) return await database
            .find(collection, args.query || args)
            .then((res) => ({ [collection]: res }));

        return {};
    }
});


module.exports = handler;
