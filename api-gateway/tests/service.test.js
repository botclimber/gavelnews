const request = require('supertest');
const url = 'http://localhost:3000';

/*
test("should respond with a 200 status code", async () => {
        const response = await request(url).post("/gate/services/testAPI/create")
        expect(response.statusCode).toBe(200)
})
*/

var token = null;

test("POST return token", async () => {
        const response = await request(url).post("/gate/auth/local-sign-in")
	.set({'Content-Type': 'application/json'})
        .send({'email': 'itslit@travis.com', 'password': '21savage'})
	expect(response.status).toBe(200)
	token = response.body.token
})

test("not found request", async () => {

	const response = await request(url).post("/gat/services/testAPI/home")
	.set({'Content-Type': 'application/json'})
	expect(response.status).toBe(404)

});

test("not registed api", async () => {

	const response = await request(url).post("/gate/services/notRegisted/home")
	.set({'Content-Type': 'application/json'})
	expect(response.status).toBe(404)
	expect(response.body.msg).toBe('API not registed')
});

describe("GET requests", () => {

	test("no token required req", async () => {
		const response = await request(url).post("/gate/services/testAPI/home")
		.set({'Content-Type': 'application/json'})
		expect(response.status).toBe(200)
	})

	test("no token required req with id", async () => {
		const response = await request(url).post("/gate/services/testAPI/home/1")
		.set({'Content-Type': 'application/json'})
		expect(response.status).toBe(200)
	})

	test("token required req", async () => {
		const response = await request(url).post("/gate/services/testAPI/secrets")
		.set({'Content-Type': 'application/json'})
		.set({'auth-token': token})
		expect(response.status).toBe(200)
	})
	
	test("token required req error", async () => {
		const response = await request(url).post("/gate/services/testAPI/secrets")
		.set({'Content-Type': 'application/json'})
		expect(response.status).toBe(403)
	})
});

describe("POST requests", () => {
	test("sending data and token", () => { })
	test("sending data with no token", () => { })
	test("not sending data", () => { })
});

