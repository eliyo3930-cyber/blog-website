<?php
// Enable error reporting for debugging during development (optional)
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

$message_sent = false;
$error = '';
$name = '';
$email = '';
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');

    if (!empty($name) && !empty($email) && !empty($message)) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $error = "Please enter a valid email address.";
        } else {
            try {
                if (file_exists('db.php')) {
                    require_once 'db.php';
                }
                
                if (isset($pdo)) {
                    $stmt = $pdo->prepare("INSERT INTO contacts (name, email, message, created_at) VALUES (?, ?, ?, NOW())");
                    $stmt->execute([$name, $email, $message]);
                }
                
                $message_sent = true;
                // Clear fields after successful send
                $name = $email = $message = '';
            } catch (PDOException $e) {
                $error = "Database error: Could not save your message. Please try again later.";
            }
        }
    } else {
        $error = "Please fill in all fields.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us - DevBlog</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="navbar">
        <div class="logo">Dev<span>Blog</span></div>
        <nav>
            <a href="index.html">Home</a>
            <a href="about.html">About</a>
            <a href="profile.html">Profile</a>
            <a href="contact.php" class="active">Contact</a>
        </nav>
    </header>

    <main class="container">
        <section class="form-card">
            <h1>Contact Us</h1>
            <?php if ($message_sent): ?>
                <div class="alert alert-success">Thank you! Your message has been sent successfully.</div>
            <?php elseif ($error): ?>
                <div class="alert alert-danger"><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></div>
            <?php endif; ?>

            <form action="contact.php" method="POST">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" value="<?php echo htmlspecialchars($name, ENT_QUOTES, 'UTF-8'); ?>" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($email, ENT_QUOTES, 'UTF-8'); ?>" required>
                </div>
                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" name="message" rows="5" required><?php echo htmlspecialchars($message, ENT_QUOTES, 'UTF-8'); ?></textarea>
                </div>
                <button type="submit" class="btn">Send Message</button>
            </form>
        </section>
    </main>

    <footer>
        <p>&copy; <?php echo date('Y'); ?> DevBlog</p>
    </footer>
</body>
</html>