const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      }
    ]
  
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      assert.strictEqual(result, 5)
    })
})

describe('favourite blog', () => {
    const inputList = [
        {
            _id: '5a422a851b54a676234d17f7',
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12,
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        }, {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]

    test('find favourtie blog in list with many blogs', () => {
        const result = listHelper.favoriteBlog(inputList)
        assert.deepStrictEqual(result, {
            "title": "Canonical string reduction",
            "author": "Edsger W. Dijkstra",
            "likes": 12
        })
    })
})

describe('author with most blogs', () => {
  const inputList = [
      {
        _id: '5a422a851b54a676234d17f7',
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12,
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      }, {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      }, {
        _id: '5a422aa71b54a676234d17f8',
        title: 'The Alphabet',
        author: 'Fred Jonson',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 12,
        __v: 0
      }
  ]

  test('find author with most blogs', () => {
      const result = listHelper.mostBlogs(inputList)
      assert.deepStrictEqual(result, {
          "author": "Edsger W. Dijkstra",
          "blogs": 2
      })
  })
})

describe('most likes', () => {
  const inputList = [
      {
        _id: '5a422a851b54a676234d17f7',
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12,
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      }, {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      }, {
        _id: '5a422aa71b54a676234d17f8',
        title: 'The Alphabet',
        author: 'Fred Jonson',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 12,
        __v: 0
      }
  ]

  test('find author with most blogs', () => {
      const result = listHelper.mostLikes(inputList)
      assert.deepStrictEqual(result, {
          "author": "Edsger W. Dijkstra",
          "likes": 17
      })
  })
})