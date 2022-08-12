const mongoose = require('mongoose');
const slugify = require('slugify');
const connection = mongoose.createConnection('mongodb://localhost/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const ArticleSchema = new mongoose.Schema({
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
    image: {
        type: String
    }
})

const PlayerSchema = new mongoose.Schema({
    firstname: {
        type: String,
    },
    lastname: {
        type: String
    },
    number: {
        type: String
    },
    birthday: {
        type: String
    },
    position: {
        type: String
    },
    appearances: {
        type: String
    },
    goals: {
        type: String
    },
    image: {
        type: String
    },
    background: {
        type: String
    },
    slug: {
        type: String,
        unique: true 
    }
})

ArticleSchema.pre('validate', function (next) { //this function runs anytime before we save,delete,edit an article

    if (this.title) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true
        }) //strict:true gets rid of all unecassery characters
    }

    next()
})

PlayerSchema.pre('validate', function (next) { 
    const fullname = this.firstname + ' ' + this.lastname
    if (this.firstname) {
        if(this.lastname){
            this.slug = slugify(fullname, {
                lower: true,
                strict: true
            })
        }   
    }
    next()
})
    

const Article = connection.model('Article', ArticleSchema);
const User = connection.model('User', UserSchema);
const Player = connection.model('Player',PlayerSchema);

// Expose the connection
module.exports = connection;