const database = require('../lib/mongo');
const mongo = require('../index');
const assert = require('assert');

describe('test to delete', () => {
    it('should return the data saved', async() => {
        await database.connect();
        const schema = `
        type Test {
            prop: Int!
        }
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
            deleteTest(query: Insert): Delete
        }
        `;
        const mongoGraph = await mongo(schema);
        await mongoGraph(`
        mutation {
            insertTest(input: {prop: 1}) {
                prop
            }
        }`);

        await mongoGraph(`
        mutation {
            deleteTest(query: {prop: 1}) {
                n
            }
        }`);
        const deleted = await database.find('test', { prop: 1 });
        assert(!deleted.length);
    });

    after(async() => {
        await database.remove('test', { });
    });
});
