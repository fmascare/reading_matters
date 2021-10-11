const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

//All authors route
router.get('/', async(req, res) => {
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', { 
            authors: authors, 
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//New author page
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author(), errorMessage: null })
})

//Add new author form post + db create
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

//Show author page
router.get('/:id', async (req, res) => {
    const author = await Author.findById(req.params.id)
    let params = {author: author}
    try {
        const books = await Book.find({author: author.id}).limit(6).exec()
        params.books = books
        if(books.length > 0) {
            params.errorMessage = null
        } else {
            params.errorMessage = "No Books added"
        }
        res.render('authors/show', params)
    } catch {
        res.redirect('/authors')
    }
})

//Edit author page
router.get('/:id/edit', async(req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author, errorMessage: null })    
    } catch {
        res.redirect('/authors')
    }
    
})

//Update author page
router.put('/:id', async(req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch {
        if(author == null) {
            res.render('/')
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating Author'
            })
        }
    }
})

//Delete author page
router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect('/authors')
    } catch {
        if(author == null) {
            res.render('/')
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }
})

module.exports = router