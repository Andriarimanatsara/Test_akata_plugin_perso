const { useEffect, useState } = wp.element;

wp.blocks.registerBlockType('wpwb/weather-block', {
    title: 'Météo Géolocalisée',
    icon: 'cloud',
    category: 'widgets',
    edit: function WeatherBlockEdit() {
        const [weather, setWeather] = useState(null);
        const [error, setError] = useState(null);

        useEffect(() => {
            if (!navigator.geolocation) {
                setError("La géolocalisation n'est pas supportée.");
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const res = await fetch(`${wpwb.ajax_url}?action=wpwb_get_weather&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
                        const data = await res.json();
                        console.log("Réponse météo : ", data);

                        if (data.success) setWeather(data.weather);
                        else setError(data.message);
                    } catch (err) {
                        setError("Erreur lors de la récupération des données météo.");
                    }
                },
                () => setError("Permission refusée pour la géolocalisation.")
            );
        }, []);

        if (error) {
            return wp.element.createElement('div', null, `Erreur : ${error}`);
        }

        if (!weather) {
            return wp.element.createElement('div', null, "Chargement de la météo...");
        }

        return wp.element.createElement(
            'div',
            null,
            wp.element.createElement('strong', null, `Météo à ${weather.location}`),
            wp.element.createElement('br'),
            Température `: ${weather.temp_c}°C`,
            wp.element.createElement('br'),
            Condition `: ${weather.condition}`
        );
    },
    save: () => null // Rendu dynamique
});
