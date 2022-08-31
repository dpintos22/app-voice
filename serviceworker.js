const staticAppVoice = "app-voice-v1";
const assets = [
    "/",
    "/index.html",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js",
    "https://cdn.lordicon.com/xdjxvujz.js",
    "https://unpkg.com/siriwave/dist/siriwave.umd.min.js",
    "/js/app.js",
    "/css/app.css",
    "/img/logos/chat.svg",
    "/img/logos/logo.png"
];

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticAppVoice).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    );
});