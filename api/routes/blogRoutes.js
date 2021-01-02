const express = require("express");
const router = express.Router();
const auth  = require("../middlewares/authenticate");
const blogController = require("../controllers/blogControllers")
const upload = require("../config/multer").single("image");

router.use(auth);

router.post("/new",upload,blogController.newBlog)


router.get("/",blogController.getBlogs)

router.patch("/:id",upload,blogController.updateBlog)




router.delete("/deleteAll",blogController.deleteAllBlogs)

router.delete("/:id",blogController.deleteBlog)



module.exports = router