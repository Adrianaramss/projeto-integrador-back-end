import express from 'express'
import { PostController } from "../controller/PostController"
import { PostBusiness } from '../business/PostBusiness'
import { PostDatabase } from '../database/PostDatabase'
import { IdGenerator } from '../services/IdGenerator'
import { TokenManager } from '../services/TokenManager'

export const postRouter = express.Router()
// const userController = new UserController()
const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager()
    )
)

postRouter.get("/",  postController.getPosts)

postRouter.post("/", postController.createPost)

postRouter.delete("/:id", postController.deletePost)

postRouter.put("/:id", postController.editPost)

postRouter.get("/comments", postController.getPostComment)

postRouter.put("/:id/like", postController.likeOrDislikePost)