import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import { UserInfo } from "remult";

const auth = NextAuth({providers: [
    Credentials({
        credentials : {
            name : {
                placeholder: "Try steve or Jane"
            }
        },
        authorize: (credentials) => findUser(credentials?.name)||null,
    }),
]});

export {auth as GET, auth as POST};

const validUsers: UserInfo[] = [
    {id: "1", name: "Steve"},
    {id: "2", name: "Jane"}
];

function findUser(name?: string){
    return validUsers.find((user) => user.name === name);
}
