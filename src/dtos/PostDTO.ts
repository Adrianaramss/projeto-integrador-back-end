
import { PostModel } from './../types';

export interface GetPostsInput {
    token: string | undefined
}

export type GetPostsOutput = PostModel[]


export interface CreatePostInputDTO {

    token: string | undefined
    content: string,

}

export interface CreatePostOutput {
    content: string
}


export interface DeletePostInputDTO {
    idToDelete: string,
    token: string | undefined
}

export interface EditPostInputDTO {
    idToEdit: string,
    content: string,
    token: string | undefined

}
