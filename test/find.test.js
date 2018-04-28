const database = require('../lib/mongo');
const mongo = require('../index');
const assert = require('assert');

describe('test to find', () => {
    it('should return the data saved', async() => {
        await database.connect();
        await database.insert('test', { prop: 1 });
        const schema = `
        type Test {
            prop: Int
        }
        type Query {
            test: [Test]
        }
        `;
        const mongoGraph = await mongo(schema);
        const res = await mongoGraph(`
        query {
            test {
                prop
            }
        }`);
        res.data.test.forEach(({ prop }) => assert(prop));
    });

    it('should return the data saved', async() => {
        await database.connect();
        await database.insert('test', { prop: 2 });
        const schema = `
        type Test {
            prop: Int
        }
        type Query {
            test(prop: Int): [Test]
        }
        `;
        const mongoGraph = await mongo(schema);
        const res = await mongoGraph(`
        query {
            test(prop: 2){
                prop
            }
        }`);
        res.data.test.forEach(({ prop }) => assert(prop === 2));
    });

    after(async() => {
        await database.remove('test', { });
    });
});
