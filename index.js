const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/wikiDB');

app.use(express.static('public'))

app.set('views', './views');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}))

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model('article', articleSchema);

app.route("/article")
  .get(function(req, res){
    Article.find({}, function(err, foundArticles) {
      if (err) throw err;
      else {
        res.send(foundArticles);
      }
      })
  })
  .post(function(req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({title: req.body.title, content: req.body.content});
    newArticle.save();
    res.status(204).send();
  })
  .delete(function(req, res){
    Article.deleteMany({}, function(err, rs) {
      if (err) throw err;
      else{
          res.send("Successfully Deleted All Articles")
      }
    })
  });

// specific routing
app.route("/article/:titleArticle")
  .get(function(req, res) {
    Article.findOne({title: req.params.titleArticle}, function(err, rs) {
      if (err) throw err;
      else {
        if (rs) {
          res.send(rs);
        }
        else {
          res.send("No such thing")
        }
      }
    })
  })
  .put(function(req, res) {
    Article.updateOne(
      {title: req.params.titleArticle},
      {title: req.body.title, content:req.body.content},
      function(err, rs) {
        if (err) throw err;
        else{
          res.send("Successfully Updated");
        }
      }
    )
  })
  .patch(function(req, res) {
    Article.updateOne(
      {title: req.params.titleArticle},
      {$set: req.body},
      function(err, rs) {
        if (err) throw err;
        else {
          res.send("Successfully Patched");
        }
      }
    )
  })
  .delete(function(req, res) {
    Article.deleteOne(
      {title: req.params.titleArticle},
      function(err, rs) {
        if (err) throw err;
        else {
          res.send("Successfully Deleted");
        }
      }
    )
  });

app.listen(process.env.PORT || 2000, function(){
  console.log("Server started on port 2000");
});
