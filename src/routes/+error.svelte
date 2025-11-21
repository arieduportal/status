<script lang="ts">
    import { page } from '$app/state';
    import { fade } from 'svelte/transition';

    const status = $derived(page.status);
    const message = $derived(page.error?.message || 'Something went wrong');

    const errorInfo = $derived({
      404: {
        title: "Page Not Found",
        description: "The page you're looking for doesn't exist or has been moved.",
        emoji: "🔍",
        cta: "Back to Home"
      },
      500: {
        title: "Server Error",
        description: "Our servers are having trouble processing your request.",
        emoji: "⚠️",
        cta: "Try Again"
      },
      default: {
        title: "Oops!",
        description: message,
        emoji: "😕",
        cta: "Go Home"
      }
    }[status] || errorInfo.default);
  </script>

  <svelte:head>
    <title>{status} - {errorInfo.title}</title>
  </svelte:head>

  <div
    class="min-h-screen font-code bg-slate-50 flex flex-col items-center justify-center p-8 bg-linear-to-br from-gray-50 to-gray-100"
    in:fade={{ duration: 300 }}
  >
    <main class="max-w-lg w-full bg-white rounded-2xl shadow-lg p-10">
      <div class="text-6xl mb-6" aria-hidden="true">{errorInfo.emoji}</div>

      <h1 class="text-3xl font-bold text-black mb-4">
        {status || 'Error'}: {errorInfo.title}
      </h1>

      <p class="text-lg text-[#2f2e41] mb-8 leading-relaxed">
        {errorInfo.description}
      </p>

      <div class="flex gap-4 justify-center flex-wrap">
        <a
          href="/"
          class="px-6 py-3 rounded-full font-semibold transition-all
                 bg-[#2f2e41] text-white hover:bg-gray-800 hover:-translate-y-0.5"
        >
          {errorInfo.cta}
        </a>

        {#if status === 404}
          <a
            href="https://axiolot.com.ng/contact" target="_blank"
            class="px-6 py-3 rounded-full font-semibold transition-all
                   bg-white text-[#6c63ff] border border-gray-200 hover:bg-gray-50"
          >
            Report Broken Link
          </a>
        {:else}
          <button
            on:click={() => location.reload()}
            class="px-6 py-3 rounded-full font-semibold transition-all
                   bg-white text-[#6c63ff] border border-gray-200 hover:bg-gray-50"
          >
            Refresh Page
          </button>
        {/if}
      </div>
    </main>

    <footer class="mt-12 text-gray-500 text-sm">
      <p>Need help? <a href="https://axiolot.com.ng/contact" target="_blank"  class="text-[#6c63ff] hover:underline">Contact support</a></p>
    </footer>
  </div>
