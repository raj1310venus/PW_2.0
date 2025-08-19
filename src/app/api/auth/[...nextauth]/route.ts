import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import twilio from "twilio";
import { getCollection } from "@/lib/mongo";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Phone",
      credentials: {
        phone: { label: "Phone", type: "text" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        const phone = credentials?.phone?.trim();
        const code = credentials?.code?.trim();
        if (!phone || !code) return null;

        // Dev bypass: accept a fixed code when enabled
        if (process.env.TWILIO_DEV_MODE === "true" && code === "123456") {
          return { id: phone, name: `User ${phone}`, phone } as any;
        }

        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;
        if (!accountSid || !authToken || !verifySid) {
          console.error("Twilio env vars missing");
          return null;
        }
        const client = twilio(accountSid, authToken);
        try {
          const result = await client.verify.v2.services(verifySid)
            .verificationChecks.create({ to: phone, code });
          if (result.status === "approved") {
            return { id: phone, name: `User ${phone}`, phone } as any;
          }
          return null;
        } catch (err) {
          console.error("Twilio verify check failed", err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Attach provider, user basics
      if (account) token.provider = account.provider;
      if (user && typeof user === 'object') {
        token.name = (user as any).name || token.name;
        token.email = (user as any).email || token.email;
        token.picture = (user as any).image || (user as any).picture || token.picture;
        (token as any).phone = (user as any).phone || (token as any).phone;
      }
      if (profile && typeof profile === 'object') {
        token.name = (profile as any).name || token.name;
        token.picture = (profile as any).picture || token.picture;
        token.email = (profile as any).email || token.email;
      }

      // Upsert user in Mongo on first sign-in in this session
      try {
        if (!(token as any)._userUpserted) {
          const users = await getCollection<any>("users");
          if (users) {
            const email = (token.email || "").toLowerCase();
            const phone = (token as any).phone || "";
            const filter = email ? { email } : phone ? { phone } : null;
            if (filter) {
              const now = new Date().toISOString();
              await users.updateOne(
                filter,
                {
                  $setOnInsert: {
                    createdAt: now,
                    email: email || null,
                    phone: phone || null,
                  },
                  $set: {
                    name: token.name || null,
                    picture: (token as any).picture || null,
                    provider: (token as any).provider || null,
                    lastLoginAt: now,
                  },
                },
                { upsert: true }
              );
              (token as any)._userUpserted = true;
            }
          }
        }
      } catch (e) {
        console.warn("User upsert failed (continuing without DB)", e);
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session as any).provider = (token as any).provider;
        (session as any).phone = (token as any).phone;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
