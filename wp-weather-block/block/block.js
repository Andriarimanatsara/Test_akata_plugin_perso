const { useEffect, useState } = wp.element;

wp.blocks.registerBlockType('wpwb/weather-block', {
    title: 'Météo Géolocalisée',
    icon: 'cloud',
    category: 'widgets',
    edit: function WeatherBlockEdit() {
        const [weather, setWeather] = useState(null);
        const [error, setError] = useState(null);

        useEffect(() => {
            let isMounted = true;

            if (!navigator.geolocation) {
                setError("La géolocalisation n'est pas supportée.");
                return;
            }

            const timeout = setTimeout(() => {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        try {
                            const res = await fetch(`${wpwb.ajax_url}?action=wpwb_get_weather&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
                            console.log("URL appelée :", `${wpwb.ajax_url}?action=wpwb_get_weather&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);

                            if (!res.ok) {
                                throw new Error(`Erreur HTTP : ${res.status}`);
                            }

                            const data = await res.json();
                            console.log("Réponse météo : ", data);

                            if (isMounted) {
                                if (data.success) setWeather(data.weather);
                                else setError(data.message);
                            }
                        } catch (err) {
                            console.log("Erreur : ", err);
                            if (isMounted) setError("Erreur lors de la récupération des données météo.");
                        }
                    },
                    () => {
                        if (isMounted) setError("Permission refusée pour la géolocalisation.");
                    }
                );
            }, 1000);

            return () => {
                isMounted = false; 
                clearTimeout(timeout);
            };
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
            `Température : ${weather.temp_c}°C`,
            wp.element.createElement('br'),
            `Condition : ${weather.condition}`
        );
    },
    save: () => null 
})
