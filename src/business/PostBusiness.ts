import { PostDatabase } from "../database/PostDatabase"
import { UserDatabase } from "../database/UserDatabase"
import { BadRequestError } from "../errors/BadRequestError"
import { Post } from "../models/Post"
import { PostCreatorDB } from "../types"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { EditPostInputDTO } from "../dtos/postDTO"
import { GetPostsOutput } from "../dtos/postDTO"
import { CreatePostInputDTO } from "../dtos/postDTO"
import { DeletePostInputDTO } from "../dtos/postDTO"
import { NotFoundError } from "../errors/NotFoundErro"
import { LikeDislikeDB } from "../types"
import { LikesDislikesInputDTO } from "../dtos/likedislikeDTO"
import { POST_LIKE } from "../types"
import { GetPostInput } from "../dtos/postDTO"
import { CommentDatabase } from "../database/CommentDatabase"

export class PostBusiness {
    
    constructor (
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
    ){}
    public getPosts = async (
        input: GetPostInput
        ): Promise<GetPostsOutput> => {
        const {  token } = input

       

        if (typeof token !== "string"){
            throw new BadRequestError("'token' inválido")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("'token' inválido")
        }

        const postsDB : PostCreatorDB[] = 
        await this.postDatabase
        .getPostCreators()

        const posts = postsDB.map((PostCreatorDB) => {
            const post = new Post(
                PostCreatorDB.id,
                PostCreatorDB.content,
                PostCreatorDB.likes,
                PostCreatorDB.dislikes,
                PostCreatorDB.comments,
                PostCreatorDB.created_at,
                PostCreatorDB.creator_id,
                PostCreatorDB.creator_name


            )

            return post.toBusinessModel()
        })

        const output: GetPostsOutput = posts

        return output
    }


    public createPosts = async (
        input: CreatePostInputDTO
    ): Promise<void> => {
        const { token, content } = input


        if (typeof token !== "string"){
            throw new BadRequestError("'token' inválido")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("'token' inválido")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        const id = this.idGenerator.generate()
        const createdAt = new Date().toISOString()
        const creatorId = payload.id
        const creatorName = payload.nickname

        const post = new Post(
            id,
            content,
            0,
            0,
            0,
            createdAt,
            creatorId,
            creatorName
        )

        const postDB = post.toDBModel()

        await this.postDatabase.insert(postDB)
      
    }

    public editPost = async (
        input: EditPostInputDTO
    ): Promise<void> => {

        const {idToEdit, token, content } = input

    
        if (typeof token !== "string"){
            throw new BadRequestError("'token' inválido")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("'token' inválido")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }
       
        
        const postDB = await this.postDatabase.findById(idToEdit)

        if (!postDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = payload.id

        if (postDB.creator_id !== creatorId) {
            throw new BadRequestError("somente quem criou a post pode editar")
        }

        const creatorName = payload.nickname

        const post = new Post(
        postDB.id,
        postDB.content,
        postDB.comments,
        postDB.likes,
        postDB.dislikes,
        postDB.created_at,
        creatorId,
        creatorName

        )

        post.setContent(content)

        const updatePostDB = post.toDBModel()

        await this.postDatabase.update(idToEdit, updatePostDB)
      
    }

    public deletePost = async (
        input: DeletePostInputDTO
    ): Promise<void> => {
        const { idToDelete, token } = input

        if (token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }

        const postDB = await this.postDatabase.findById(idToDelete)

        if (!postDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = payload.id

        if (
           postDB.creator_id !== creatorId
        ) {
            throw new BadRequestError("somente quem criou a postagem pode deletar ")
        }

        await this.postDatabase.delete(idToDelete)
    }


    public likeOrDislikePost = async (input: LikesDislikesInputDTO): Promise<void> => {

        const { idToLikeDislike, token, like } = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }
        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }

        if (typeof like !== "boolean") {
            throw new BadRequestError("'like' deve ser um booleano")
        }

        const postWithCreatorDB = await this.postDatabase.findPostWithCreatorById(idToLikeDislike)


        if (!postWithCreatorDB) {
            throw new NotFoundError("Id não encontrado")
        }

        const userId = payload.id
        const likeSQLite = like ? 1 : 0

        const likeDislikeDB: LikeDislikeDB = {
            user_id: userId,
            post_id: postWithCreatorDB.id,
            like: likeSQLite
        }

        const post = new Post(
            postWithCreatorDB.id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.comments,
            postWithCreatorDB.created_at,
            postWithCreatorDB.creator_id,
            postWithCreatorDB.creator_name
        )

        const likeDislikeExist = await this.postDatabase
            .findLikeDislike(likeDislikeDB)

        if (likeDislikeExist === POST_LIKE.ALREADY_LIKED) {
            if (like) {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeLike()
            } else {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeLike()
                post.addDislike()
            }
        } else if (likeDislikeExist === POST_LIKE.ALREADY_DISLIKED) {
            if (like) {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeDislike()
                post.addLike()
            } else {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeDislike()
            }
        } else {

            await this.postDatabase.likeOrDislikePost(likeDislikeDB)

            like ? post.addLike() : post.addDislike()

        }

        const updatePostDB = post.toDBModel()


        await this.postDatabase.update(idToLikeDislike, updatePostDB)
    }

    public getPostComments = async (input: GetPostInput) => {

        const { token } = input
        console.log(input);
        
        if (token === undefined) {
            throw new BadRequestError("token é necessário")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const posts = await this.postDatabase.getPosts()

        const userDatabase = new UserDatabase()

        const users = await userDatabase.getUsers()

        const commentsDatabase = new CommentDatabase()

        const comments = await commentsDatabase.getCommentWithCreators()

        const resultPost = posts.map((post) => {

           const contador = comments.filter((comment) => {
                return comment.post_id === post.id
            })

            return {
                id: post.id,
                content: post.content,
                likes: post.likes,
                dislikes: post.dislikes,
                comments: contador.length,
                created_at: post.created_at,
                creator: resultUser(post.creator_id),
                comentario: contador
            }
        })

        function resultUser(user: string) {
            const resultTable = users.find((result) => {
                return user === result.id
            })

            return {
                id: resultTable?.id,
                nickname: resultTable?.nickname
            }
        }

        return ({ Postagens: resultPost })
    }
  

}