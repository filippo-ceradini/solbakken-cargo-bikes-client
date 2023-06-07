import { writable } from "svelte/store"
import { persisted } from 'svelte-local-storage-store'
import { io } from 'socket.io-client';
import toastr from "toastr";

export const preferences = persisted('preferences',
    {
    theme: 'dark',
    loggedIn: false,
    username: null,
    showLogin: false
});

export const socketConfig = import.meta.env.VITE_SOCKET_URL
export const createBookingRef = writable(false)
export const myUsername = writable()
export const BASE_URL = writable(import.meta.env.BASE_URL)

export const toastr1000 = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "1000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

export const toastr4000 = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "4000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}