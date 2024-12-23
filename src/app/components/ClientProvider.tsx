// src/app/components/ClientProvider.tsx
'use client';

import { SessionProvider } from "next-auth/react";
import Navbar from './navbar'

export default function ClientProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SessionProvider>
			<Navbar />
			<div className="pt-16">
				{children}
			</div>
		</SessionProvider>
	);
}
