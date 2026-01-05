<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->userId) || !isset($data->email)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Données incomplètes"]);
    exit;
}

try {
    // Vérifier que l'utilisateur existe en BDD avec les mêmes email et id
    $stmt = $pdo->prepare("SELECT id, name, email, telephone, adresse, statut FROM users WHERE id = ? AND email = ?");
    $stmt->execute([$data->userId, $data->email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // L'utilisateur est valide
        echo json_encode([
            "success" => true,
            "user" => [
                "id" => $user['id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "telephone" => $user['telephone'],
                "adresse" => $user['adresse'],
                "statut" => $user['statut']
            ]
        ]);
    } else {
        // L'utilisateur n'existe plus ou les données ne correspondent pas
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Session invalide"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur serveur"]);
}
?>
