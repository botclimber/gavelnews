const request = require('supertest');
const url = 'http://localhost:3000';

/*test("should respond with a 200 status code", async () => {
        const response = await request(url).post("/gate/services/testAPI/create")
        expect(response.statusCode).toBe(200)
})
*/

/** sign-up tests:
	- if any field missing
	- if same email
*/

/** sign-in tests:
	- if any field missing
	- if wrong password
	- if email not registed

*/
describe("LOCAL-SIGN-UP", () => {
        test("if any field missing", async () => {

		const response = await request(url).post("/gate/auth/local-sign-up")
		.set({'Content-Type': 'application/json'})
		.send({'email': 'teste'+Math.floor(Math.random() * 10000)+'@teste.pt', 'name': 'teste da teste', 'password':'' ,'user_type': 'testbot'})
		expect(response.status).toBe(400)
		expect(response.body.msg).toBe('required fields not complete')
	})

        test("if same email", async () => {

		const response = await request(url).post("/gate/auth/local-sign-up")
		.set({'Content-Type': 'application/json'})
		.send({'email': 'itslit@travis.com', 'name': 'teste da teste', 'password':'21savage' ,'user_type': 'testbot'})
		expect(response.status).toBe(400)
		expect(response.body.msg).toBe('Email already registed')
	})
});

describe("LOCAL-SIGN-IN", () => {
        test("if any field missing", async () => {

		const response = await request(url).post("/gate/auth/local-sign-in")
		.set({'Content-Type': 'application/json'})
		.send({'email': 'itslit@travis.com', 'name': 'teste da teste', 'password':'' ,'user_type': 'testbot'})
		expect(response.status).toBe(400)
		expect(response.body.msg).toBe('required fields not complete')
	 })

        test("if wrong password", async () => {

		const response = await request(url).post("/gate/auth/local-sign-in")
		.set({'Content-Type': 'application/json'})
		.send({'email': 'itslit@travis.com', 'name': 'teste da teste', 'password':'wrongPassword' ,'user_type': 'testbot'})
		expect(response.status).toBe(400)
		expect(response.body.msg).toBe('wrong password')
	 })

        test("if email not registed", async () => {

		const response = await request(url).post("/gate/auth/local-sign-in")
		.set({'Content-Type': 'application/json'})
		.send({'email': 'notRegistedEmail@teste.pt', 'name': 'teste da teste', 'password':'somtehing' ,'user_type': 'testbot'})
		expect(response.status).toBe(400)
		expect(response.body.msg).toBe('email not registed')
	 })
});
