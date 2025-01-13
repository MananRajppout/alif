


export interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: {
        isCandidate: boolean;
        isEmployer: boolean;
    };
}