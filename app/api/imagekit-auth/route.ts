import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL!,
});

export async function GET() {
  try {
    const authParameter = imagekit.getAuthenticationParameters()
      return NextResponse.json(authParameter);
  } catch (error) {
    return NextResponse.json(
      { error: "ImageKit Auth failed !!" },
      { status: 500 }
    );
  }
}
