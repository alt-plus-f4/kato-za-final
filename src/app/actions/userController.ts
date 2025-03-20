'use server'

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

function isAlphaNumeric(str: string) {
    return /^[a-zA-Z0-9]+$/.test(str);
}

export const logout = async () => {
    (await cookies()).delete("validationToken");
    redirect("/");
}

export const login = async (formData: FormData) => {
    const errors: { username?: string, password?: string } = {}

    const NewUser = {
        username: formData.get('username'),
        password: formData.get('password')
    }

    if(typeof NewUser.username != "string") NewUser.username = ""
    if(typeof NewUser.password != "string") NewUser.password = ""

    try{
        const user = await prisma.user.findFirst({
            where: {
                username: NewUser.username
            }
        });

        if(!user){
            errors.username = "User not found"
            return {
                success: false,
                errors: errors
            }
        }

        const passwordMatch = bcrypt.compareSync(NewUser.password, user.password);

        if(!passwordMatch){
            errors.password = "Incorrect password"
            return {
                success: false,
                errors: errors
            }
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const TokenValue: string = jwt.sign({userId: user.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7}, process.env.JWT_SECRET);

        (await cookies()).set("validationToken", TokenValue, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            secure: true
        });

    }
    catch(err){
        console.error("Error logging in:", err);
        return {
            success: false,
            errors: errors
        }
    }
    return redirect("/");
}

export const register = async (formData: FormData) =>
{
    const errors: { username?: string, email?: string, password?: string } = {}

    const NewUser = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password')
    }

    if(typeof NewUser.username != "string") NewUser.username = ""
    if(typeof NewUser.email != "string") NewUser.email = ""
    if(typeof NewUser.password != "string") NewUser.password = ""

    NewUser.username = NewUser.username.trim()
    NewUser.email = NewUser.email.trim()

    if(NewUser.username.length < 3) errors.username = "Username must be at least 3 characters long"
    if(NewUser.username.length > 30) errors.username = "Username cannot exceed 30 characters"
    if(!isAlphaNumeric(NewUser.username)) errors.username = "Username can only contain letters and numbers"
    if(NewUser.username === "") errors.username = "You must provide a username"

    if(NewUser.email === "") errors.email = "You must provide an email"
    if(NewUser.email.length < 5) errors.email = "Email must be at least 5 characters long"
    if(NewUser.email.length > 50) errors.email = "Email cannot exceed 50 characters"

    if(NewUser.password === "") errors.password = "You must provide a password"
    if(NewUser.password.length < 12) errors.password = "Password must be at least 12 characters long"
    if(NewUser.password.length > 50) errors.password = "Password cannot exceed 50 characters"

    if(Object.keys(errors).length > 0){
        return {
            success: false,
            errors: errors
        }
    }
    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: NewUser.username },
                    { email: NewUser.email }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.username === NewUser.username) {
                errors.username = "Username is already taken";
            }
            if (existingUser.email === NewUser.email) {
                errors.email = "Email is already in use";
            }
            return {
                 success: false, 
                 errors: errors
            };
        }

        const hashedPassword = bcrypt.hashSync(NewUser.password, 10);

        const createdUser = await prisma.user.create({
            data: {
                username: NewUser.username,
                email: NewUser.email,
                password: hashedPassword
            }
        });

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const TokenValue: string = jwt.sign({userId: createdUser.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7}, process.env.JWT_SECRET);

        (await cookies()).set("validationToken", TokenValue, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            secure: true
        });

        return {
            success: true,
            userId: createdUser.id
        };

    } catch (error) {
        console.error("Error saving user:", error);
        return {
            success: false,
            errors: errors
        };
    }
}