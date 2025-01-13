export interface IEvent {
  _id: string;
  eventName: string;
  date: string; // ISO date string format
  speakers: number;
  city: string;
  state: string;
  country: string;
  location: string;
  numberOfSeats: number;
  user: string; // User ID
  about: string;
  bulletPoints: string[];
  coverImage: string; // URL
  displayImage: string; // URL
  status: {
    isPublished: boolean;
    isApproved: boolean;
    isActive: boolean;
  };
  ticketPrice: number;
  ratingsNumber: number;
  ratingsUsers: number;
  usersRegistered: string[]; // Array of user IDs
  companiesRegistered: string[]; // Array of company IDs
  createdAt: string; // ISO date string format
  updatedAt: string; // ISO date string format
  __v: number;
}




interface IInterviewRoom {
  interviewerName: string;
  interviewerEmail: string;
  _id: string;
}

interface IRound {
  _id: string;
  event_id: string;
  opportunity_id: string;
  name: string;
  description: string;
  roundType: string;
  index: number;
  rooms: IInterviewRoom[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IOpportunity {
  _id: string;
  event_id: IEvent | string;
  user: string;
  name: string;
  description: string;
  role: string;
  rounds: IRound[];
  participants: any[]; 
  createdAt: string;
  updatedAt: string;
  __v: number;
}
