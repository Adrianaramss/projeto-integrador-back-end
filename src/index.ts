import express, { Request, Response } from 'express'
import { userRouter } from './router/userRouter'
import { postRouter } from './router/postRouter'
import { commentRouter} from './router/commentRouter'
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})



app.use("/users", userRouter)
app.use("/posts", postRouter )
app.use("/comment", commentRouter)
