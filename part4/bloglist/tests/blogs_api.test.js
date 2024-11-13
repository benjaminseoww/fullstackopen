const { test, describe, beforeEach, expect } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest');
const mongoose = require('mongoose');
const api_test_helper = require('../utils/api_test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcryptjs')

let blogs_id = [];

beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    let user = await User.findOne({ username: 'adamlee034' });

    if (!user) {
        // Create a new user if one does not exist
        user = new User({ username: 'adamlee034' });
        user.passwordHash = await bcrypt.hash('test12345', 10); 
        await user.save();
    }

    blogs_id = [];
    const blogObjects = api_test_helper.initialBlogs.map(blog => new Blog(blog));
    const blogArray = blogObjects.map(blog => blog.save());
    await Promise.all(blogArray);
    blogArray.forEach(promise => promise.then(blog => blogs_id.push(blog._id.toString())));
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
    test.only("blog is added to database with valid token", async () => {
        const newBlog = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5
        };

        // login
        const testLogin = await api.post('/api/login').send({
            username: "adamlee034",
            password: "test12345"
        }).expect(200);
        const authorization = testLogin.body.token;
        
        // test posting
        await api
            .post('/api/blogs')
            .set("Authorization", `Bearer ${authorization}`)
            .send(newBlog)
            .expect(201)
        
        // test getting with increased size of db
        const response = await api.get('/api/blogs').set("Authorization", `Bearer ${authorization}`);
        assert.strictEqual(response.body.length, api_test_helper.initialBlogs.length + 1);
    })

    test.only("401 Unauthorised when no token is given to add a new blog", async () => {
        const newBlog = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5
        };

        // login
        const testLogin = await api.post('/api/login').send({
            username: "adamlee034",
            password: "test12345"
        }).expect(200);
        const authorization = testLogin.body.token;
        
        // test posting
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
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

    test("missing title or url returns 400", async () => {
        const newBlog = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5
          };

        // test posting
        await api.post('/api/blogs').send(newBlog).expect(400);
    });
})

describe("DELETE /api/blogs/:id", () => {
    test("deleted a blog successfully returns 204", async() => {
        const id_to_delete = blogs_id[0];
        await api.delete('/api/blogs/' + id_to_delete).expect(204);
        const response = await api.get('/api/blogs');
        assert.strictEqual(response.body.length, api_test_helper.initialBlogs.length - 1);
        assert.strictEqual(response.body.map(blog => blog.id).includes(id_to_delete), false);
    });

    test("deleted a blog with invalid id returns 400", async() => {
        await api.delete('/api/blogs/ab123456cd654321ef').expect(400);
    });
});

describe("PUT /api/blogs/:id", () => {
    const updatedBlog = {
        likes: 554
    }

    test("updating a blog's likes successfully", async() => {
        const id_to_update = blogs_id[0];
        const response = await api.put('/api/blogs/' + id_to_update).send(updatedBlog).expect(200);
        assert.strictEqual(response.body.likes, updatedBlog.likes);
    });

    test("updating a blog with invalid id returns 400", async() => {
        await api.put('/api/blogs/ab123456cd654321ef').send(updatedBlog).expect(400);
    });
});