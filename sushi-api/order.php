<?php
// order.php
require_once 'db.php';

// Gérer la méthode POST uniquement
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

// Récupérer les données JSON envoyées par Angular
$data = json_decode(file_get_contents("php://input"));

// Debug : voir ce qui est reçu
error_log("Données reçues: " . json_encode($data));

if (!isset($data->items) || empty($data->items) || !isset($data->userId)) {
    http_response_code(400);
    echo json_encode(["message" => "Données incomplètes", "received" => $data]);
    exit;
}

try {
    // Debug : voir ce qui est reçu
    error_log("=== ORDER DEBUG ===");
    error_log("Données reçues: " . json_encode($data));
    
    $calculatedTotal = 0;
    $validItems = [];
    $totalBoxes = 0;

    foreach ($data->items as $item) {
        // Vérifier si c'est une box ou un sushi
        $isBox = isset($item->box) && $item->box !== null;
        $itemId = $isBox ? $item->box->id : $item->sushi->id;
        
        error_log("Item ID: $itemId, isBox: " . ($isBox ? 'true' : 'false'));
        
        // Chercher dans les boxes
        $stmt = $pdo->prepare("SELECT id, price FROM boxes WHERE id = ?");
        $stmt->execute([(int)$itemId]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($product) {
            $lineTotal = $product['price'] * $item->quantity;
            $calculatedTotal += $lineTotal;
            
            // On prépare l'item pour l'insertion
            $validItems[] = [
                'id' => $product['id'],
                'qty' => $item->quantity,
                'price' => $product['price'],
                'isBox' => $isBox
            ];
            
            // Compter les boxes
            if ($isBox) {
                $totalBoxes += $item->quantity;
            }
        }
    }

    error_log("Valid items count: " . count($validItems));
    error_log("Total boxes: $totalBoxes");
    
    if ($totalBoxes > 10) {
        throw new Exception("Vous ne pouvez pas commander plus de 10 boxes à la fois");
    }

    if (empty($validItems)) {
        throw new Exception("Aucun article valide dans le panier");
    }

    $finalTotal = isset($data->finalTotal) ? (float)$data->finalTotal : $calculatedTotal;
    
    $userId = isset($data->userId) ? (int)$data->userId : null;
    error_log("UserID: " . ($userId ?? 'NULL'));
    error_log("Final Total: $finalTotal");

    $stmt = $pdo->prepare("INSERT INTO commandes (user_id, prix_total) VALUES (?, ?)");
    $result = $stmt->execute([$userId, $finalTotal]);
    error_log("Insert commande result: " . ($result ? 'true' : 'false'));
    
    if (!$result) {
        error_log("SQL Error: " . implode(", ", $stmt->errorInfo()));
        throw new Exception("Erreur lors de l'insertion de la commande");
    }
    
    $orderId = $pdo->lastInsertId();
    error_log("Order ID: $orderId");

    if (!$orderId) {
        throw new Exception("Impossible de récupérer l'ID de la commande");
    }

    $stmtItem = $pdo->prepare("INSERT INTO commande_items (commande_id, box_id, quantite, price_at_time) VALUES (?, ?, ?, ?)");
    
    foreach ($validItems as $vi) {
        error_log("Inserting item - Commande: $orderId, Box: " . $vi['id'] . ", Qty: " . $vi['qty']);
        $result = $stmtItem->execute([(int)$orderId, (int)$vi['id'], (int)$vi['qty'], (float)$vi['price']]);
        
        if (!$result) {
            error_log("SQL Error on item: " . implode(", ", $stmtItem->errorInfo()));
            throw new Exception("Erreur lors de l'insertion des articles de la commande");
        }
    }

    error_log("=== ORDER SUCCESS ===");
    
    echo json_encode([
        "success" => true,
        "message" => "Commande validée !", 
        "orderId" => $orderId,
        "serverTotal" => $finalTotal
    ]);

} catch (Exception $e) {
    error_log("Exception: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["message" => "Erreur lors de la commande: " . $e->getMessage()]);
}
?>