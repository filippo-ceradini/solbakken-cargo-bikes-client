<script>
    import { navigate} from 'svelte-navigator';
    import {onMount} from "svelte";
    import io from "socket.io-client";
    import { preferences} from "../stores/globalStore.js";
    import toastr from "toastr";


    let bike1 = 'https://cykelgruppen.dk/wp-content/uploads/2021/01/DK10004-scaled.jpg';
    let bike2 = 'https://www.larryvsharry.com/media/wysiwyg/cms_pages/Homepage/new-Original.jpg'

    const socket = io(import.meta.env.VITE_SOCKET_URL
        , {withCredentials: true});

    let statusBike1 = "Waiting-for-status"
    let statusBike2 = "Waiting-for-status";
    onMount(() => {
        socket.emit("getBikeStatus");
        socket.on('bike-status', (data) => {
            statusBike1 = data['Nihola Bike 1'];
            statusBike2 = data['Bullitt Bike 2'];
        });
    })

    function bookBike1() {
        navigate('/book/bike1');
    }

    function bookBike2() {
        navigate('/book/bike2');
    }

    //Create a booking
    async function createBooking(bikeID) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const date = now.getDate();
        const hour = now.getHours();

        const {username} = $preferences;
        const response = await fetch(import.meta.env.VITE_API_URL + '/api/create-booking', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                startTime: new Date(year, month, date, hour),
                endTime: new Date(year, month, date, hour + 1),
                itemID: bikeID,
                userEmail: username,
            }),
        });
        console.log({
            startTime: new Date(year, month, date, hour),
            endTime: new Date(year, month, date, hour + 1),
            itemID: bikeID,
            userEmail: username})
        const result = await response.json();

        if (response.ok) {
            toastr.success(result.message);
        } else {
            toastr.error(result.message);
        }
    }

</script>

<main>
    <div class="row">
        <div class="col-lg-6 col-sm-12">
            <div class="bike-container">
                <img src={bike1} class="bike-image img-fluid" alt="Bike 1" on:click={bookBike1}/>
                <button class="status-label {statusBike1.toLowerCase()}" on:click={() =>{
                    if (statusBike1 === 'Available Now') {
                        createBooking('6467cf90314e17fe4414a17f')
                    } else {
                        toastr.error('Bike 1 is already booked')
                    }
                }}>{statusBike1}</button>
            </div>
        </div>
        <div class="col-lg-6 col-sm-12">
            <div class="bike-container">
                <img src={bike2} class="bike-image img-fluid" alt="Bike 2" on:click={bookBike2}/>
                <button class="status-label {statusBike2.toLowerCase()}" on:click={() =>{
                    if (statusBike2 === 'Available Now') {
                        createBooking('64675ee4253ddd95f01b580e')
                    } else {
                        toastr.error('Bike 2 is already booked')
                    }
                }}>{statusBike2}</button>
            </div>
        </div>
    </div>
    <button type="button" class="btn btn-warning" on:click={() => {navigate('/report')}}>Report a problem with the bikes</button>
</main>

<style>
    .bike-container {
        position: relative;
        display: block;
    }

    .status-label {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        padding: 5px 10px;
        color: white;
        font-weight: bold;
        text-transform: uppercase;
        border-radius: 5px;
    }

    .status-label.available {
        background-color: green;
    }

    .status-label.booked {
        background-color: red;
    }

    .status-label.waiting-for-status {
        background-color: #008cff;
    }

    .bike-image {
        width: 100%;
        height: auto;
        object-fit: cover;
        transition: transform 0.3s ease-in-out;
    }

    .bike-image:hover {
        transform: scale(1.05);
        cursor: pointer;
    }

    @media (max-width: 768px) {
        .bike-container {
            margin-bottom: 30px;
        }

        .status-label {
            position: initial;
            width: 100%;
            margin-top: 10px;
            left: initial;
            transform: initial;
        }
    }
</style>
