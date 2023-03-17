import { UserDatabase } from "../database/UserDatabase"
import { GetUsersInput, GetUsersOutput, LoginInput, LoginOutput, SignupInput, SignupOutput } from "../dtos/UserDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundErro"
import { User } from "../models/User"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { TokenPayload } from "../services/TokenManager"
import { UserDB } from "../types"



export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,

    ) {}

    public getUsers = async (input: GetUsersInput): Promise<GetUsersOutput> => {
        const { q } = input

        if (typeof q !== "string" && q !== undefined) {
            throw new BadRequestError("'q' deve ser string ou undefined")
        }

        const usersDB = await this.userDatabase.findUsers(q)

        const users = usersDB.map((userDB) => {
            const user = new User(
                userDB.id,
                userDB.nickname,
                userDB.email,
                userDB.password,
                userDB.created_at
            )

            return user.toBusinessModel()
        })

        const output: GetUsersOutput = users

        return output
    }

    public signup = async (input: SignupInput): Promise<SignupOutput> => {
        const { nickname, email, password } = input

      

        if (typeof nickname !== "string") {
            throw new BadRequestError("'nickname' deve ser string")
        }

        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }

        const id = this.idGenerator.generate()
        
      

        const newUser = new User(
            id,
            nickname,
            email,
            password,
            new Date().toISOString()
        )

        const newUserDB = newUser.toDBModel()
        await this.userDatabase.insertUser(newUserDB)

        const tokenPayload: TokenPayload = {
            id: newUser.getId(),
            nickname: newUser.getNickname()
        }

        const token = this.tokenManager.createToken(tokenPayload)

        const output: SignupOutput = {
            message: "Cadastro realizado com sucesso",
            token: token
        }

        return output
    }

    public login = async (input: LoginInput): Promise<LoginOutput> => {
        const { email, password } = input

        if (typeof email !== "string") {
            throw new Error("'email' deve ser string")
        }

        if (typeof password !== "string") {
            throw new Error("'password' deve ser string")
        }

        // const userDB = await this.userDatabase.findUserByEmail(email)
        const userDB: UserDB | undefined = await this.userDatabase.findUserByEmail(email)

        if (!userDB) {
            throw new NotFoundError("'email' não cadastrado")
        }

        if (password !== userDB.password) {
            throw new BadRequestError("'email' ou 'password' incorretos")
        }

        const tokenPayload: TokenPayload = {
            id: userDB.id,
            nickname: userDB.nickname,
        }

        const token = this.tokenManager.createToken(tokenPayload)

        const output: LoginOutput = {
            message: "Login realizado com sucesso",
            token: token
        }

        return output
    }
}