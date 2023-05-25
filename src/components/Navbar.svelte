<script>
    import { myUsername } from '../stores/globalstore.js';
    import {onMount} from 'svelte';

    import {
        Button,
        Dropdown,
        DropdownItem,
        Chevron,
        DropdownDivider,
        Navbar,
        NavBrand,
        NavHamburger,
        NavUl,
        NavLi
    } from 'flowbite-svelte';
    let group3 = 2;

    import io from "socket.io-client"

    let loggedIn = false;

    onMount(() => {
        const storedUsername = localStorage.getItem("username");
        myUsername.set(storedUsername || null);
        return myUsername.subscribe(value => {
            loggedIn = value !== null;
        });
    });




    const socket = io(import.meta.env.VITE_SOCKET_URL);

    function logout() {
        socket.emit("logout", myUsername);
        myUsername.set(null);
        localStorage.removeItem("username");
    }

</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="/">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/contact">Contact</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/about">About</a>
                </li>
            </ul>
            <ul class="navbar-nav ml-auto">
                {#if loggedIn}
                    <li>
                        <button class="dropdown-item" on:click={logout}>Logout</button>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                           data-bs-toggle="dropdown" aria-expanded="false">
                            {#if $myUsername}
                                {$myUsername}
                            {/if}
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" href="/account">Profile</a></li>
                        </ul>
                    </li>
                {:else}
                    <li class="nav-item">
                        <a class="nav-link" href="/login">Login</a>
                    </li>
                {/if}
            </ul>
        </div>
    </div>
</nav>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark p-3">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">Navbar</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class=" collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav ms-auto ">
                <li class="nav-item">
                    <a class="nav-link mx-2 active" aria-current="page" href="#">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link mx-2" href="#">Products</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link mx-2" href="#">Pricing</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link mx-2 dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Company
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <li><a class="dropdown-item" href="#">Blog</a></li>
                        <li><a class="dropdown-item" href="#">About Us</a></li>
                        <li><a class="dropdown-item" href="#">Contact us</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</nav>

<style>
    .navbar {
        width: 100%;
        z-index: 1000;
    }

    .navbar-expand-lg .navbar-collapse {
        display: flex !important;
        justify-content: space-around;
        flex-basis: auto;
    }
</style>
