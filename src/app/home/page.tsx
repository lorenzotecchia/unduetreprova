// src/app/home/page.tsx
'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link'

export default function HomePage() {
	const { data: session } = useSession();

	return (
		<div className="container mx-auto">
			<h1 className="text-3xl font-bold mb-4">Welcome to Catering Management</h1>
			<p className="mb-8">
				Catering Management è una soluzione in-house per creare, gestire e tenere traccia di eventi di catering e i camerieri che ci lavorano.
			</p>
		</div>
	);
}
