
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Configurazione Database
$host = 'localhost';
$db   = 'seagram_db';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    die(json_encode(['error' => 'Connessione Fallita: ' . $e.getMessage()]));
}

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true);

switch ($action) {
    case 'login':
        $username = $input['username'];
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        
        if ($user) {
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            // Registrazione automatica per demo se non esiste
            $stmt = $pdo->prepare("INSERT INTO users (username, password, bio) VALUES (?, ?, ?)");
            $stmt->execute([$username, password_hash('pirate123', PASSWORD_DEFAULT), 'Un nuovo predone dei mari.']);
            $newId = $pdo->lastInsertId();
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$newId]);
            echo json_encode(['success' => true, 'user' => $stmt->fetch()]);
        }
        break;

    case 'get_posts':
        $stmt = $pdo->query("SELECT p.*, u.username as author, u.avatar FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC");
        $posts = $stmt->fetchAll();
        foreach ($posts as &$post) {
            $stmt = $pdo->prepare("SELECT c.*, u.username as author FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ?");
            $stmt->execute([$post['id']]);
            $post['comments'] = $stmt->fetchAll();
        }
        echo json_encode($posts);
        break;

    case 'create_post':
        $userId = $input['user_id'];
        $content = $input['content'];
        $imageUrl = $input['image_url'] ?? null;
        $stmt = $pdo->prepare("INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)");
        $stmt->execute([$userId, $content, $imageUrl]);
        echo json_encode(['success' => true]);
        break;

    case 'follow':
        $followerId = $input['follower_id'];
        $followingId = $input['following_id'];
        $stmt = $pdo->prepare("INSERT IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)");
        $stmt->execute([$followerId, $followingId]);
        echo json_encode(['success' => true]);
        break;

    case 'get_messages':
        $userId = $_GET['user_id'];
        $stmt = $pdo->prepare("SELECT * FROM messages WHERE sender_id = ? OR receiver_id = ? ORDER BY created_at ASC");
        $stmt->execute([$userId, $userId]);
        echo json_encode($stmt->fetchAll());
        break;

    default:
        echo json_encode(['error' => 'Azione non valida']);
        break;
}
?>
