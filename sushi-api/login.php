<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
$data = json_decode(file_get_contents("php://input"));

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$data->email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($data->password, $user['password'])) {
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
        http_response_code(401);
        echo json_encode(["message" => "Email ou mot de passe incorrect"]);
    }
} catch (Exception $e) {
    http_response_code(500); echo json_encode(["message" => "Erreur serveur"]);
}
?>