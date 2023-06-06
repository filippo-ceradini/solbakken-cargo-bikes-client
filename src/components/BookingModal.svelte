<script>
    import {preferences, createBookingRef} from '../stores/globalStore.js';
    import io from "socket.io-client"
    import toastr from "toastr";
    import {onMount} from "svelte";

    export let onClose;
    let hours = 1;  // Add this line

    const socket = io('localhost:8080');
    socket.on('connect', () => {
        console.log('connected');
    });
    let bookedBooking = "";

    //If the slot is already booked, get the booking
    onMount(async () => {
        console.log($createBookingRef)
        if ($createBookingRef.bookingID.lenght > 9) {
            const {bikeID, year, month, date, hour} = $createBookingRef;
            // socket.emit('getBookingsByDateAndItemId', {
            //     startTime: new Date(year, month, date, hour),
            //     endTime: new Date(year, month, date, hour + hours),
            //     itemID: bikeID,
            // });
            // socket.on('booking-messages', (data) => {
            //         if (data.status === 200) {
            //             toastr.success(data.message);
            //             alert(data.bookings)
            //         } else {
            //             toastr.error(data.message);
            //         }
            //     }
            // )
            const response = await fetch(import.meta.env.VITE_API_URL + '/api/getBooking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    startTime: new Date(year, month, date, hour + 2),
                    endTime: new Date(year, month, date, hour + 3),
                    itemID: bikeID
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result.bookings, result.user)
                toastr.success(result.message);
            } else {
                toastr.error(result.message);
            }
        }
    });

    //Create a booking
    async function createBooking() {
        console.log($preferences.email)
        const {bikeID, year, month, date, hour} = $createBookingRef;
        const {username} = $preferences;
        const response = await fetch(import.meta.env.VITE_API_URL + '/api/bookings', {
            method: 'POST',
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
            toastr.success(result.message);
            onClose()
        } else {
            toastr.error(result.message);
        }
    }

    function dataBooking() {

    }

    async function deleteBooking() {
        console.log($createBookingRef.bookingID)
        const response = await fetch(import.meta.env.VITE_API_URL + '/api/bookings/cancel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bookingID: $createBookingRef.bookingID,
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
        const response = await fetch(import.meta.env.VITE_API_URL + '/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // receiverId should be the ID of the person to send the message to
                receiverId: 'the-receiver-id',
                message: 'Do you still need the booking?',
            }),
        });

        const result = await response.json();

        if (response.ok) {
            toastr.success(result.message);
        } else {
            toastr.error(result.message);
        }
    }

</script>


<main>
    {#if $createBookingRef.bookingID === "Available"}
        <p>Book this bike for</p>
        <input type="number" bind:value={hours} placeholder="1">
        <p>hour</p>
        <button on:click={() => createBooking(1)}>Book</button>
    {:else}
        <p>Do you want to cancel this Booking?</p>
        <p>{bookedBooking}</p>
        <button on:click={deleteBooking}>Delete</button>
        <button on:click={sendMessage}>Send Message</button>
    {/if}
</main>
