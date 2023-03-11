import express, { Request, Response } from 'express'
import { userRouter } from './Router/userRouter'
import { postRouter } from './Router/postRouter'
import { commentRouter} from './Router/commentRouter'
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.use("/users", userRouter)
app.use("/posts", postRouter )
app.use("/comment", commentRouter)
