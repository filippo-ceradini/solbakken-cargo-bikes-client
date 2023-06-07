<script>
    import {preferences, createBookingRef, socketConfig, toastr1000, toastr4000} from '../stores/globalStore.js';
    import io from "socket.io-client"
    import toastr from "toastr";

    export let onClose;
    let hours = 1;  // Add this line

    const socket = io(import.meta.env.VITE_SOCKET_URL, {
        withCredentials: true
    });
    let bookedBooking = "";

    //Create a booking
    async function createBooking() {
        const {bikeID, year, month, date, hour} = $createBookingRef;
        const {username} = $preferences;
        const response = await fetch(import.meta.env.VITE_API_URL + '/api/create-booking', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                startTime: new Date(year, month, date, hour),
                endTime: new Date(year, month, date, hour + hours),
                itemID: bikeID,
                userEmail: username,
            }),
        });
        const result = await response.json();

        if (response.ok) {
            if (result.message === 'Booking created successfully, but the end time was adjusted due to overlap with an existing booking') {
                toastr.options = toastr4000
                toastr.warning(result.message);
                toastr.options = toastr1000
                onClose()
            } else {
                toastr.success(result.message);
                onClose()
            }
        } else {
            toastr.error(result.message);
            onClose()
        }
    }

    function dataBooking() {

    }

    async function deleteBooking() {
        const response = await fetch(import.meta.env.VITE_API_URL + '/api/bookings/cancel', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bookingID: $createBookingRef.status.bookingId,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            toastr.success(result.message);
            onClose();
        } else {
            toastr.error(result.message);
        }
    }

    async function sendMessage() {
        try {
            const email = $preferences.username;
            const bookingId = $createBookingRef.status.bookingId;
            const response = await fetch(import.meta.env.VITE_API_URL + '/api/booking-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'credentials': 'include',
                },
                body: JSON.stringify({
                    email: email,
                    bookingId: bookingId,
                }),
            });

            const res = await response.json();
            toastr.success(res.message);
            onClose();
        } catch (e) {
            toastr.error(e.message);
        }

    }

</script>


<main>
    {#if $createBookingRef.bikeID === "6467cf90314e17fe4414a17f"}
        <img src={"https://cykelgruppen.dk/wp-content/uploads/2021/01/DK10004-scaled.jpg"} class="bike-image"
             alt="Bike 1"/>
    {:else if $createBookingRef.bikeID === "64675ee4253ddd95f01b580e"}
        <img src={'https://www.larryvsharry.com/media/wysiwyg/cms_pages/Homepage/new-Original.jpg'} class="bike-image"
             alt="Bike 1"/>
    {/if}
    {#if $createBookingRef.status === "Available"}
        <p>Book this bike for</p>
        <input type="number" bind:value={hours} placeholder="1">
        <p>hour</p>
        <button on:click={() => createBooking(1)}>Book</button>
    {:else if $createBookingRef.status.status === "BookedByMe"}
        <p>Do you want to cancel this Booking?</p>
        <p>{bookedBooking}</p>
        <button on:click={deleteBooking}>Delete</button>
    {:else}
        <p>This bike is already booked by someone else.</p>
        <p>If you really need the bike you can send an automatic email to the person who booked it...</p>
        <button on:click={sendMessage}>Send Message</button>
    {/if}
</main>


<style>
    .bike-image {
        padding: 5%;
        width: 50%; /* larger width for small screens */
        height: auto; /* This maintains the aspect ratio */
        transition: transform 0.3s ease-in-out; /* This will animate the scale effect */
    }
</style>