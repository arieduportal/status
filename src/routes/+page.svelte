<script lang="ts">
    import { onMount } from "svelte";
    import { setMode } from "mode-watcher";
    import {
        Moon,
        Sun,
        MonitorCog,
        MonitorCheck,
        MonitorX,
        LoaderIcon,
    } from "@lucide/svelte";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import { cn } from "$lib/utils.js";
    import { PUBLIC_CDN } from "$env/static/public";
    import type { ComponentProps } from "svelte";
    import type {
        ConcurrentData,
        ApiResponse,
        DomainSummary,
        DailyRecord,
    } from "$lib/types";

    type Props = ComponentProps<typeof LoaderIcon>;

    let { class: className, ...restProps }: Props = $props();
    let message = $state("Loading operational data ...");
    let loadingStatus = $state(true);
    let errorStatus = $state(false);
    let loadingPage = $state(true);
    let errorPage = $state(false);
    let currentTheme = $derived("system");
    let domainSummary: DomainSummary | null = $state({});

    const changeMode = (mode: "light" | "dark" | "system") => {
        currentTheme = mode;
        localStorage.setItem("mode", mode);
        setMode(mode);
    };

    const days = Array.from({ length: 60 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (60 - i - 1));
        return d;
    });

    const fmt = (d: Date) => {
        return d.toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    };

    const toName = (domain: string) => {
        if (domain.includes("ai.")) return "AI Gateway";
        if (domain.includes("static.")) return "CDN Service";
        if (domain.includes("api.")) return "API Service";
        if (domain.includes("portal.")) return "Main Dashboard";
        if (domain.includes("analytics.")) return "Analytics Service";
        if (domain.includes("sites.")) return "Site Management";
        if (domain.includes("pay.")) return "Payment Gateway";
        if (domain.includes("demo.")) return "Demo Platform";
        if (domain === "axiolot.com.ng") return "Home Page";
        return domain;
    };

    const readableNotice = (msg: string) => {
        if (msg.includes(",")) {
            return msg
                .split(",")
                .map((part) => part.trim())
                .map((part) => {
                    const domain = part.split(" ")[0];
                    const friendly = toName(domain);
                    return `${friendly} is down`;
                })
                .join(", ");
        }

        const domain = msg.split(" ")[0];
        const friendly = toName(domain);

        return msg.replace(domain, friendly);
    };

    const statusColor = (status: string) => {
        if (status === "ok") return "bg-green-500";
        if (status === "warning") return "bg-yellow-500";
        if (status === "error") return "bg-red-500";
        return "bg-slate-300";
    };

    async function dailyStatus() {
        errorPage = false;
        loadingPage = true;
        try {
            const response = await fetch(`api/summary`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message);
            }
            const domainData: ApiResponse<DomainSummary> =
                await response.json();
            if (
                domainData.success === false ||
                Object.keys(domainData.data).length < 1
            ) {
                errorPage = true;
            }
            domainSummary = domainData.data;
        } catch (error: any) {
            errorPage = true;
        } finally {
            loadingPage = false;
        }
    }

    async function checkAllStatus() {
        errorStatus = false;
        try {
            const response = await fetch(`api/concurrent`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.log(errorData);
                throw new Error(errorData.message);
            }

            const data: ApiResponse<ConcurrentData> = await response.json();

            if (data.success === false || data.message.includes("down")) {
                errorStatus = true;
            }
            message =
                data.message === ""
                    ? "All systems are operational"
                    : readableNotice(data.message);
        } catch (error: any) {
            errorStatus = true;
            message = error.message || "Failed to load current systems status.";
        } finally {
            loadingStatus = false;
        }
    }

    const getStatusTextColor = (record?: DailyRecord) => {
        if (!record || record.status === "ok") return "text-green-500";
        if (record.status === "warning") return "text-yellow-500";
        if (record.status === "error") return "text-red-500";
        return "text-gray-500";
    };

    onMount(() => {
        checkAllStatus();
        const storedMode = localStorage.getItem("mode");
        if (storedMode) {
            currentTheme = storedMode;
            setMode(storedMode as "light" | "dark" | "system");
        } else {
            currentTheme = "system";
            setMode("system");
        }
        dailyStatus();
    });
</script>

<svelte:head>
    <title>Axiolot Hub Status Page | status.axiolot.com.ng</title>
</svelte:head>

