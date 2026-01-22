
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Configurazione Database
$host = 'localhost';
$db   = 'u769962085_seagram';
$user = 'u769962085.lightcyan-goldfinch-676459.hostingersite.com';
$pass = '8Z@6F66y@3*s.+v';
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
    http_response_code(500);
    die(json_encode(['error' => 'Errore di connessione al galeone (DB): ' . $e->getMessage()]));
}

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true);

function formatUser($user) {
    if (!$user) return null;
    return [
        'id' => (string)$user['id'],
        'username' => $user['username'],
        'avatar' => $user['avatar'],
        'bio' => $user['bio'],
        'lore' => $user['lore'],
        'stats' => [
            'posts' => (int)$user['posts_count'],
            'followers' => (int)$user['followers_count'],
            'following' => (int)$user['following_count']
        ],
        'followingIds' => [],
        'followerIds' => []
    ];
}

switch ($action) {
    case 'login':
        $username = $input['username'] ?? '';
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        
        if ($user) {
            echo json_encode(['success' => true, 'user' => formatUser($user)]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Pirata non trovato. Arruolati prima di salpare!']);
        }
        break;

    case 'register':
        $username = $input['username'] ?? '';
        $bio = $input['bio'] ?? 'Un nuovo predone dei mari di Seagram.';
        
        // Verifica se esiste già
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$username]);
        if ($stmt->fetch()) {
            http_response_code(400);
            die(json_encode(['error' => 'Questo nome è già temuto nei mari. Scegline un altro!']));
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO users (username, password, bio, avatar) VALUES (?, ?, ?, ?)");
            $defaultAvatar = 'https://picsum.photos/seed/' . uniqid() . '/150/150';
            $stmt->execute([
                $username, 
                password_hash('pirate123', PASSWORD_DEFAULT), 
                $bio,
                $defaultAvatar
            ]);
            $newId = $pdo->lastInsertId();
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$newId]);
            echo json_encode(['success' => true, 'user' => formatUser($stmt->fetch())]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Tempesta durante l\'arruolamento: ' . $e->getMessage()]);
        }
        break;

    case 'get_posts':
        try {
            $stmt = $pdo->query("SELECT p.*, u.username as author, u.avatar as author_avatar FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC");
            $posts = $stmt->fetchAll();
            foreach ($posts as &$post) {
                $stmt = $pdo->prepare("SELECT c.*, u.username as author FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ?");
                $stmt->execute([$post['id']]);
                $post['comments'] = $stmt->fetchAll();
            }
            echo json_encode($posts);
        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'create_post':
        $userId = $input['user_id'];
        $content = $input['content'];
        $imageUrl = $input['image_url'] ?? null;
        
        $pdo->beginTransaction();
        try {
            $stmt = $pdo->prepare("INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)");
            $stmt->execute([$userId, $content, $imageUrl]);
            $stmt = $pdo->prepare("UPDATE users SET posts_count = posts_count + 1 WHERE id = ?");
            $stmt->execute([$userId]);
            $pdo->commit();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'follow':
        $followerId = $input['follower_id'];
        $followingId = $input['following_id'];
        
        $pdo->beginTransaction();
        try {
            $stmt = $pdo->prepare("INSERT IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)");
            $stmt->execute([$followerId, $followingId]);
            if ($stmt->rowCount() > 0) {
                $pdo->prepare("UPDATE users SET following_count = following_count + 1 WHERE id = ?")->execute([$followerId]);
                $pdo->prepare("UPDATE users SET followers_count = followers_count + 1 WHERE id = ?")->execute([$followingId]);
            }
            $pdo->commit();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(['error' => 'Rotta non trovata nelle mappe']);
        break;
}
?>
