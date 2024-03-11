export default defineNuxtConfig({
    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    runtimeConfig: {
        openAIApiKey: process.env.OPEN_AI_API_KEY,
    },
    typescript: {
        typeCheck: true,
        strict: true,
    },
});
