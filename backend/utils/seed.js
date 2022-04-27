const dbConnection = require('../config/mongoConnection');
const weddingList = require('./weddings.json');
const {loadDefaultWeddings, loadDefaultGifts} = require('./func');


async function main() {
    const db = await dbConnection();
    await db.dropDatabase();

    /**
     * add gifts to DB
     */
    await loadDefaultGifts();

    /**
     * add event list to DB
     */
    await loadDefaultWeddings(weddingList);

    /**
     * close DB connection
     */
    console.log('Done seeding database');
	await db.s.client.close();

}

main().catch(console.log);