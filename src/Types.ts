export type TUserDB = {
    id: string,
    nickname: string,
    email: string,
    password: string,
    created_at: string
}



export interface UserDB {
    id: string,
    nickname: string,
    email: string,
    password: string,
    created_at: string
}

export interface UserModel {
    id: string,
    nickname: string,
    email: string,
    password: string,
    createdAt: string
}


export interface TokenPayload {
    id: string,
    nickname: string,
}


export type PostDB = {
    id: string,
    creator_id: string,
    content: string,
    comments:number,
    likes: number,
    dislikes:number,
    created_at: string,
}

export interface UpdatedPost {
    content: string,
    likes: number,
    dislikes: number
}

export interface PostModel {
    id: string,
    content: string,
    comments:number,
    likes: number,
    dislikes:number,
    createdAt: string,
    creator: {
        id: string,
        nickname: string
    }
}

export interface PostCreatorDB extends PostDB {
    creator_name: string
}

export enum POST_LIKE{
    ALREADY_LIKED = "ALREADY LIKED",
    ALREADY_DISLIKED = "ALREADY DISLIKED"

}

export interface LikeDislikeDB{
    user_id: string,
    post_id: string,
    like: number
}

////comments

export interface CommentDB {
    id: string,
    post_id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string
}


export interface CommentWithCreatorDB extends CommentDB {
    creator_name: string
}

export interface CommentModel {
    id: string,
    postId: string,
    creatorId: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string
}

export interface LikeDislikeCommentDB {
    post_id: string,
    comment_id: string,
    user_id: string,
    like: number
}
export enum COMMENT_LIKE{
    ALREADY_LIKED = "ALREADY LIKED",
    ALREADY_DISLIKED = "ALREADY DISLIKED"

}