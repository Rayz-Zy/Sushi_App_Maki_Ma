<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include 'db.php';

try {
    // Statistiques par mois : nombre de commandes et total dépensé
    $query = "SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as mois,
        COUNT(*) as nombre_commandes,
        COALESCE(SUM(prix_total), 0) as total_depense
        FROM commandes
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY mois ASC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $statistiques_mensuelles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Statistiques totales
    $query_total = "SELECT 
        COUNT(*) as total_commandes,
        COALESCE(SUM(prix_total), 0) as total_depense,
        COALESCE(AVG(prix_total), 0) as depense_moyenne,
        COALESCE(MAX(prix_total), 0) as commande_max,
        COALESCE(MIN(prix_total), 0) as commande_min
        FROM commandes";
    
    $stmt_total = $pdo->prepare($query_total);
    $stmt_total->execute();
    $statistiques_totales = $stmt_total->fetch(PDO::FETCH_ASSOC);
    
    // Box les plus commandées
    $query_boxes = "SELECT 
        b.id,
        b.name,
        COUNT(ci.box_id) as nombre_commandes
        FROM boxes b
        LEFT JOIN commande_items ci ON b.id = ci.box_id
        GROUP BY b.id, b.name
        HAVING COUNT(ci.box_id) > 0
        ORDER BY nombre_commandes DESC
        LIMIT 10";
    
    $stmt_boxes = $pdo->prepare($query_boxes);
    $stmt_boxes->execute();
    $boxes_populaires = $stmt_boxes->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'statistiques_mensuelles' => $statistiques_mensuelles,
        'statistiques_totales' => $statistiques_totales,
        'boxes_populaires' => $boxes_populaires
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur: ' . $e->getMessage()
    ]);
}
?>
