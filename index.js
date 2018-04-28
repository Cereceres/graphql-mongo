const { makeExecutableSchema } = require('graphql-tools');
const { graphql } = require('graphql');
const handler = require('./lib/handler');
const resolvers = new Proxy({}, handler);
const database = require('./lib/mongo');

const executableSchema = (typeDefs) => makeExecutableSchema({
    typeDefs,
    resolvers
});


module.exports = async(typeDefs) => {
    const schema = executableSchema(typeDefs);
    await database.connect();
    return (query) => graphql(schema, query);
};
