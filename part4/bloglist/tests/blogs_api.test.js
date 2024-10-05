const { test, describe, beforeEach, expect } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest');
const mongoose = require('mongoose');
const api_test_helper = require('../utils/api_test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

beforeEach(async () => {
    await Blog.deleteMany({});
    const blogObjects = api_test_helper.initialBlogs.map(blog => new Blog(blog));
    const blogArray = blogObjects.map(blog => blog.save());
    await Promise.all(blogArray);
})

describe("GET /api/blogs", () => {
    test("blogs are returned as json", async () => {
        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    });

    test("correct number of blogs is returned", async () => {
        const response = await api.get('/api/blogs');
        assert.strictEqual(response.body.length, api_test_helper.initialBlogs.length);
    });
});

describe("verify blog data keys", () => {
    test("identifier is named id", async () => {
        const response = await api.get('/api/blogs');
        assert(response.body[0].id);
    })
})

describe.only("POST /api/blogs", () => {
    test("blog is added to database", async () => {
        const newBlog = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5
          };
        
        // test posting
        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        
        // test getting with increased size of db
        const response = await api.get('/api/blogs');
        assert.strictEqual(response.body.length, api_test_helper.initialBlogs.length + 1);
    })

    test("default likes is 0", async () => {
        const newBlog = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        };

        // test posting
        const response = await api.post('/api/blogs').send(newBlog).expect(201)

        assert.strictEqual(response.body.likes, 0);
    });

    test.only("missing title or url returns 400", async () => {
        const newBlog = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5
          };

        // test posting
        await api.post('/api/blogs').send(newBlog).expect(400);
    });
})
