<script>
    import {Route, Router} from "svelte-navigator";
    import Navbar from "./components/Navbar.svelte";
    import HomePage from "./pages/HomePage.svelte";
    import io from "socket.io-client"
    import LandingPage from "./pages/LandingPage.svelte";
    import About from "./pages/About.svelte";

    import Contact from "./pages/Contact.svelte";
    import Account from "./pages/Account.svelte";
    import {preferences, socketConfig} from './stores/globalStore.js';
    import Calendar from "./components/Calendar.svelte";
    import fourOfour from "./components/fourOfour.svelte";
    import Report from "./pages/Report.svelte";
    import Verification from "./pages/Verification.svelte";

    const socket = io(socketConfig
        , {
            withCredentials: true
        });
    socket.on("connect", () => {
        socket.emit("session")
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
        <Route path="/report" component={Report}/>
    {:else}
        <Route path="/" component={LandingPage}/>
    {/if}
    <Route path="/verify/:userId/:uniqueString" let:params component={Verification}/>
    <Route path="/about" component={About}/>
    <Route path="/contact" component={Contact}/>
    <Route path="*" component={fourOfour}/>
</Router>


<style>

</style>


