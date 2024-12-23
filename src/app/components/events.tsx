// src/app/components/events.tsx
"use client";
import { useState, useEffect, FormEvent } from 'react';
import { Event as EventModel } from '../../models/event';
import { remult, UserInfo } from "remult";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';

const eventRepo = remult.repo(EventModel);

export default function Event() {
	const [events, setEvents] = useState<EventModel[]>([]);
	const [newEventTitle, setNewEventTitle] = useState("");
	const session = useSession();
	const router = useRouter();

	useEffect(() => {
		if (session.status === "unauthenticated")
			router.push('/home');
		else if (session.status === "authenticated")
			remult.user = session.data?.user as UserInfo;
		eventRepo.find({
			orderBy: {
				createdAt: 'desc'
			}
		}).then((info) => setEvents(info));
	}, [session]);
	;
	async function addEvent(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!remult.user) return;
		try {
			await eventRepo.insert({
				eventName: newEventTitle,
				eventDate: new Date().toISOString().split('T')[0],
				eventLocation: '',
				numberOfAttendees: 0,
				lunchTime: false
			});
			setNewEventTitle("");
		} catch (error: any) {
			console.error('Error adding event:', error);
			alert(error.message);
		}
	}

	async function deleteEvent(event: EventModel) {
		try {
			await eventRepo.delete(event);
			setEvents(events.filter(t => t.id !== event.id));
		} catch (error: any) {
			alert(error.message);
		}
	}

	function handleEventClick(event: EventModel) {
		router.push(`/events/${event.id}`);
	}

	// Type assertion to include roles
	const user = session.data?.user as UserInfo & { roles?: string[] };
	const isMaitre = user?.roles?.includes('maitre');

	if (session.status === "unauthenticated") return <> </>;
	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Events </h1>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{events.map(event => (
					<div key={event.id} className="bg-white shadow-md rounded-lg p-4 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 text-gray-500" onClick={() => handleEventClick(event)}>
						<h2 className="text-xl font-semibold mb-2">{event.eventName}</h2>
						<p className="text-gray-600 mb-4">{event.eventLocation || 'Location non impostata'}</p>
						<div className="flex justify-between items-center">
							<p className="text-sm text-gray-500">
								{event.eventDate
									? new Date(event.eventDate).toLocaleDateString()
									: 'Data non impostata'}
							</p>
							<p className="text-sm text-gray-500">{event.lunchTime ? 'Pranzo' : 'Cena'}</p>
							<p className="text-sm text-gray-500">{event.numberOfAttendees} attendees</p>
						</div>
					</div>
				))}
			</div>
			{isMaitre && (
				<form onSubmit={addEvent} className="fixed bottom-4 right-4 flex space-x-2">
					<input
						type="text"
						value={newEventTitle}
						onChange={(e) => setNewEventTitle(e.target.value)}
						placeholder="New Event Name"
						className="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						type="submit"
						className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
					>
						Add Event
					</button>
				</form>
			)}
		</div>
	);
}
