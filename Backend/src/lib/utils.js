import jwt from "jsonwebtoken"
import dotenv from "dotenv"
// Make sure to use express.json() middleware in your main server file to parse JSON bodies

dotenv.config();
export const generateToken = (userId, res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d",
    })
    res.cookie("jwt",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV !== "development",
        sameSite:"strict",
        maxAge:30*24*60*60*1000,
    })

    return token;
}
