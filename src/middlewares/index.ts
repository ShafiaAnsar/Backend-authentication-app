import express from 'express'
import {get,merge} from 'lodash'
import {getUserBySessionToken} from '../db/users'

export  const isAuthenticated = async(req:express.Request, res:express.Response,next:express.NextFunction)=>{
    try {
        const sessionnToken = req.cookies['AUTH']
        if(!sessionnToken){
            return res.sendStatus(403)
        }
        const existingUser = getUserBySessionToken(sessionnToken)
        if(!existingUser){
            return res.sendStatus(403)
        }
        merge(req,{identity:existingUser})
        return next()
    } catch (error) {
        console.log(error)
        res.sendStatus(400)
    }

}