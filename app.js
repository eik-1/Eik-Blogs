const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

mongoose.set("strictQuery", false);
mongoose.connect(process.env.ATLAS_URL, {
  useNewUrlParser: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("images"));

const homeStartingContent =
  "Welcome to Eik's Journal website. Here I post daily about lessons that life taught me. Things might get philosophical so hold on tight! This website is built upon EJS and uses mongoose database to manipulate the data.";
const aboutContent =
  "Hey guys! I am Sarthak Rawat (Eik). I am a full stack blockchain developer on Ethereum chain. I am trying to improve my skills in front end (React, Next, Tailwind). ";
const contactContent =
  "I would love to connect with people working in Blockchain industry or Self learners. Refer to the link below: ";

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({})
    .then((foundPosts) => {
      res.render("home", {
        HOMECONTENT: homeStartingContent,
        POSTS: foundPosts,
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/about", function (req, res) {
  res.render("about", { ABOUTCONTENT: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { CONTACTCONTENT: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts/:postId", function (req, res) {
  const requestedId = req.params.postId;
  Post.findOne({ _id: requestedId })
    .then((post) => {
      res.render("post", { DAYTITLE: post.title, CONTENT: post.content });
    })
    .catch((err) => {
      console.error(err);
    });
});

/*============POST THAT WE GET FROM /COMPOSE=============*/
app.post("/", function (req, res) {
  const post = new Post({
    title: req.body.journalTitle,
    content: req.body.journalContent,
  });
  post.save();
  res.redirect("/");
});

app.listen(5000, function () {
  console.log("Server set at port 5000");
});
