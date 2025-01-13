import { apiProvider as apiConnector } from "@/mongo/index";
import NextAuth from 'next-auth/next';
import AppleProvider from 'next-auth/providers/apple';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' as 'jwt',
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? '',
      clientSecret: process.env.GOOGLE_SECRET ?? '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
      authorization: { params: { scope: 'openid profile email' } },
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID as string,
      clientSecret: process.env.APPLE_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Username or Email Address' },
        password: { label: 'Password', type: 'password', placeholder: 'Password' },
      },
      async authorize(credentials: Record<"username" | "password", string> | undefined) {
        if (!credentials) return null;
        const connect = await apiConnector;
        const user = await connect.userPasswordValidate({
          email: credentials.username,
          password: credentials.password,
        });

        if (user) {
          return {
            id: user?._id.toString(),
            email: user.email,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: { user: any, account: any, profile?: any, email?: any, credentials?: any }) {
      if (profile) {
        const connect = await apiConnector;
        const user = await connect.userExistValidate(profile.email);

        if (!user) return false;

        if (['google', 'github', 'facebook', 'linkedin', 'apple'].includes(account.provider)) {
          console.info(`user ${account.provider} login`);
          if (user) return true;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }: { token: any, user: any, trigger?: string, session?: any }) {
      if (trigger === 'update') {
        return { ...token, ...session.user };
      }
      return { ...token, ...user };
    },
    async session({ session, token }: { session: any, token: any }) {
      const connect = await apiConnector;
      const user = await connect.userExistValidate(token.email);
      const accessToken = await connect.signJwt({ _id: user?._id });

      if (user && user.password) {
        //@ts-ignore
        delete user.password;
      }

      session.user = { ...session.user, ...user, accessToken };

      const expires = new Date();
      expires.setHours(expires.getHours() + 24);

      return { ...session, expires: expires.toISOString() };
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };



