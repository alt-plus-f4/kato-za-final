import NextAuth, { getServerSession, NextAuthOptions } from 'next-auth';
import { db } from './db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(db),
	session: {
		strategy: 'jwt',
	},
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: {},
				password: {},
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) return null;

				let user;
				try {
					user = await db.user.findUnique({
						where: { email: credentials.email },
						select: {
							id: true,
							name: true,
							email: true,
							password: true,
							image: true,
						},
					});
				} catch (error) {
					console.log('Error while finding user:', error);
					return null;
				}

				if (user) {
					if (user.password === credentials.password) return user;
					return null;
				}

				try {
					user = await db.user.create({
						data: {
							email: credentials.email,
							password: credentials.password,
						},
					});
				} catch (error) {
					console.error('Error while creating user:', error);
					return null;
				}

				return user;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.name = user.name;
				token.picture = user.image;
				token.email = user.email;
			}

			return token;
		},
		async session({ session, token }) {
			console.log('SESSION CALLBACK', { session, token });
			if (token) {
				session.user = {
					id: (token.id as string) || '',
					name: (token.name as string) || '',
					email: token.email || '',
					image: token.picture || '',
				};
			}
			return session;
		},
	},
};

export const getAuthSession = () => getServerSession(authOptions);
export default NextAuth(authOptions);
