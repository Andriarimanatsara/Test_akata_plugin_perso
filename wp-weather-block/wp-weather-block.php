<?php
defined('ABSPATH') || exit;

function wpwb_enqueue_block_assets() {
    // Enregistrement du script JS principal du bloc
    wp_register_script(
        'wpwb-block',
        plugins_url('block/block.js', __FILE__),
        ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-data'],
        filemtime(plugin_dir_path(__FILE__) . 'block/block.js')
    );

    // Localisation APRES l'enregistrement du script
    wp_localize_script('wpwb-block', 'wpwb', [
        'ajax_url' => admin_url('admin-ajax.php')
    ]);

    register_block_type(__DIR__ . '/block/block.json', [
        'editor_script' => 'wpwb-block',
        'render_callback' => 'wpwb_render_block'
    ]);

    // FRONTEND : charger JS + localisation
    if (!is_admin()) {
        wp_enqueue_script(
            'wpwb-frontend',
            plugin_dir_url(__FILE__) . 'block/frontend.js',
            [],
            '1.0',
            true
        );

        // Localisation du script frontend
        wp_localize_script('wpwb-frontend', 'wpwb', [
            'ajax_url' => admin_url('admin-ajax.php')
        ]);
    }
}

add_action('init', 'wpwb_enqueue_block_assets');

// Inclure les fonctions météo
require_once plugin_dir_path(__FILE__) . 'includes/weather-functions.php';

register_activation_hook(__FILE__, 'wpwb_create_weather_table');
function wpwb_create_weather_table() {
    global $wpdb;
    $table = $wpdb->prefix . 'weather_data';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table (
        id INT NOT NULL AUTO_INCREMENT,
        lat FLOAT,
        lon FLOAT,
        date DATE,
        data LONGTEXT,
        PRIMARY KEY(id),
        UNIQUE KEY unique_loc_date (lat, lon, date)
    ) $charset_collate;";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($sql);
}