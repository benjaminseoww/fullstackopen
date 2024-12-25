import React from 'react'
import { test, vi, assert, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Blog from '../src/components/Blog'
import BlogCreateForm from '../src/components/BlogCreateForm'

test('blog renders title and author by default', () => {

    // set up component
    const blog = {
        title: "TEST TITLE",
        author: "TEST AUTHOR",
        url: "test.xyz",
        likes: 123,
        user: {
            username: "testuser123",
            name: "TESTUSER",
            id: "testuserid123"
        },
        id: "testblogid123",
        likeFunction: vi.fn(),
        deleteFunction: vi.fn()
    }

    // render component
    render(<Blog blog={blog}/>)

    expect(screen.getByText(/TEST TITLE/i)).toBeVisible()
    expect(screen.getByText(/TEST AUTHOR/i)).toBeVisible()
    expect(screen.getByText(/test.xyz/i)).not.toBeVisible()
    expect(screen.getByText(/likes/i)).not.toBeVisible()
});

test('blog renders url and likes after button is clicked', async () => {

    // set up component
    const blog = {
        title: "TEST TITLE",
        author: "TEST AUTHOR",
        url: "test.xyz",
        likes: 123,
        user: {
            username: "testuser123",
            name: "TESTUSER",
            id: "testuserid123"
        },
        id: "testblogid123",
        likeFunction: vi.fn(),
        deleteFunction: vi.fn()
    }

    const user = userEvent.setup()

    // render component
    render(<Blog blog={blog}/>)
    const button = screen.getByText("view")
    await userEvent.click(button as Element)

    expect(screen.getByText(/TEST TITLE/i)).toBeVisible()
    expect(screen.getByText(/TEST AUTHOR/i)).toBeVisible()
    expect(screen.getByText(/test.xyz/i)).toBeVisible()
    expect(screen.getByText(/likes/i)).toBeVisible()
});

test('blog like function called twice when like button is clicked twice', async () => {

    // set up mock function
    const likeFunction = vi.fn()

    // set up component
    const blog = {
        title: "TEST TITLE",
        author: "TEST AUTHOR",
        url: "test.xyz",
        likes: 123,
        user: {
            username: "testuser123",
            name: "TESTUSER",
            id: "testuserid123"
        },
        id: "testblogid123",
        likeFunction: likeFunction,
        deleteFunction: vi.fn()
    }

    const user = userEvent.setup()

    // render component
    render(<Blog blog={blog}/>)
    const button = screen.getByText("like")
    await userEvent.click(button as Element)
    await userEvent.click(button as Element)

    assert(likeFunction.mock.calls.length === 2)
});

test('blog creation event handler called, with correct details', async () => {

    // set up mock function
    const blogCreateFunction = vi.fn()

    // set up user event 
    const user = userEvent.setup()

    // set up form content
    const formFields = {
        title: "test title",
        author: "test author",
        url: "test.xyz"   
    }

    // render component
    render(<BlogCreateForm handleCreateBlog={blogCreateFunction}/>)

    // finding the input elements, filling in the form
    const titleInput = screen.getByRole('textbox', { name: /title/i })
    const authorInput = screen.getByRole('textbox', { name: /author/i })
    const urlInput = screen.getByRole('textbox', { name: /url/i })

    await user.type(titleInput, 'Test Title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'http://testurl.com')

    // submitting the form
    const button = screen.getByText("create")
    await user.click(button as Element)

    // checking that function was called once
    const mockCalls = blogCreateFunction.mock.calls
    assert(mockCalls.length === 1)

    // checking that correct details were provided to the mock function
    const mockParams = mockCalls[0]
    assert(mockParams[0] === 'Test Title')
    assert(mockParams[1] === 'Test Author')
    assert(mockParams[2] === 'http://testurl.com')
});