import { writable } from "svelte/store"
import { persisted } from 'svelte-local-storage-store'
import { io } from 'socket.io-client';

export const socket = writable();

export const preferences = persisted('preferences',
    {
    theme: 'dark',
    loggedIn: false,
    username: null,
    showLogin: false
});
export const myUsername = writable()
export const BASE_URL = writable(import.meta.env.BASE_URL)