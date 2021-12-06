const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");


//CREATE post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (e) {
    res.status(500).json(e);
  }
});

//Update post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost)
      } catch (e) {
        res.status(500).json(e);
        console.log(e)
      }
    } else {
      res.status(401).json("You can update only your post!!");
    }
  } catch (e) {
    res.status(500).json(e);
  }
});

//delete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
     await post.delete()
        res.status(200).json("Post has been deleted!")
      } catch (e) {
        res.status(500).json(e);
      }
    } else {
      res.status(401).json("You can delete only your post!!");
    }
  } catch (e) {
    res.status(500).json(e);
  }
});

//GET post
router.get('/:id',async(req,res)=>{
  try{
    const post=await Post.findById(req.params.id)
    
    res.status(200).json(post)

  }catch(e){
    res.status(500).json(e)
  }
})

//GET all posts
router.get('/',async(req,res)=>{
  const username=req.query.user
  const catName=req.query.cat
  try{
    let posts;
    if(username){
      posts=await Post.find({username})
    }else if(catName){
      posts=await Post.find({categories:{
        $in:[catName]
      }})
    }else{
      posts=await Post.find()
    }
    res.status(200).json(posts)

  }catch(e){
    res.status(500).json(e)
  }
})

module.exports = router;
