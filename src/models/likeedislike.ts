export class LikeEdislike {
    constructor(
        private user_id: string,
        private post_id: string,
        private like: boolean
       
    ) { }


    public getuser_id(): string {
        return this.user_id
    }
  
    public setuser_id(id: string): void {
        this.user_id = id
    }

    public getpost_id(): string {
        return this.post_id
    }
  
    public setpost_id(id: string): void {
        this.post_id = id
    }

    public getlike(): boolean {
        return this.like
    }
  
    public setlike(like: boolean): void {
        this.like = like
    }


}
