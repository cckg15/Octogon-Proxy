self.addEventListener('install', (event) => {
    self.skipWaiting(); // Force the new worker to take over immediately
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim()); // Take control of all open tabs immediately
});

self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    if (url.includes('/service/')) {
        const parts = url.split('/service/');
        const encodedUrl = parts[parts.length - 1];
        
        try {
            const decodedUrl = atob(encodedUrl.replace(/_/g, '/'));
            
            // Use a reliable CORS bridge for ZIP-based hosting
            const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(decodedUrl);

            event.respondWith(
                fetch(proxyUrl, { mode: 'cors' })
                    .then(response => response)
                    .catch(err => new Response("Connect Error: " + err))
            );
        } catch (e) {
            console.error("Decode failed", e);
        }
    }
});
