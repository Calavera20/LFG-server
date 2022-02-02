const { gql } = require('apollo-server');
const {
	testClient,
	connectToDb,
	closeDbConnection,
    server
} = require('./setup');

//zbiór testów sprawdzających działanie zapytań typu mutation

const { query, mutate } = testClient;

beforeAll(async () => {
	await connectToDb();
});

afterAll(async () => {
	await closeDbConnection();
});

describe('Login Resolver with wrong login info', () => {


	it('should return null', async () => {

        const username= "test1"
        const password= "test12345"
        const mutation =  gql`
        mutation Login{
            login(username: "${username}", password: "${password}"){
              token
            }
        }
        `

		const { data } = await mutate({
			mutation: mutation,
		});

		expect(data).toEqual({
			login: null,
		});
	});
});

describe('After group is created', () => {


	it('groupId should be returned', async () => {

        const gameId = '61db1ffabbf4965fd9bbe7b6';
        const description = 'description'
        const creator = 'test1'
        const playerLimit = '4'

        const creationMutation = gql`
          mutation {
            createGroup(description:"${description}", creator: "${creator}", playerLimit: "${playerLimit}", gameId: "${gameId}") 
            
          }
        `
        const { data } = await server.executeOperation({
			query: creationMutation,
		});
        
        const groupId = data.createGroup;

		expect(groupId).toBeTruthy();
	});
});

describe('Passing existing username to signup', () => {


	it('should return alreadyExistsErrCode', async () => {

        const username = 'test1'
        const email = 'test1@test'
        const password = '4123412314123'

        const creationMutation = gql`
        mutation Signup{
            signup(username: "${username}", email: "${email}" password: "${password}")
        }
        ` 
        const { data } = await server.executeOperation({
			query: creationMutation,
		});
        
		expect(data.signup).toEqual('11000');
	});
});

describe('Passing existing email to signup', () => {


	it('should return alreadyExistsErrCode', async () => {

        const username = 'test1'
        const email = 'test1@test'
        const password = '4123412314123'

        const creationMutation = gql`
        mutation Signup{
            signup(username: "${username}", email: "${email}" password: "${password}")
        }
        ` 
        const { data } = await server.executeOperation({
			query: creationMutation,
		});
        
		expect(data.signup).toEqual('11000');
	});
});
