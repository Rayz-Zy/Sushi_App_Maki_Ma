<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->password) || !isset($data->name) || !isset($data->telephone) || !isset($data->adresse)) {
    http_response_code(400); echo json_encode(["message" => "Données incomplètes"]); exit;
}

// Statut est optionnel ou peut être vide
$statut = isset($data->statut) ? (string)$data->statut : '';

try {
    // Vérifier si l'email existe déjà
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$data->email]);
    
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(["message" => "Cet email est déjà utilisé"]);
        exit;
    }

    // Hasher le mot de passe
    $hashedPassword = password_hash($data->password, PASSWORD_BCRYPT);

    // Insérer le nouvel utilisateur
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, telephone, adresse, statut) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$data->name, $data->email, $hashedPassword, $data->telephone, $data->adresse, $statut]);
    
    $id = $pdo->lastInsertId();

    echo json_encode([
        "success" => true,
        "user" => ["id" => $id, "name" => $data->name, "email" => $data->email, "telephone" => $data->telephone, "adresse" => $data->adresse, "statut" => $statut]
    ]);

} catch (Exception $e) {
    http_response_code(500); 
    echo json_encode(["message" => "Erreur serveur : " . $e->getMessage()]);
}
?>