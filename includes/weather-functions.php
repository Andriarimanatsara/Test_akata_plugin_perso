<?php

add_action('wp_ajax_wpwb_get_weather', 'wpwb_get_weather');
add_action('wp_ajax_nopriv_wpwb_get_weather', 'wpwb_get_weather');

function wpwb_get_weather() {
    $lat = $_GET['lat'] ?? '';
    $lon = $_GET['lon'] ?? '';

    if (!$lat || !$lon) {
        wp_send_json(['success' => false, 'message' => 'Coordonnées manquantes']);
    }

    global $wpdb;
    $table = $wpdb->prefix . 'weather_data';
    $today = date('Y-m-d');

    // Vérifie si on a déjà les données dans la base
    $existing = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $table WHERE lat = %f AND lon = %f AND date = %s",
        $lat, $lon, $today
    ));

    if ($existing) {
        wp_send_json(['success' => true, 'weather' => json_decode($existing->data)]);
    }

    // Appel API externe
    $api_key = '3091e9432d5447a79cf125943250208'; // 🔁 Remplace ici avec ta vraie clé
    $url = "https://api.weatherapi.com/v1/current.json?key=$api_key&q=$lat,$lon&lang=fr";
    $response = wp_remote_get($url);

    if (is_wp_error($response)) {
        wp_send_json(['success' => false, 'message' => 'Erreur lors de la requête API']);
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body);

    // Debug temporaire
    if (!isset($data->current)) {
        wp_send_json([
            'success' => false,
            'message' => 'Aucune donnée météo trouvée',
            'debug' => $data // 👈 Affiche ce que retourne réellement WeatherAPI
        ]);
    }

    // Structure simplifiée à enregistrer
    $weather_data = [
        'location' => $data->location->name,
        'temp_c' => $data->current->temp_c,
        'condition' => $data->current->condition->text
    ];

    // Enregistrement en base
    $wpdb->insert($table, [
        'lat' => $lat,
        'lon' => $lon,
        'date' => $today,
        'data' => json_encode($weather_data)
    ]);

    wp_send_json(['success' => true, 'weather' => $weather_data]);
}