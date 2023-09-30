import express from 'express'
import { createUser, getUserByEmail } from '../db/users'
import { authentication, random } from '../helpers/index'
export const login = async (req:express.Request,res:express.Response)=>{
 try {
    const {email,password} = req.body
    if(!email || !password){
        res.sendStatus(400).json({message:"All fields required"})
    }
    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password')
     if(!user){
        return res.sendStatus(400).json({message:"User does not exist "})
     }
     const expectedHash = authentication(user.authentication.salt,password)
     if (user.authentication.password != expectedHash){
        return res.sendStatus(403).json({message:"Wrong Password"})
     }
     const salt = random()
      user.authentication.sessionToken = authentication(salt, user._id.toString())
    await user.save()
    res.cookie('AUTH',user.authentication.sessionToken,{domain:'localhost',path:"/"})
    res.status(200).json(user).end()
 } catch (error) {
    console.log('Error',error)
    res.sendStatus(400)
 }
}


export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body;
        console.log("Request body:",req.body)
        if (!email || !password || !username) {
            return res.sendStatus(400);
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });
        // Send the user data as JSON in the response
        console.log('User:',user)
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500); // Use 500 for internal server error
    }
};



