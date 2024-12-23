import NextAuth, { getServerSession } from 'next-auth/next';
import Credentials from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { UserInfo } from 'remult';

export const auth = NextAuth({
	providers: [
		Credentials({
			credentials: {
				name: {
					placeholder: "Try Steve or Jane",
				},
			},
			authorize: (credentials) => findUser(credentials?.name) || null,
		}),
		GithubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_ID as string,
			clientSecret: process.env.GOOGLE_SECRET as string,
		}),
	],
	callbacks: {
		async signIn({ user, account, profile }) {
			if (account?.provider === 'google' || account?.provider === 'github') {
				// Check if the user already exists in your custom user management system
				const existingUser = findUser(user.name);

				if (!existingUser) {
					// If the user doesn't exist, create a new user with a default role
					validUsers.push({
						id: String(validUsers.length + 1),
						name: user.name ?? '',
						roles: ['maitre'],
					});
				}
			}

			return true;
		},
		session: async ({ session }) => ({
			...session,
			user: findUser(session.user?.name),
		}),
	},
});

export { auth as GET, auth as POST };

const validUsers: UserInfo[] = [
	{ id: '1', name: 'Jane', roles: ['maitre'] },
	{ id: '2', name: 'Steve', roles: ['user'] },
];

function findUser(name?: string | null) {
	return validUsers.find((user) => user.name === name);
}

export async function getUserOnServer() {
	const session = await getServerSession();
	return findUser(session?.user?.name);
}
