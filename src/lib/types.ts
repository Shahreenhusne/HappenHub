export type Category = 'Conference' | 'Workshop' | 'Meetup';
export interface EventItem {
id: number;
title: string;
description: string;
date: string; // ISO
location: string;
category: Category;
createdBy?: 'seed' | 'me';
attendees?: number; // for RSVP bonus
}
