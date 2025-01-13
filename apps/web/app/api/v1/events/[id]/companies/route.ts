import { NextRequest, NextResponse } from "next/server";
import EventModel from "@/mongo/models/event.model";
import { apiProvider as apiConnector } from "@/mongo/index";
import { CompanyModel } from "@/mongo/models/company.model";
import JobModel from "@/mongo/models/job.model";

async function connectDB() {
  try {
    const connect = await apiConnector;
    await connect.connectDB();
    return connect;
  } catch (error: any) {
    return NextResponse.json(
      { message: "Database connection failed", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const connect = await connectDB();
    if (!connect || connect instanceof NextResponse) return connect;

    const eventId = params.id;

    // Fetch the event
    const event = await EventModel.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Fetch all companies registered for the event
    let companiesRegistered = event.companiesRegistered || [];
    const companyIds = companiesRegistered.map((company: any) => company.company);

    // Fetch detailed company data
    const companies = await CompanyModel.find({ _id: { $in: companyIds } });

    // Enrich companiesRegistered with company and job details
    companiesRegistered = await Promise.all(
      companiesRegistered.map(async (companyEntry: any) => {
        const companyDetails = companies.find(
          (c: any) => c._id.toString() === companyEntry.company.toString()
        );

        const jobs = await JobModel.find({ _id: { $in: companyEntry.jobs } });

        return {
          ...companyEntry,
          companyDetails, // Full company details
          jobsDetails: jobs, // Array of full job details
        };
      })
    );

    return NextResponse.json(
      {
        message: "Companies and job details fetched successfully",
        companiesRegistered,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch details", error: error.message },
      { status: 500 }
    );
  }
}
