<script>
    import { fade, fly } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import { onMount, onDestroy } from 'svelte';

    export let open = false;
    export let showBackdrop = true;
    export let onClosed;
    export let title = 'Modal title';

    const modalClose = (data) => {
        open = false;
        if (onClosed) {
            onClosed(data);
        }
    }

    // Function to handle keydown events
    const handleKeydown = (event) => {
        if (event.key === 'Escape') {
            modalClose('close');
        }
    }

    // Register the keydown listener on mount and remove it on destroy
    onMount(() => {
        window.addEventListener('keydown', handleKeydown);
    });

    onDestroy(() => {
        window.removeEventListener('keydown', handleKeydown);
    });

</script>

{#if open}
    <div class="modal" id="sampleModal" tabindex="-1" role="dialog" aria-labelledby="sampleModalLabel" >
        <div class="modal-dialog" role="document" in:fly={{ y: -50, duration: 300 }} out:fly={{ y: -50, duration: 300, easing: quintOut }}>
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="sampleModalLabel">{title}</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" on:click={() => modalClose('close')}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <slot></slot>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" on:click={() => modalClose('close')}>Close</button>
                </div>
            </div>
        </div>
    </div>
    {#if showBackdrop}
        <div class="modal-backdrop show" transition:fade={{ duration: 150 }}></div>
    {/if}
{/if}

<style>
    .modal {
        display: block;
    }
</style>