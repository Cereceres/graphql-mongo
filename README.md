# graphql-mongo
Use graphql to validate data insert, data query, data update over mongodb

#Install 

```bash
npm install graphql-mongo
```

# Usage

```js

const mongoGQL = require('graphql-mongo')
const schema = `
    type Test {
        prop: Int!
    }
    # delete method only return the n what is the number of deleted documents
    type Delete {
            n: Int!
    }
    input Insert {
        prop: Int!
    }
    type Query {
        test(prop: Int): [Test]
    }
    type Mutation {
        insertTest(input: Insert): Test
        updateTest(query: Insert,input: Insert): [Test]
        deleteTest(query: Insert): Delete
    }
`;
const mongoGraph = await mongoGQL(schema);
// this is mapped to a insert in test collection
await mongoGraph(`
mutation {
    insertTest(input: {prop: 1}) {
        prop
    }
}`);
// this is mapped a get from test collection
await mongoGraph(`
query {
    test(prop: 2){
        prop
    }
}`);
// this is mapped to a update in test collection
await mongoGraph(`
mutation {
    updateTest(input: {prop: 2}, query: {prop: 1}) {
        prop
    }
}`);
// this is mapped to a delete in test collection
await mongoGraph(`
        mutation {
            deleteTest(query: {prop: 1}) {
                n
            }
        }`);

```


## API mongoGQL(graphqlSchema, urlToConnectMongo) -> Promise(mongoGraph(graphqlQueryString))

## mongoGraph(graphqlQueryString) -> Promise

## Insert, Update and Delete

Any mutation with name insert{collectionName}, update{collectionName} or delete{collectionName}
are mapped to a insert, update or delete in collectionName

## insert{Collection}(args)

Try to get input param named from args, if not take the args as the input.

## update{Collection}(args)

Try to get input param named from args and query param named.

## delete{Collection}(args)

Try to get query param named from args, if not take the args as the query.

## Config

MONGO_URL environment var to mongo url config