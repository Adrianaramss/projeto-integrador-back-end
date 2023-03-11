import { CommentWithCreatorDB,CommentDB } from "../types";
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

    
}