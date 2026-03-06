import jwt from "jsonwebtoken";

const SECRET = "supersecret";

export const generateToken = (userId:number) => {
    return jwt.sign({id: userId},SECRET,{expiresIn:'1d'})
}