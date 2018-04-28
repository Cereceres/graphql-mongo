const database = require('../lib/mongo');
const mongo = require('../index');
const assert = require('assert');

describe('test to update', () => {
    it('should return the data saved', async() => {
        await database.connect();
        const schema = `
        type Test {
            prop: Int!
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
        }
        `;
        const mongoGraph = await mongo(schema);
        await mongoGraph(`
        mutation {
            insertTest(input: {prop: 1}) {
                prop
            }
        }`);

        const res = await mongoGraph(`
        mutation {
            updateTest(input: {prop: 2}, query: {prop: 1}) {
                prop
            }
        }`);
        assert(res.data.updateTest[0].prop === 2);
        const inserted = await database.find('test', { prop: 2 });
        assert(inserted[0].id === res.data.updateTest.id);
    });

    after(async() => {
        await database.remove('test', { });
    });
});
