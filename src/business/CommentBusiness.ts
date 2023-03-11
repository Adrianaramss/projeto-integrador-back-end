import { CommentDatabase } from "../database/CommentDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { GetCommentOutputDTO, GetCommentsInputDTO} from "../dtos/CommentDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { Comment } from "../models/Comment"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import {  CommentWithCreatorDB } from "../types"
import { CreateCommentInputDTO } from "../dtos/CommentDTO"
import { NotFoundError } from "../errors/NotFoundErro"


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




}