const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    let maxLikes = 0;
    let favoriteBlog = {};
    for (let x in blogs) {
        if (blogs[x].likes > maxLikes) {
            maxLikes = blogs[x].likes
            favoriteBlog = blogs[x]
        }
    }
    const output = {
        "title": favoriteBlog.title,
        "author": favoriteBlog.author,
        "likes": favoriteBlog.likes
    }

    return output
}

const mostBlogs = (blogs) => {
    let authorBlogCount = {}
    for (let x in blogs) {
        const blog = blogs[x]
        if (authorBlogCount[blog.author]) {
            authorBlogCount[blog.author] += 1
        } else {
            authorBlogCount[blog.author] = 1
        }
    }
    const sortedList = Object.entries(authorBlogCount).sort((a, b) => b[1] - a[1])
    const output = {
        "author": sortedList[0][0],
        "blogs": sortedList[0][1]
    }
    return output
}

const mostLikes = (blogs) => {
    let authorLikeCount = {}
    for (let x in blogs) {
        const blog = blogs[x]
        if (authorLikeCount[blog.author]) {
            authorLikeCount[blog.author] += blog.likes
        } else {
            authorLikeCount[blog.author] = blog.likes
        }
    }
    const sortedList = Object.entries(authorLikeCount).sort((a, b) => b[1] - a[1])
    const output = {
        "author": sortedList[0][0],
        "likes": sortedList[0][1]
    }
    return output
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}