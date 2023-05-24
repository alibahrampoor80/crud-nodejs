const express = require("express");
const {NotFoundError, ErrorHandler} = require("./utils/errorHandler");
const {BlogModel} = require("./model/blog.model");
const omitEmpty = require("omit-empty");
const dotenv = require('dotenv')
const {isValidObjectId} = require("mongoose");
const morgan = require('morgan')
const app = express();

app.use(morgan('dev'))

dotenv.config()
require("./config/mongo.config");

const {bodyValidate} = require("./validation/auth.validator");


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'))
app.set('view engine', 'ejs')


app.get("/", async (req, res, next) => {
    const blogs = await BlogModel.find({})
    res.render('index', {
        title: 'project api blogs',
        blogs
    })
});
app.get("/blogs", async (req, res, next) => {
    try {
        const blogs = await BlogModel.find({});
        res.send({
            status: 200,
            count: blogs.length,
            data: blogs,
        });
    } catch (err) {
        console.log(err)
        res.send({error: err.message})
    }
});

app.get("/blogs/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        if (!isValidObjectId(id)) throw {status: 400, message: "شناسه ی بلاگ نامعتبر است."};

        const blog = await BlogModel.findOne({_id: id});
        res.send({
            status: 200,
            count: blog.length,
            data: blog,
        });
    } catch (err) {
        next(err);
    }
});

app.post("/create", async (req, res, next) => {
    try {
        const {title, text, show, likes, bookmarks} = req.body;
        await bodyValidate.validateAsync({title, text, show, likes, bookmarks})

        const result = await BlogModel.create({
            title, text, show, likes, bookmarks
        });
        res.send(result);
    } catch (error) {
        next(error);
    }
});

app.post("/new", async (req, res, next) => {
    try {
        const {title, text, show, likes, bookmarks} = req.body;
        const newBlog = new BlogModel({
            title,
            text,
            show,
            likes,
            bookmarks
        });
        await newBlog.save();
        res.send(newBlog);
    } catch (error) {
        next(error);
    }
});

app.get("/insertMany", async (req, res, next) => {
    try {
        const newBlog = await BlogModel.insertMany([
            {
                title: "ali sdfsfsdfsdf",
                text: "alifgfgdfgdfg",
            },
            {
                title: "alisddsfsdfdsfs ",
                text: "ali33434",
            },
            {
                title: "fgfgfgfg ",
                text: "zdsfsdfsdfsdfsefdsjs next.js",
            },
        ]);

        res.send(newBlog);
    } catch (error) {
        next(error);
    }
});


app.delete("/blogs/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        if (!isValidObjectId(id)) throw {status: 400, message: "شناسه ی بلاگ نامعتبر است."};

        const result = await BlogModel.deleteOne({_id: id});
        res.send({
            status: 200,
            result,
        });
    } catch (err) {
        next(err);
    }
});

app.delete("/blogs", async (req, res, next) => {
    try {
        const result = await BlogModel.deleteMany({title: "react js react js"});
        res.send({
            status: 200,
            result,
        });
    } catch (err) {
        next(err);
    }
});

app.patch("/blogs/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        if (!isValidObjectId(id)) throw {status: 400, message: "شناسه ی بلاگ نامعتبر است"}
        const newBody = omitEmpty(req.body);
        const blog = await BlogModel.findOne({_id: id});
        if (!blog) throw {status: 404, message: "پیدا نشد."};
        Object.assign(blog, newBody);
        await blog.save();
        res.send(blog);
    } catch (err) {
        next(err);
    }
});

app.put("/blogs/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        if (!isValidObjectId(id)) throw {status: 400, message: "شناسه ی بلاگ نامعتبر است"}
        const newBody1 = omitEmpty(req.body);

        // const blog = await BlogModel.findOne({_id: id})
        // if (!blog) throw {status: 404, message: "پیدا نشد."}
        // const result = await BlogModel.updateOne({_id: id}, {
        //     $set: {...newBody1}
        // })

        const result = await BlogModel.findOneAndUpdate(
            {_id: id},
            {$set: newBody1},
        );

        res.send(result);
    } catch (err) {
        next(err);
    }
});

app.use(NotFoundError);
app.use(ErrorHandler);

const PORT = process.env.PORT || 3000
app.listen(process.env.PORT, () => {
    console.log(`server is running ${process.env.PORT}`)
})

