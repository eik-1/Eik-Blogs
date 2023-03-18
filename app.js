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
  "Welcome to Eik's Journal website. Here I post daily about lessons that life taught me. Things might get philosophical so hold on tight! I hope you enjoy this lovely website that I created 😊.";
const aboutContent =
  "Salut les gars et les filles. Je ne parle pas français, j'ai donc utilisé Google Translater parce que le français a l'air sexy. Anyways I go by the name Eik. I am a self learner and currently I am learning Web Development and Blockchain Development. I don't know what I am doing since I am in an open relationship with learning Philosophies. Thanks for using this website. It's just a personal project I am working on. Au revoir.";
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
