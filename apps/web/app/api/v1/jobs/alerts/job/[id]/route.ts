import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Extract the 'id' parameter from the URL

  try {
    // Here you can perform operations using the 'id', like fetching data from a database
    // For demonstration, we're just returning a message.
    
    return NextResponse.json({
      message: `Successfully fetched alert jobs result for ID: ${id}`,
    });
  } catch (e: any) {
    return NextResponse.json(
      { message: "Server Error", error: e.message },
      { status: 500 }
    );
  }
}
