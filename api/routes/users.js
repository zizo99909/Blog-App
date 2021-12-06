const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

//UPDATE
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (e) {
      res.status(500).json(e);
    }
  } else {
    res.status(400).json("You can update only your account!");
  }
});

//Delete
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);

      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
      } catch (e) {
        res.status(500).json(e);
      }
    } catch (e) {
      res.status(404).json("User not found!");
    }
  } else {
    res.status(400).json("You can delete only your account!");
  }
});

//GET user
router.get('/:id',async(req,res)=>{
  try{
    const user=await User.findById(req.params.id)
    const {password,...others} = user._doc
    res.status(200).json(others)

  }catch(e){
    res.status(500).json(e)
  }
})

module.exports = router;
