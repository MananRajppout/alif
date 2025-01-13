import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { apiProvider as apiConnector } from "@/mongo/index";

// Helper function to parse FormData
interface ParsedFormData {
  fields: { [key: string]: any };
  files: { [key: string]: any };
}

// GET: Fetch a category by ID
export async function GET(req: NextRequest, {
    params
}:{
    params: {
        id: string;
    }
}) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({
        message: "Invalid category ID",
        error: "Server Error",
      }, { status: 400 });
    }

    const connect = await apiConnector;
    const reqQuery = { categoryID: id };
    const category = await connect.getSingleCategory(reqQuery);

    return NextResponse.json({
      message: "Successfully fetched category",
      data: category,
    });
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({
      message: "Server Error",
      error: e.message,
    }, { status: 500 });
  }
}

// PUT: Update a category by ID
export async function PUT(req: NextRequest, {
    params
}: {
    params: {
        id: string;
    }
}) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;
    const headers = req.headers;
    const accessToken = headers.get("authorization")?.substring(7);

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json({
        message: "User not authenticated",
        error: "Server Error",
      }, { status: 401 });
    }

    // Parse the form data directly using formData()
    const formData = await req.formData();
    const categoryTitle = formData.get("categoryTitle")?.toString() || "";
    const subCategory = formData.get("subCategory")?.toString().split(",") || [];
    const categoryIcon = formData.get("categoryIcon") as File | null;

    const categoryData = {
      categoryTitle,
      subCategory,
    };

    const connect = await apiConnector;
    await connect.updateCategory(
      session?.user.accessToken || accessToken,
      categoryData,
      categoryIcon,
      id!
    );

    return NextResponse.json({
      message: "Successfully updated category",
    });
  } catch (e: any) {
    return NextResponse.json({
      message: "Server Error",
      error: e.message,
    }, { status: 500 });
  }
}

// DELETE: Delete a category by ID
export async function DELETE(req: NextRequest, {
    params
}: {
    params: {
        id: string;
    }
}) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;
    const headers = req.headers;
    const accessToken = headers.get("authorization")?.substring(7);

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json({
        message: "User not authenticated",
        error: "Server Error",
      }, { status: 401 });
    }

    const connect = await apiConnector;
    await connect.deleteCategory({
      accessToken: session?.user.accessToken || accessToken,
      categoryId: id,
    });

    return NextResponse.json({
      message: "Successfully deleted category",
    });
  } catch (e: any) {
    return NextResponse.json({
      message: "Server Error",
      error: e.message,
    }, { status: 500 });
  }
}
