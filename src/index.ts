import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { userRouter } from './Router/userRouter'
import { postRouter } from './Router/postRouter'
import { commentRouter} from './Router/commentRouter'


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
