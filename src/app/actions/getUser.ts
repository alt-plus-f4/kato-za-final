import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUserFromCookie() {
    const token = (await cookies()).get("validationToken")?.value;
    if(token){
        try{
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error("JWT_SECRET is not defined");
            }
            const decoded = jwt.verify(token, secret);
            return decoded;
        }
        catch(err){
            return null;
        }
    }
}