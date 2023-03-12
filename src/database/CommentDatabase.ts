import { CommentWithCreatorDB,CommentDB, LikeDislikeCommentDB,COMMENT_LIKE } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class CommentDatabase extends BaseDatabase {

    public static TABLE_COMMENT = "comments_posts"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"
    public static TABLE_COMMENT_LIKES_DISLIKES = "comments_likes_dislikes"

    public getCommentWithCreators = async (): Promise<CommentWithCreatorDB[]> => {
        const result: CommentWithCreatorDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .select(
                "comments_posts.id",
                "comments_posts.content",
                "comments_posts.post_id",
                "comments_posts.creator_id",
                "comments_posts.likes",
                "comments_posts.dislikes",
                "comments_posts.created_at",
                "users.nickname AS creator_name"
            )
            .join("users", "comments_posts.creator_id", "=", "users.id")

        return result
    }
    public async insertComment(newCommentDB: CommentDB): Promise<void> {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .insert(newCommentDB)
    }

   
    public findCommentWithCreatorById = async (
        commentId: string
     ): Promise<CommentWithCreatorDB | undefined> => {
         const result: CommentWithCreatorDB[] = await BaseDatabase
             .connection(CommentDatabase.TABLE_COMMENT)
             .select(
                "comments_posts.id",
                "comments_posts.content",
                "comments_posts.post_id",
                "comments_posts.creator_id",
                "comments_posts.likes",
                "comments_posts.dislikes",
                "comments_posts.created_at",
                "users.nickname AS creator_name"
             )
             .join("users", "comments_posts.creator_id", "=", "users.id")
             .where("comments_posts.id", commentId)
 
         return result[0]
     }
   

    public updateComment = async (newCommentDB: CommentDB, id: string): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .update(newCommentDB)
            .where({ id })
    }

    public deleteComment = async(id: string): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .delete()
            .where({ id })
    }
    public findLikeDislike = async (likeDislikeDBToFind: LikeDislikeCommentDB): Promise<COMMENT_LIKE | null> => {
        const [likeDislikeDB]: LikeDislikeCommentDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT_LIKES_DISLIKES)
            .select()
            .where({
                post_id: likeDislikeDBToFind.post_id,
                user_id: likeDislikeDBToFind.user_id,
                comment_id: likeDislikeDBToFind.comment_id
            })

        if (likeDislikeDB) {
            return likeDislikeDB.like === 1
                ? COMMENT_LIKE.ALREADY_LIKED
                : COMMENT_LIKE.ALREADY_DISLIKED

        } else {
            return null
        }
    }

    public removeLikeDislike = async (likeDislikeDB: LikeDislikeCommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT_LIKES_DISLIKES)
            .delete()
            .where({
                post_id: likeDislikeDB.post_id,
                user_id: likeDislikeDB.user_id,
                comment_id: likeDislikeDB.comment_id
            })
    }

    public updateLikeDislike = async (likeDislikeDB: LikeDislikeCommentDB) => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT_LIKES_DISLIKES)
            .update(likeDislikeDB)
            .where({
                post_id: likeDislikeDB.post_id,
                user_id: likeDislikeDB.user_id,
                comment_id: likeDislikeDB.comment_id
            })
    }
    public likeDislikeComment = async (likeDislike: LikeDislikeCommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT_LIKES_DISLIKES)
            .insert(likeDislike)
    }
}