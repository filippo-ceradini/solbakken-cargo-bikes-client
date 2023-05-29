<script>
    import {socket} from '../stores/globalstore.js';
    import {useParams} from "svelte-navigator";
    import toastr from 'toastr';

    const params = useParams();

    let now = new Date()
    $: console.log($params.item); // -> { id: "123", splat: "pauls-profile" }


    let hours = Array(24).fill(null).map((_, i) => i);
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; // Start the week on Monday

    let availability = {}
    let currentDay = days[now.getDay() === 0 ? 6 : now.getDay() - 1]; // Adjust for starting the week on Monday
    let currentHour = now.getHours(); // get the current hour

    let dayDates = Array(7).fill(null).map((_, i) => {
        let d = new Date();
        d.setDate(now.getDate() + i); // add 'i' days to the current date
        return d;
    });


    days.forEach(day => {
        if (day === currentDay) {
            availability[day] = Array(24).fill('Available').map((_, hour) => hour >= currentHour ? 'Available' : 'Past');
        } else {
            availability[day] = Array(24).fill('Available');
        }
    });



    // Function to format the date in European format (dd.mm.yyyy)
    function formatDate(date) {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
    }

    let weekOffset = 0; // Current week offset

    // Recalculate dates when weekOffset changes
    $: dayDates = Array(7).fill(null).map((_, i) => {
        let d = new Date();
        d.setDate(now.getDate() + i + weekOffset * 7); // add 'i' days and weekOffset * 7 days to the current date
        //do not return a date in the past
        if (d < now) {
            d = now;
        }
        return d;
    });

    // Function to move to the next/previous week
    function navigateWeek(offset) {
        weekOffset += offset;
        updateWeekAvailability();
    }

    let selectedBike = '64675ee4253ddd95f01b580e'; // The currently selected bike

    let weekZero = weekOffset === 0;

    import {onMount} from 'svelte';

    let bookings = []; // The current bookings

    // Fetch bookings for the selected bike when the component mounts and whenever the selected bike changes
    onMount(fetchBookings);
    $: selectedBike, fetchBookings();

    async function fetchBookings() {
        // Replace 'selectedBike' with the actual bike ID
        $socket.emit('getBookings');
        // Listen for booking updates from the server
        $socket.on('booking-messages', (message) => {
            if (message.status === 200) {
                bookings = message.bookings;
                updateAvailability();
            } else {
                toastr.error(message.message);
            }
        });
    }


    function updateAvailability() {
        bookings.forEach(booking => {
            let bookingDate = new Date(booking.startTime);
            let day = days[bookingDate.getDay() === 0 ? 6 : bookingDate.getDay() - 1]; // Adjust for starting the week on Monday
            let hour = bookingDate.getHours();
            availability[day][hour] = 'Booked';
        });
    }

    function updateWeekAvailability() {
        // Reset the availability map
        availability = {}

        // Calculate the new dates for the week
        dayDates = Array(7).fill(null).map((_, i) => {
            let d = new Date();
            d.setDate(now.getDate() + i + weekOffset * 7); // add 'i' days and weekOffset * 7 days to the current date
            return d;
        });

        // Recreate the availability map based on the new dates
        days.forEach(day => {
            if (day === currentDay) {
                availability[day] = Array(24).fill('Available').map((_, hour) => hour >= currentHour ? 'Available' : 'Past');
            } else {
                availability[day] = Array(24).fill('Available');
            }
        });

        // Fetch the bookings for the new week
        fetchBookings();
    }


    async function bookBike(day, hour) {
        toastr.success(`Bike booked for ${day} at ${hour}:00`);
        if (availability[day][hour] !== 'Booked' && availability[day][hour] !== 'Past') {
            let bookingDate = dayDates[days.indexOf(day)]; // Get the date for the selected day
            let year = bookingDate.getFullYear();
            let month = bookingDate.getMonth();
            let date = bookingDate.getDate();
            $socket.emit("ciao")
            $socket.emit('createBooking', {
                startTime: new Date(year, month, date, hour),
                endTime: new Date(year, month, date, hour + 1),
                itemID: selectedBike
            });
        }
    }
</script>

<main style="padding-top: 70px;">
    <div>
        {#if weekOffset !== 0}
            <a on:click={() => navigateWeek(-1)}>⬅️</a> <!-- Navigate to previous week -->
        {/if}

        <label>
            <input type="radio" bind:group={selectedBike} value="64675ee4253ddd95f01b580e">
            Bike 1
        </label>
        <label>
            <input type="radio" bind:group={selectedBike} value="6467cf90314e17fe4414a17f">
            Bike 2
        </label>
        <a on:click={() => navigateWeek(1)}>➡️</a> <!-- Navigate to next week -->

    </div>

    <table class="table-container">
        <thead>
        <tr>

            {#each days as day, i (day)}
                <th class="cell">
                    <h4>{formatDate(dayDates[i])}</h4>
                    <h5>{day}</h5>
                </th>
            {/each}

        </tr>
        </thead>
        <tbody>
        {#each hours as hour}
            <tr>
                {#each days as day}
                    <td class="cell {availability[day][hour]}"
                        on:click={() => bookBike(day, hour)}>
                        {hour}:00
                    </td>
                {/each}
            </tr>
        {/each}
        </tbody>
    </table>
</main>







<style>

    @media (max-width: 600px) {
        th h4, th h5 {
            font-size: smaller;
        }
    }
    .cell {
        height: 3vh; /* smaller height */
        width: 10vmax; /* larger width */
        align-items: center;
        justify-content: center;
        border: 1px solid #ddd;
        box-sizing: border-box; /* makes sure the border is included in the element's total width and height */
    }

    .cell.Available {
        background-color: green;
        color: white;
        cursor: pointer;
    }

    .cell.Past {
        background-color: grey;
        color: white;
    }

    .cell.Booked {
        background-color: red;
        color: white;
    }

</style>
