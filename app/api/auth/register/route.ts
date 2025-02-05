import { NextRequest,NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(request:NextRequest) {
    try {
        const {email,password} = await request.json();

        if(!email || !password){
            return NextResponse.json(
                {error : "Email and Password are required !"},
                {status : 400 },
            )
        }

        await connectToDatabase();

        const user = await User.findOne({email})

        if(user){
            return NextResponse.json(
                {error : "Email already registered !!"},
                {status : 400 },
            )
        }
        
        await User.create({
            email,
            password
        })

        return NextResponse.json(
            {message : "User registered successfully !"},
            {status : 201 },
        )
    } catch (error) {
        return NextResponse.json(
            {error:"Something Went Wrong !!"},
            {status : 500 },
        )
    }
}

// // How to fetch APi on frontend
// const res =await fetch("/api/auth/register",{
//     method : "POST",
//     headers : {"Content-Type" : "application/json"},
//     body : JSON.stringify({email , password})
// })

// res.json();