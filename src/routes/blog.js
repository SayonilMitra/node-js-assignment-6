const router = require('express').Router();
const Blog = require('../models/Blog')

// Your routing code goes here

// app homepage
router.get('/', (req, res) => {
    res.end('Welcome To Blog App')
})

// posting blog
router.post('/blog', (req, res) => {
    // process recieved data
    let { topic, description, posted_at, posted_by } = req.body
    // count number of blogs
    Blog.countDocuments().then(data => {
        // After counting number of documents in database
        // We set new document id.
        const newBlog = new Blog({
            id: `${data + 1}`,
            topic: `${topic}`,
            description: `${description}`,
            posted_at: `${posted_at}`,
            posted_by: `${posted_by}`
        })
        newBlog.save()
        // display success message
        res.end(JSON.stringify({
            status: 'success',
            result:
            {
                id: `${data + 1}`,
                topic: `${topic}`,
                description: `${description}`,
                posted_at: `${posted_at}`,
                posted_by: `${posted_by}`
            }
        })
        )
    })
})

// searching blog
router.get('/blog', (req, res) => {
    // extract query parameters
    let [page, search] = req.url.split('?')[1].split('&')
    page = parseInt(page.split('=')[1])
    search = search.split('=')[1]
    // find matching blogs in database
    Blog.find({ topic: search }, (err, data) => {
        // display blogs found
        res.write(JSON.stringify({
            status: "success",
            result: data.map(item => {
                return {
                    "id": item.id,
                    "topic": item.topic,
                    "description": item.description,
                    "posted_at": item.posted_at,
                    "posted_by": item.posted_by
                }
            })
        }))
        res.end()
    })
})

// editing blog
router.put('/blog/:id', (req, res) => {
    // process recieved information
    let id = req.params.id
    let { topic, description, posted_at, posted_by } = req.body
    // find matching blog
    Blog.find({ id: id }, (err, data) => {
        // display edited blog
        res.end(JSON.stringify({
            status: "success",
            result: {
                id: id,
                topic: topic,
                description: description,
                posted_at: posted_at,
                posted_by: posted_by
            }
        }))
        // edit/update blog in database
        Blog.updateOne({ id: id }, {
            "$set": {
                topic: topic,
                description: description,
                posted_at: posted_at,
                posted_by: posted_by
            }
        }, (err, data) => {
            // console.log('edit')
        })

    })
})

// deleting blog
router.delete('/blog/:id', (req, res) => {
    // find matching blog
    Blog.findOne({ id: `${req.params.id}` }, (err, data) => {
        //display blog data
        res.write(JSON.stringify({
            status: "success",
            result: {
                id: data.id,
                topic: data.topic,
                description: data.description,
                posted_at: data.posted_at,
                posted_by: data.posted_by
            }
        }))
        // delete blog
        Blog.deleteOne({ id: `${req.params.id}` }, (err, data) => {
            //console.log('delete')
        })
        res.end()
    })
})

module.exports = router;