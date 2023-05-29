<script>
    import {Route, Router} from "svelte-navigator";
    import Navbar from "./components/Navbar.svelte";
    import HomePage from "./pages/HomePage.svelte";
    import io from "socket.io-client"
    import LandingPage from "./pages/LandingPage.svelte";
    import About from "./pages/About.svelte";

    import Contact from "./pages/Contact.svelte";
    import Account from "./pages/Account.svelte";
    import {preferences, socket} from './stores/globalStore.js';
    import Calendar from "./components/Calendar.svelte";

    $socket = io(import.meta.env.VITE_SOCKET_URL, {
        transports: ['websocket'],
        upgrade: false
    });
    $socket.on("connect", () => {
        $socket.emit("session")
    });

    let loggedIn;
    preferences.subscribe(value => {
        loggedIn = value.loggedIn
    })
</script>

<main>

    <Navbar/>

</main>


<Router>
    {#if loggedIn}
        <Route path="/" component={HomePage}/>
        <Route path="/account" component={Account}/>
        <Route path="/book/:item" component={Calendar}/>
    {:else}
        <Route path="/" component={LandingPage}/>
    {/if}
    <Route path="/about" component={About}/>
    <Route path="/contact" component={Contact}/>
</Router>


<style>

</style>


