const { test, describe, beforeEach, expect } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest');
const mongoose = require('mongoose');
const api_test_helper = require('../utils/api_test_helper');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');

beforeEach(async () => {
    await User.deleteMany({});
    const userObjects = api_test_helper.initialUsers.map(user => new User(user));
    const userArray = userObjects.map(user => user.save());
    await Promise.all(userArray);
})

describe("GET /api/users", () => {
    test("users are returned as json", async () => {
        await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    });

    test("correct number of users is returned", async () => {
        const response = await api.get('/api/users');
        console.log(response);
        assert.strictEqual(response.body.length, api_test_helper.initialBlogs.length);
    });
});

describe("POST /api/users", () => {
    test("invalid username gives 400", async () => {

        const newUser = {
            "name": "Bob",
            "username": "bo",
            "password": "test12345"
        }

        await api.post('/api/users').send(newUser).expect(400); 
    });

    test("invalid password gives 400", async () => {

        const newUser = {
            "name": "Bob",
            "username": "boblee034",
            "password": "te"
        }

        await api.post('/api/users').send(newUser).expect(400); 
    });

    test("duplicated username gives 400", async () => {

        const newUser = {
            "name": "Bob",
            "username": "adamlee034",
            "password": "test123456"
        }

        await api.post('/api/users').send(newUser).expect(400); 
    });
});