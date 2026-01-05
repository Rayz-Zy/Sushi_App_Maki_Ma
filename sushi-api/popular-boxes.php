<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include 'db.php';

try {
    // Récupérer les 3 boîtes les plus commandées
    $stmt = $pdo->prepare("SELECT b.*, COUNT(ci.id) as order_count
                           FROM boxes b
                           LEFT JOIN commande_items ci ON b.id = ci.box_id
                           GROUP BY b.id
                           ORDER BY order_count DESC
                           LIMIT 3");
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
        
        // Supprimer le count pour ne pas l'envoyer au client
        unset($box['order_count']);
        
        $boxes[] = $box;
    }
    
    // Si moins de 3 boîtes avec commandes, compléter avec les premières
    if (count($boxes) < 3) {
        $remaining = 3 - count($boxes);
        $boxIds = implode(',', array_column($boxes, 'id'));
        $remaining_query = "SELECT * FROM boxes WHERE id NOT IN (" . $boxIds . ") LIMIT " . $remaining;
        
        $stmt = $pdo->prepare($remaining_query);
        $stmt->execute();
        $remainingBoxes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($remainingBoxes as $box) {
            $box_id = $box['id'];
            
            // Récupérer les aliments
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
            
            // Récupérer les saveurs
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
            
            $box['id'] = (int)$box['id'];
            $box['pieces'] = (int)$box['pieces'];
            $box['price'] = (float)$box['price'];
            
            $boxes[] = $box;
        }
    }
    
    echo json_encode($boxes);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
