'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { Bell } from 'lucide-react';
import { Allow, remult, UserInfo } from 'remult';
import { Notification as NotificationModel } from '@/models/notification';

const notificationRepo = remult.repo(NotificationModel);

const Navbar = () => {
	const [notifications, setNotifications] = useState<NotificationModel[]>([]);
	const [showNotifications, setShowNotifications] = useState(false);
	const [isMaitre, setIsMaitre] = useState(false);
	const session = useSession();

	useEffect(() => {
		const initUser = async () => {
			if (session.status === "authenticated" && session.data?.user) {
				remult.user = session.data.user as UserInfo;
				setIsMaitre((session.data.user as UserInfo & { roles?: string[] })?.roles?.includes('maitre') || false);
				await loadNotifications();
			}
		};

		initUser();
	}, [session]);

	async function loadNotifications() {
		try {
			if (!remult.user?.id) return;

			const userNotifications = await notificationRepo.find({
				where: {
					userId: remult.user.id
				}
			});
			setNotifications(userNotifications);
		} catch (error: any) {
			console.error('Error loading notifications:', error);
		}
	}

	return (
		<nav className="fixed top-0 left-0 right-0 bg-black text-white shadow-md z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					<div className="flex-shrink-0">
						<h1 className="text-xl font-bold href=/">Event Manager</h1>
					</div>

					<div className="flex items-center">
						{session.status === "authenticated" ? (
							<>
								<span className="mr-4">
									{session.data?.user?.name}
									{isMaitre && (
										<span className="ml-2 text-sm text-blue-300">(Maitre)</span>
									)}
								</span>

								<div className="relative mr-4">
									<button
										onClick={() => setShowNotifications(!showNotifications)}
										className="p-2 rounded-full hover:bg-gray-700"
									>
										<Bell className="h-6 w-6" />
										{notifications.length > 0 && (
											<span className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">
												{notifications.length}
											</span>
										)}
									</button>

									{showNotifications && (
										<div className="absolute right-0 mt-2 w-80 bg-white text-black rounded-md shadow-lg py-1 z-50">
											{notifications.length === 0 ? (
												<p className="px-4 py-2 text-gray-500">
													No new notifications
												</p>
											) : (
												notifications.map((notification) => (
													<div
														key={notification.id}
														className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
													>
														<p className="text-sm">{notification.message}</p>
														<p className="text-xs text-gray-500">
															{new Date(
																notification.createdAt
															).toLocaleString()}
														</p>
													</div>
												))
											)}
										</div>
									)}
								</div>

								<button
									onClick={() => signOut()}
									className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
								>
									Sign Out
								</button>
							</>
						) : (
							<button
								onClick={() => signIn()}
								className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
							>
								Sign In
							</button>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
