document.addEventListener('DOMContentLoaded', () => {
    const block = document.getElementById('wpwb-weather-block');
    if (!block) return;

    if (!navigator.geolocation) {
        block.textContent = "La géolocalisation n'est pas supportée.";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const res = await fetch(`${wpwb.ajax_url}?action=wpwb_get_weather&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
                if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`);

                const data = await res.json();
                if (data.success) {
                    const weather = data.weather;
                    block.innerHTML = `
                        <strong>Météo à ${weather.location}</strong><br>
                        Température : ${weather.temp_c}°C<br>
                        Condition : ${weather.condition}
                    `;
                } else {
                    block.textContent = data.message;
                }
            } catch (err) {
                console.error(err);
                block.textContent = "Erreur lors de la récupération des données météo.";
            }
        },
        () => {
            block.textContent = "Permission refusée pour la géolocalisation.";
        }
    );
});