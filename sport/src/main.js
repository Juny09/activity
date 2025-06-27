import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
    console.error('Vue Error:', err);
    console.error('Component:', instance);
    console.error('Info:', info);
};

app.mount('#app');

if (import.meta.env?.DEV) {
    window.app = app;
    console.log('Activity Management App mounted successfully');
}
