const { gql } = require('apollo-server');
const {
	testClient,
	connectToDb,
	closeDbConnection,
} = require('./setup');

const { query, mutate } = testClient;

//zbiór testów sprawdzających działanie zapytań typu query

beforeAll(async () => {
	await connectToDb();
});

afterAll(async () => {
	await closeDbConnection();
});

describe('list returned by getGroupsForGameId', () => {
	it('should be sorted by creation date', async () => {
		const getGroupsQuery = gql`
			query {
				getGroupsForGameId(gameId: "61db1ffabbf4965fd9bbe7b6") {
					id
					members
					creationDate
					gameId
					isOpen
					currentSize
					playerLimit
					creator
					description
				}
			}
		`;

		const { data } = await query({
			query: getGroupsQuery,
		});

		const groups = data.getGroupsForGameId;
		function compare(a, b) {
			if (parseInt(a.creationDate) < parseInt(b.creationDate)) return -1;
			if (parseInt(a.creationDate) > parseInt(b.creationDate)) return 1;
			return 0;
		}

		const sortedByCreationDate = groups.sort(compare);

		expect(groups).toEqual(sortedByCreationDate);
	});
});
