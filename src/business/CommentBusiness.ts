import { CommentDatabase } from "../database/CommentDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { GetCommentOutputDTO, GetCommentsInputDTO} from "../dtos/commentDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { Comment,CommentModel } from "../models/Comment"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import {  CommentWithCreatorDB,LikeDislikeCommentDB, COMMENT_LIKE } from "../types"
import { CreateCommentInputDTO } from "../dtos/commentDTO"
import { NotFoundError } from "../errors/NotFoundErro"
import { LikeDislikeCommentInputDTO } from "../dtos/commentDTO"
import { GetCommentInputDTO } from "../types"

export class CommentBusiness {
    constructor(
        private commentDatabase: CommentDatabase,
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public getComment = async (input: GetCommentsInputDTO): Promise<GetCommentOutputDTO> => {

        const { token } = input

        if (token === undefined) {
            throw new BadRequestError("token é necessário")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const commentsWithCreatorsDB: CommentWithCreatorDB[] =
            await this.commentDatabase.getCommentWithCreators()

        const comments = commentsWithCreatorsDB.map((commentWithCreatorDB) => {
            const comment = new Comment (
                commentWithCreatorDB.id,
                commentWithCreatorDB.post_id,
                commentWithCreatorDB.creator_id,
                commentWithCreatorDB.content,
                commentWithCreatorDB.likes,
                commentWithCreatorDB.dislikes,
                commentWithCreatorDB.created_at,
            )

            return comment.toBusinessModel()
        })

        const output: GetCommentOutputDTO = comments

        return output
    }


    public createComment = async (input: CreateCommentInputDTO): Promise<void> => {
        const { postId, content, token } = input
        
        if (token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)
        
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }
        const postDBExists = await this.postDatabase.findById(postId)
        
        if (postDBExists === null) {
            throw new NotFoundError("'id' não encontrado")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser uma string")
        }

        const newId = this.idGenerator.generate()

        const newComment = new Comment(
            newId,
            postId,
            payload.id,
            content,
            0,
            0,
            new Date().toISOString(),
        )

        const newCommentDB = newComment.toDBModel()

        await this.commentDatabase.insertComment(newCommentDB)
    }


    public likeOrDislikeComment = async (input: LikeDislikeCommentInputDTO): Promise<void> => {
        const { idToLikeOrDislike, token, like } = input

        if (token === undefined) {
            throw new BadRequestError("token é necessário")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }

        if (typeof like !== "boolean") {
            throw new BadRequestError("'like' deve ser boolean")
        }

        const commentWithCreatorDB = await this.commentDatabase.findCommentWithCreatorById(idToLikeOrDislike)

        if (!commentWithCreatorDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const userId = payload.id
        const likeSQLite = like ? 1 : 0

        const likeDislikeDB: LikeDislikeCommentDB = {
            comment_id: commentWithCreatorDB.id,
            post_id: commentWithCreatorDB.post_id,
            user_id: userId,
            like: likeSQLite
        }

        const comment = new Comment(
            commentWithCreatorDB.id,
            commentWithCreatorDB.post_id,
            commentWithCreatorDB.creator_id,
            commentWithCreatorDB.content,
            commentWithCreatorDB.likes,
            commentWithCreatorDB.dislikes,
            commentWithCreatorDB.created_at
        )

        const likeDislikeExists = await this.commentDatabase
            .findLikeDislike(likeDislikeDB)

        if (likeDislikeExists === COMMENT_LIKE.ALREADY_LIKED) {
            if (like) {
                await this.commentDatabase.removeLikeDislike(likeDislikeDB)
                comment.removeLike()
            } else {
                await this.commentDatabase.updateLikeDislike(likeDislikeDB)
                comment.removeLike()
                comment.addDislike()
            }

        } else if (likeDislikeExists === COMMENT_LIKE.ALREADY_DISLIKED) {
            if (like) {
                await this.commentDatabase.updateLikeDislike(likeDislikeDB)
                comment.removeDislike()
                comment.addLike()
            } else {
                await this.commentDatabase.removeLikeDislike(likeDislikeDB)
                comment.removeDislike()
            }

        } else {
            await this.commentDatabase.likeDislikeComment(likeDislikeDB)

            like ? comment.addLike() : comment.addDislike()
        }

        const updatedCommentDB = comment.toDBModel()
        console.log(updatedCommentDB);
        
        await this.commentDatabase.updateComment(updatedCommentDB, idToLikeOrDislike)
    }
    

    public getCommentById = async (input:GetCommentInputDTO): Promise<CommentModel> => {

        const { id, token } = input

        if (token === undefined) {
            throw new BadRequestError("token é necessário")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const commentsDB = await this.commentDatabase.findCommentById(id)

        if (!commentsDB) {
            throw new NotFoundError("'id' não existe")
        }

        const comment = new Comment(
            commentsDB.id,
            commentsDB.post_id,
            commentsDB.creator_id,
            commentsDB.content,
            commentsDB.likes,
            commentsDB.dislikes,
            commentsDB.created_at,
        ).toBusinessModel()

        return comment


}

}