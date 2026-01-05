<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include 'db.php';

try {
    // Récupérer toutes les boîtes
    $stmt = $pdo->prepare("SELECT * FROM boxes ORDER BY id");
    $stmt->execute();
    $boxesData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $boxes = [];
    
    foreach ($boxesData as $box) {
        $box_id = $box['id'];
        
        // Récupérer les aliments de la boîte
        $stmt = $pdo->prepare("SELECT a.id, a.name, a.description, ba.quantite 
                                FROM aliments a 
                                JOIN box_aliments ba ON a.id = ba.aliment_id 
                                WHERE ba.box_id = ?");
        $stmt->execute([$box_id]);
        $foods = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $box['aliments'] = [];
        foreach ($foods as $food) {
            $box['aliments'][] = [
                'id' => (int)$food['id'],
                'nom' => $food['name'],
                'description' => $food['description'],
                'quantite' => (int)$food['quantite']
            ];
        }
        
        // Récupérer les saveurs de la boîte
        $stmt = $pdo->prepare("SELECT s.id, s.name 
                                FROM saveurs s 
                                JOIN box_saveurs bs ON s.id = bs.saveur_id 
                                WHERE bs.box_id = ?");
        $stmt->execute([$box_id]);
        $flavors = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $box['saveurs'] = [];
        foreach ($flavors as $flavor) {
            $box['saveurs'][] = $flavor['name'];
        }
        
        // Convertir les types de données
        $box['id'] = (int)$box['id'];
        $box['pieces'] = (int)$box['pieces'];
        $box['price'] = (float)$box['price'];
        
        $boxes[] = $box;
    }
    
    echo json_encode($boxes);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
