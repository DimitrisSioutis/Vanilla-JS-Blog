const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');

const createDomPurify = require('dompurify')
const {JSDOM} = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)  //we use dompurify to prevent malicious code 

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true //slug is used as the link to the article so we need to make sure every slug its unique
    },
    sanitizedHtml: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
})


articleSchema.pre('validate', function (next) { //this function runs anytime before we save,delete,edit an article
    if (this.title) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true
        }) //strict:true gets rid of all unecassery characters
    }

    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown))
    }

    next()
})

module.exports = mongoose.model('Article', articleSchema)