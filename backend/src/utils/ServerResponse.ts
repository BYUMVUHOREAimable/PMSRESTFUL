import { Response } from "express"

class ServerResponse {
    status: number
    success: boolean
    message: string
    data: any

    constructor(success: boolean, message: string, data: any, status: number) {
        this.status = status
        this.success = success
        this.message = message
        this.data = data
    }

    static created(res: Response, message: string, data?: any | null) {
        return res.status(201).json(new ServerResponse(true, message, data, 201))
    }

    static success(res: Response, message: string, data?: any | null) {
        return res.status(200).json(new ServerResponse(true, message, data, 200))
    }

    static error(res: Response, message: string, data?: any | null) {
        return res.status(400).json(new ServerResponse(false, message, data, 400))
    }

    static unauthenticated(res: Response, message: string, data?: any | null) {
        return res.status(401).json(new ServerResponse(false, message, data, 401))
    }

    static notFound(res: Response, message: string, data?: any | null) {
        return res.status(404).json(new ServerResponse(false, message, data, 404))
    }

    static unauthorized(res: Response, message: string, data?: any | null) {
        return res.status(403).json(new ServerResponse(false, message, data, 403))
    }

}

export default ServerResponse