<div class="bg-slate-50 dark:bg-black min-h-screen font-open">
    <div class="container mx-auto p-2 pt-0 md:p-4">
        <div class="flex justify-between items-center">
            <div class="py-8 px-6 pl-8">
                <a
                    href="https://www.axiolot.com.ng"
                    target="_blank"
                    class="relative w-20 flex flex-row justify-start items-center"
                >
                    <img
                        src="{PUBLIC_CDN}/image/Wzcdkj2.png"
                        srcset="{PUBLIC_CDN}/image/Wzcdkj2.png"
                        loading="lazy"
                        class="block dark:hidden w-12 h-12"
                        alt="logo"
                        decoding="async"
                    />
                    <img
                        src="{PUBLIC_CDN}/image/MiXZUxYV2.png"
                        srcset="{PUBLIC_CDN}/image/MiXZUxYV2.png"
                        loading="lazy"
                        class="hidden dark:block w-12 h-12"
                        alt="logo"
                        decoding="async"
                    />
                    <div
                        class="flex flex-col justify-end align-middle items-start"
                    >
                        <svg height="40" width="250" class="-ml-2"
                            ><text
                                x="5"
                                y="30"
                                fill="none"
                                font-size="35"
                                rotate="10"
                                class="font-open stroke-[#2f2e41] dark:stroke-white"
                                >xiolot</text
                            ></svg
                        >
                        <p
                            class="uppercase text-xs text-[#2f2e41] dark:text-white font-code font-medium -mt-0.5 ml-2"
                        >
                            Status
                        </p>
                        <svg
                            class="transform rotate-250 text-secondary-500 w-20 h-12 -mt-7"
                            xmlns="http://www.w3.org/2000/svg"
                            width="968"
                            height="968"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="#6c63ff"
                                d="M16.056 2.269L15.212 2l-.152.071c-.755.261-6.362 3.61-7 9.089a12.1 12.1 0 0 0 2.247 9.087l-.849.2a.052.052 0 0 0-.009.1l1.71.73a.6.6 0 0 0 .454 0l1.128-.454a.052.052 0 0 0 0-.1l-1.073-.367l-.039-.045a11.3 11.3 0 0 1-2.912-8.939c.653-5.63 6.012-8.688 7.182-9.063l.1-.027l.044-.011h-.01zM11 5.783a10.9 10.9 0 0 0-1.989 3.359a9.8 9.8 0 0 0-.5 4.536l-.278.034a10.14 10.14 0 0 1 .6-4.679a10.7 10.7 0 0 1 2-3.37a15.2 15.2 0 0 1 4.363-3.51l.4.123A12.7 12.7 0 0 0 11 5.783m1.794 15.134l-1.24.531a.44.44 0 0 1-.359 0l-1.819-.806v.431l1.818.882a.42.42 0 0 0 .363 0l1.26-.6v-.484a.05.05 0 0 1-.023.046"
                            />
                        </svg>
                    </div>
                </a>
            </div>
            <div
                class="rounded-full border-[0.5px] gap-x-3 flex justify-evenly items-center px-3 py-1"
            >
                <button
                    onclick={() => changeMode("light")}
                    class="hover:bg-slate-100 dark:hover:bg-gray-600 cursor-pointer rounded-full p-1.5 border {currentTheme ===
                    'light'
                        ? 'bg-slate-100 dark:bg-gray-600'
                        : ''}"
                >
                    <Sun class="w-4 h-4" />
                </button>
                <button
                    onclick={() => changeMode("dark")}
                    class="hover:bg-slate-100 dark:hover:bg-gray-600 cursor-pointer rounded-full p-1.5 border {currentTheme ===
                    'dark'
                        ? 'bg-slate-100 dark:bg-gray-600'
                        : ''}"
                >
                    <Moon class="w-4 h-4" />
                </button>
                <button
                    onclick={() => changeMode("system")}
                    class="hover:bg-slate-100 dark:hover:bg-gray-600 cursor-pointer rounded-full p-1.5 border {currentTheme ===
                    'system'
                        ? 'bg-slate-100 dark:bg-gray-600'
                        : ''}"
                >
                    <MonitorCog class="w-4 h-4" />
                </button>
            </div>
        </div>
        <div
            class="w-full rounded-lg py-4 px-4 hover:shadow-xl cursor-pointer transition-all duration-500 {errorStatus
                ? 'bg-red-500'
                : 'bg-teal-500'}"
        >
            <div class="flex justify-start items-center gap-x-4">
                <div class="">
                    {#if loadingStatus}
                        <LoaderIcon
                            role="status"
                            aria-label="Loading"
                            class={cn(
                                "size-6 text-white animate-spin",
                                className,
                            )}
                            {...restProps}
                        />
                    {:else if errorStatus}
                        <MonitorX
                            role="status"
                            aria-label="Error"
                            class={cn("size-6 text-white", className)}
                            {...restProps}
                        />
                    {:else}
                        <MonitorCheck
                            role="status"
                            aria-label="Success"
                            class={cn("size-6 text-white", className)}
                            {...restProps}
                        />
                    {/if}
                </div>
                <div class="ml-1">
                    <p class="text-base font-open font-medium text-white">
                        {message}
                    </p>
                </div>
            </div>
        </div>
        <div class="my-4">
            {#if loadingPage}
                <div
                    class="flex items-center justify-center flex-col gap-y-3 min-h-[50vh]"
                >
                    <LoaderIcon
                        role="status"
                        aria-label="Loading"
                        class={cn("size-10 animate-spin", className)}
                        {...restProps}
                    />
                    <p class="text-base font-open font-medium">Loading ...</p>
                </div>
            {:else if errorPage}
                <div class="flex items-center justify-center min-h-[50vh]">
                    <p class="text-base font-open font-medium">
                        We encountered an error while fetching the data. Please
                        try again later.
                    </p>
                </div>
            {:else if domainSummary}
                {#each Object.entries(domainSummary) as [domain, records] (domain)}
                    {@const typedRecords = (records as DailyRecord[])
                        .slice()
                        .sort(
                            (a, b) =>
                                new Date(a.date).getTime() -
                                new Date(b.date).getTime(),
                        )}
                    {@const latestRecord = typedRecords.at(-1)}
                    <div class="border-b pb-4 pt-1">
                        <div
                            class="w-full flex justify-between flex-row items-center mb-4 mt-2"
                        >
                            <p class="text-sm font-open">{toName(domain)}</p>
                            <p
                                class="text-sm font-code {getStatusTextColor(
                                    latestRecord,
                                )}"
                            >
                                {latestRecord?.title ?? "Unknown Status"}
                            </p>
                        </div>

                        <div
                            class="grid grid-cols-30 md:grid-cols-60 justify-between w-full gap-x-2 items-center"
                        >
                            {#each days as day, i}
                                {@const dayKey = fmt(day)}
                                {@const rec = typedRecords.find((r) => {
                                    const apiDate = new Date(r.date);
                                    const currentDay = new Date(day);
                                    return (
                                        apiDate.toDateString() ===
                                        currentDay.toDateString()
                                    );
                                })}
                                <Tooltip.Provider>
                                    <Tooltip.Root>
                                        <Tooltip.Trigger
                                            class="w-1 md:w-1 lg:w-2 h-12 rounded-lg {statusColor(
                                                rec?.status ?? 'unknown',
                                            )} {i < 30
                                                ? 'hidden md:block'
                                                : ''}"
                                        ></Tooltip.Trigger>
                                        <Tooltip.Content
                                            class="p-2 rounded-lg bg-slate-50 shadow-xl dark:bg-black text-black dark:text-white text-xs border min-h-28 min-w-80 px-5"
                                        >
                                            <p
                                                class="font-medium text-base font-code my-2 pb-2"
                                            >
                                                {dayKey}
                                            </p>
                                            {#if rec}
                                                <div
                                                    class="flex justify-between bg-white dark:bg-gray-800 font-code text-black dark:text-slate-50 rounded-sm text-base px-2 py-2 mb-4 items-center"
                                                >
                                                    <p>{rec.title}</p>
                                                    <p
                                                        class={rec.status ===
                                                        "ok"
                                                            ? "hidden"
                                                            : ""}
                                                    >
                                                        {rec.time_down}
                                                    </p>
                                                </div>
                                                {#if rec.status === "ok"}
                                                    <p
                                                        class="text-center text-sm font-open"
                                                    >
                                                        No downtime recorded on
                                                        this day
                                                    </p>
                                                {/if}
                                                {#if rec.status !== "ok"}
                                                    <div class="mt-1">
                                                        <span
                                                            class="font-medium text-sm dark:text-gray-400 uppercase"
                                                        >
                                                            Description
                                                        </span>
                                                        <p
                                                            class="my-2 text-sm text-black dark:text-white"
                                                        >
                                                            {readableNotice(
                                                                rec.description,
                                                            )}
                                                        </p>
                                                    </div>
                                                {/if}
                                            {:else}
                                                <p
                                                    class="my-2 text-sm text-black dark:text-white font-open"
                                                >
                                                    No data for this day
                                                </p>
                                            {/if}
                                        </Tooltip.Content>
                                    </Tooltip.Root>
                                </Tooltip.Provider>
                            {/each}
                        </div>
                        <div
                            class="w-full flex justify-between flex-row items-center py-1"
                        >
                            <p
                                class="text-gray-500 dark:text-gray-400 font-open text-sm hidden md:block"
                            >
                                60 days ago
                            </p>
                            <p
                                class="text-gray-500 dark:text-gray-400 font-open text-sm md:hidden"
                            >
                                30 days ago
                            </p>
                            <p
                                class="text-gray-500 dark:text-gray-400 font-open text-sm"
                            >
                                Today
                            </p>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</div>
