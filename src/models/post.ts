import { PostDB, PostModel } from "../types"

export class Post {
    constructor(
        private id: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private comments: number,
        private createdAt: string,
        private creatorId: string,
        private creatorName: string,
    ) { }

   
    public getId(): string{
        return this.id
    }

    public getContent(): string{
        return this.content
    }

    public setContent(value: string): void{
        this.content = value
    }

    public getLikes(): number{
        return this.likes
    }

    public setLikes(value: number): void{
        this.likes = value
    }
    
    public addLike(){
        this.likes += 1
    }

    public removeLike(){
        this.likes -= 1
    }

    public addDislike(){
        this.dislikes += 1
    }

    public removeDislike(){
        this.dislikes -= 1
    }

    public getDislikes(): number{
        return this.dislikes
    }

    public setDislikes(value: number): void{
        this.dislikes = value
    }
  
    public getCreatedAt(): string{
        return this.createdAt
    }

    public setCreatedAt(value: string){
        this.createdAt = value
    }

  

    public getCreatorId(): string {
        return this.creatorId
    }

    public setCreatorId(value: string): void {
        this.creatorId = value
    }

    public getCreatorName(): string {
        return this.creatorName
    }

    public setCreatorName(value: string): void {
        this.creatorName = value
    }

    public getComments():number{
        return this.comments
    }

    public setComments(value:number){
        this.comments = value
    }




    public toBusinessModel(): PostModel {
        return {
            id: this.id,
            content: this.content,
            comments:this.comments,
            likes: this.likes,
            dislikes: this.dislikes,
            createdAt: this.createdAt,
            creator: {
                id: this.creatorId,
                nickname: this.creatorName
            }
        }
    }


public toDBModel(): PostDB {
    return {
        id: this.id,
        content: this.content,
        comments: this.comments,
        likes: this.likes,
        dislikes:this.dislikes,
        created_at: this.createdAt,
        creator_id: this.creatorId,
    }
}}
