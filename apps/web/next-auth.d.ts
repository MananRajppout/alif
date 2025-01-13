import '@auth/core/jwt';
import { DefaultSession } from 'next-auth';

declare module '@auth/core' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      _id: string;
      fullName: {
        firstName: string | null | undefined;
        lastName: string | null | undefined;
      };
      email: string | null | undefined;
      isConfirmed: boolean;
      package: string | null | undefined;
      company: any;
      avatar: string | null | undefined;
      cloudinary_id: string | null | undefined;
      role: {
        isCandidate: boolean;
        isEmployer: boolean;
        isAdmin: boolean;
      };
      createdAt: Date;
      updatedAt: Date;
      accessToken: string;

      // By default, TypeScript merges new interface properties and overwrite existing ones. In this case, the default session user properties will be overwritten, with the new one defined above. To keep the default session user properties, you need to add them back into the newly declared interface
    } & DefaultSession['user']; // To keep the default types
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      _id: string;
      fullName: {
        firstName: string | null | undefined;
        lastName: string | null | undefined;
      };
      email: string | null | undefined;
      isConfirmed: boolean;
      package: string | null | undefined;
      company: any;
      avatar: string | null | undefined;
      cloudinary_id: string | null | undefined;
      role: {
        isCandidate: boolean;
        isEmployer: boolean;
        isAdmin: boolean;
      };
      createdAt: Date;
      updatedAt: Date;
      accessToken: string;

      // By default, TypeScript merges new interface properties and overwrite existing ones. In this case, the default session user properties will be overwritten, with the new one defined above. To keep the default session user properties, you need to add them back into the newly declared interface
    } & DefaultSession['user']; // To keep the default types
  }
  interface User {
    _id: string;
    fullName: {
      firstName: string | null | undefined;
      lastName: string | null | undefined;
    };
    email: string | null | undefined;
    isConfirmed: boolean;
    package: string | null | undefined;
    company: any;
    avatar: string | null | undefined;
    cloudinary_id: string | null | undefined;
    role: {
      isCandidate: boolean;
      isEmployer: boolean;
      isAdmin: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
    accessToken: string;
  }
}

declare module '@auth/core/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    _id: string;
    fullName: {
      firstName: string | null | undefined;
      lastName: string | null | undefined;
    };
    email: string | null | undefined;
    isConfirmed: boolean;
    package: string | null | undefined;
    company: any;
    avatar: string | null | undefined;
    cloudinary_id: string | null | undefined;
    role: {
      isCandidate: boolean;
      isEmployer: boolean;
      isAdmin: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
    accessToken: string;
  }
}
