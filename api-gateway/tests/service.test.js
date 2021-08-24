const request = require('supertest');
const url = 'http://localhost:3000';

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

describe("POST/PUT/DELETE requests", () => {
	test("POST sending data and token", async () => { 

		const response = await request(url).post("/gate/services/testAPI/createPost")
		.set({'Content-Type': 'application/json'})
		.set({'auth-token': token})
		.send({msg:'its lit'})
		expect(response.status).toBe(200)
		expect(response.body.data).toBe('its lit')
	})
	test("POST sending data with no token", async () => {
	
		const response = await request(url).post("/gate/services/testAPI/createPost")
		.set({'Content-Type': 'application/json'})
		.send({msg:'its lit'})
		expect(response.status).toBe(403)
	 })
	test("POST not sending data", async () => {
	
		const response = await request(url).post("/gate/services/testAPI/createPost")
		.set({'Content-Type': 'application/json'})
		.set({'auth-token': token})
		expect(response.status).toBe(200)
	})
	
	test("PUT sending data and token", async () => {

		const response = await request(url).put("/gate/services/testAPI/updatePost/1")
		.set({'Content-Type': 'application/json'})
		.set({'auth-token': token})
		expect(response.status).toBe(200)
	 })
	test("PUT sending wrong url", async () => {

		const response = await request(url).put("/gate/services/testAPI/updatePost")
		.set({'Content-Type': 'application/json'})
		.set({'auth-token': token})
		expect(response.text).toBe('Request failed with status code 404')
	 })
	
	test("DELETE sending data and token", async () => {
	
		const response = await request(url).delete("/gate/services/testAPI/delPost/1")
		.set({'Content-Type': 'application/json'})
		.set({'auth-token': token})
		expect(response.status).toBe(200)
	 })
	test("DELETE sending wrong url", async () => {

		const response = await request(url).delete("/gate/services/testAPI/delPost")
		.set({'Content-Type': 'application/json'})
		.set({'auth-token': token})
		expect(response.text).toBe('Request failed with status code 404')
	 })
});


