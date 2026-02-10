import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as ziggyRoute } from 'ziggy-js';
import '../css/app.css';
import { initializeTheme } from './hooks/use-appearance';

// ⭐ IMPORTS POUR ECHO/PUSHER
import axios from 'axios'; // ⭐ Garde axios quand même, c'est natif avec Laravel
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// ⭐ Déclarations TypeScript
declare global {
    interface Window {
        route: typeof ziggyRoute;
        Pusher: typeof Pusher;
        Echo: Echo<any>;
    }
}

// Rend route disponible globalement
window.route = ziggyRoute;

// ⭐ CONFIGURATION ECHO/PUSHER
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'eu',
    forceTLS: true,
    encrypted: true,
    // ⭐ Authentification pour les canaux privés
    authorizer: (channel: any) => {
        return {
            authorize: (socketId: string, callback: Function) => {
                // ⭐ Utilise axios normal (c'est ce que Laravel Echo attend)
                axios
                    .post('/broadcasting/auth', {
                        socket_id: socketId,
                        channel_name: channel.name,
                    })
                    .then((response) => {
                        callback(null, response.data);
                    })
                    .catch((error) => {
                        callback(error);
                    });
            },
        };
    },
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
