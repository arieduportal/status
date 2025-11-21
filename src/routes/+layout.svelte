<script lang="ts">
    import { onMount } from "svelte";
    import LogRocket from "logrocket";
    import { mode, ModeWatcher } from "mode-watcher";
    import { Toaster } from "$lib/components/ui/sonner/index.js";
    import "../app.css";

    let { children } = $props();

    const isDev = import.meta.env.DEV;

    onMount(() => {
        if (!isDev) {
            LogRocket.init("71izqx/axiolot-hub");
        }
    });
</script>

<ModeWatcher />
<main>
    {@render children()}
</main>
<Toaster richColors closeButton theme={mode.current} position="top-right" />
