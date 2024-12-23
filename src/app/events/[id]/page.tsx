// src/app/events/[id]/page.tsx
"use client";
import { useState, useEffect, FormEvent } from 'react';
import { Event as EventModel } from '../../../models/event';
import { User as UserModel } from '../../../models/user';
import { Notification as NotificationModel } from '@/models/notification';
import { remult, UserInfo } from "remult";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const eventRepo = remult.repo(EventModel);
const userRepo = remult.repo(UserModel);
const notificationRepo = remult.repo(NotificationModel);

export default function EventEditPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
	const [event, setEvent] = useState<EventModel | null>(null);
	const [users, setUsers] = useState<UserModel[]>([]);
	const router = useRouter();
	const params = React.use(paramsPromise);
	const session = useSession();

	useEffect(() => {
		async function fetchEvent() {
			try {
				const fetchedEvent = await eventRepo.findFirst({
					id: params.id
				});
				if (fetchedEvent) {
					setEvent(fetchedEvent);
				} else {
					router.push('/home');
				}
			} catch (error: any) {
				console.error('Error fetching event:', error.message);
				router.push('/home');
			}
		}

		async function fetchUsers() {
			try {
				const fetchedUsers = await userRepo.find();
				setUsers(fetchedUsers);
			} catch (error: any) {
				console.error('Error fetching users:', error.message);
			}
		}

		if (session.status === 'unauthenticated') {
			router.push('/home');
		} else {
			fetchEvent();
			fetchUsers();
		}
	}, [params.id, session.status]);

	async function updateEvent(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (event) {
			try {
				await eventRepo.save(event);
				router.push('/');
			} catch (error: any) {
				console.error('Error updating event:', error.message);
			}
		}
	}

	async function addWaiter(userId: string) {
		if (event) {
			try {
				const updatedEvent = await eventRepo.update(event, {
					waiters: [...(event.waiters || []), userId]
				});
				setEvent(updatedEvent);

				await notificationRepo.insert({
					userId,
					message: 'Sei stato aggiunto come cameriere all\'evento: ${event.eventName}',
					read: false,
					eventId: event.id,
				});
			} catch (error: any) {
				console.error('Error adding waiter:', error.message);
			}
		}
	}

	function handleChange(field: keyof EventModel, value: EventModel[keyof EventModel]) {
		if (event) {
			setEvent(prevEvent => {
				if (prevEvent) {
					return { ...prevEvent, [field]: value, sendNotification: prevEvent.sendNotification };
				}
				return null;
			});
		}
	}

	if (!event) return null;

	const user = session.data?.user as UserInfo & { roles?: string[] };
	const isMaitre = user?.roles?.includes('maitre');

	return (
		<div className="container mx-auto">
			<h1 className="text-3xl font-bold mb-4">{event.eventName}</h1>
			<div className="flex">
				<div className="w-2/3">
					{!isMaitre && (
						<div>
							<p className="mb-4">
								<strong>Data:</strong> {event.eventDate}
							</p>
							<p className="mb-4">
								<strong>{event.lunchTime ? 'Pranzo' : 'Cena'}</strong>
							</p>
							<p className="mb-4">
								<strong>Location:</strong> {event.eventLocation}
							</p>
							<p className="mb-4">
								<strong>Numero di Persone:</strong> {event.numberOfAttendees}
							</p>
							<p className="mb-4">
								<strong>Creato il:</strong> {event.createdAt.toLocaleString()}
							</p>
							<div className="mb-8">
								<h2 className="text-2xl font-bold mb-4">Descrizione</h2>
								{event.description ? (
									<Markdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>{event.description}</Markdown>
								) : (
									<p>Nessuna descrizione disponibile.</p>
								)}
							</div>
							<div className="flex justify-start">
								<button
									type="button"
									className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
									onClick={() => router.push('/')}
								>
									Indietro
								</button>
							</div>
						</div>
					)}
					{isMaitre && (
						<form onSubmit={updateEvent}>
							<div className="mb-4">
								<label htmlFor="eventName" className="block text-gray-700 font-bold mb-2">
									Titolo dell'evento
								</label>
								<input
									type="text"
									id="eventName"
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									value={event.eventName}
									onChange={e => handleChange('eventName', e.target.value)}
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="eventDate" className="block text-gray-700 font-bold mb-2">
									Data dell'evento
								</label>
								<input
									type="date"
									id="eventDate"
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									value={event.eventDate}
									onChange={e => handleChange('eventDate', e.target.value)}
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="eventLocation" className="block text-gray-700 font-bold mb-2">
									Location dell'evento
								</label>
								<input
									type="text"
									id="eventLocation"
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									value={event.eventLocation}
									onChange={e => handleChange('eventLocation', e.target.value)}
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="numberOfAttendees" className="block text-gray-700 font-bold mb-2">
									Numero di partecipanti
								</label>
								<input
									type="number"
									id="numberOfAttendees"
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									value={event.numberOfAttendees}
									onChange={e => handleChange('numberOfAttendees', Number(e.target.value))}
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="lunchTime" className="block text-gray-700 font-bold mb-2">
									{event.lunchTime ? 'Pranzo' : 'Cena'}
								</label>
								<input
									type="checkbox"
									id="lunchTime"
									className="form-checkbox h-5 w-5 text-blue-600"
									checked={event.lunchTime}
									onChange={e => handleChange('lunchTime', e.target.checked)}
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="description" className="block text-gray-700 font-bold mb-2">
									Descrizione
								</label>
								<textarea
									id="description"
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									value={event.description || ''}
									onChange={e => handleChange('description', e.target.value)}
								/>
							</div>
							<div className="flex justify-between">
								<button
									type="button"
									className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
									onClick={() => router.push('/')}
								>
									Indietro
								</button>
								<button
									type="submit"
									className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
								>
									Salva
								</button>
							</div>
						</form>
					)}
				</div>
				{isMaitre && (
					<div className="w-1/3 pl-8">
						<h2 className="text-2xl font-bold mb-4">Aggiungi come cameriere</h2>
						<ul>
							{users.map((user) => (
								<li key={user.id} className="mb-2">
									{user.name}
									<button
										type="button"
										className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded"
										onClick={() => addWaiter(user.id)}
									>
										Aggiungi
									</button>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}
