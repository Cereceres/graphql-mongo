const database = require('../lib/mongo');
const mongo = require('../index');
const assert = require('assert');

describe('test to insert', () => {
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
        }
        `;
        const mongoGraph = await mongo(schema);
        const res = await mongoGraph(`
        mutation {
            insertTest(input: {prop: 1}) {
                prop
            }
        }`);
        assert(res.data.insertTest.prop === 1);
        const inserted = await database.find('test', { prop: 1 });
        assert(inserted[0].prop === 1);
    });

    after(async() => {
        await database.remove('test', { });
    });
});
