import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const   hello = "abhi lo";

 const chan="dear";

 

    return NextResponse.json({
hello,
chan
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  } 
  

  } 
  
