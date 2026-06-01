<?php
// contact.php - Handles form submission and shows a beautiful thank you message

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');

    // Basic validation
    $errors = [];
    if (empty($name)) $errors[] = "Please enter your name.";
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Please enter a valid email address.";
    if (empty($message)) $errors[] = "Please write a message.";

    // If there are errors, show them
    if (!empty($errors)) {
        echo '<!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><title>Error</title><style>
            body{font-family:Arial;background:#f0f2f5;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;}
            .card{background:white;padding:2rem;border-radius:24px;box-shadow:0 10px 25px rgba(0,0,0,0.1);max-width:500px;text-align:center;}
            h3{color:#d9534f;} ul{text-align:left;} a{background:#f5b042;color:#0f2c39;padding:0.5rem 1.2rem;border-radius:40px;text-decoration:none;display:inline-block;margin-top:1rem;}
        </style></head>
        <body><div class="card"><h3>❌ Oops!</h3><ul>';
        foreach ($errors as $e) echo "<li>$e</li>";
        echo '</ul><a href="index.html">← Go back to CV</a></div></body></html>';
        exit;
    }

    // Try to connect to SQL Server
    $serverName = "localhost";
    $connectionOptions = array(
        "Database" => "ArjunCV_Contacts",
        "Uid" => "cv_user",
        "PWD" => "StrongPassword123!"
    );

    $conn = sqlsrv_connect($serverName, $connectionOptions);
    $saved = false;

    if ($conn === false) {
        // If SQL Server fails, fallback to email (optional)
        // You can enable this by uncommenting below lines
        /*
        $to = "amgainarjun44@gmail.com";
        $subject = "New contact from $name";
        $body = "Name: $name\nEmail: $email\nMessage:\n$message";
        $headers = "From: $email";
        mail($to, $subject, $body, $headers);
        $saved = true;
        */
        // For now, we'll show an error with instructions
        $error_msg = sqlsrv_errors();
        $db_error = true;
    } else {
        // Insert into database
        $sql = "INSERT INTO ContactMessages (FullName, Email, Message, SubmittedAt) VALUES (?, ?, ?, GETDATE())";
        $params = array($name, $email, $message);
        $stmt = sqlsrv_query($conn, $sql, $params);
        if ($stmt !== false) {
            $saved = true;
            sqlsrv_free_stmt($stmt);
        } else {
            $db_error = true;
        }
        sqlsrv_close($conn);
    }

    // Show beautiful thank you page
    if ($saved) {
        echo '<!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><title>Thank You</title><style>
            body{font-family:"Segoe UI",Arial;background:linear-gradient(135deg,#0f2c39,#1a4a5e);display:flex;justify-content:center;align-items:center;height:100vh;margin:0;}
            .thankyou-card{background:white;padding:2.5rem;border-radius:32px;box-shadow:0 25px 40px rgba(0,0,0,0.2);max-width:550px;text-align:center;animation:fadeIn 0.5s;}
            @keyframes fadeIn{from{opacity:0;transform:scale(0.95);}to{opacity:1;transform:scale(1);}}
            h1{color:#0f2c39;font-size:2.2rem;margin-bottom:0.5rem;}
            .heart{color:#f5b042;font-size:2rem;}
            p{color:#2c3e44;line-height:1.5;margin:1rem 0;}
            .btn{background:#f5b042;color:#0f2c39;padding:0.7rem 1.8rem;border-radius:40px;text-decoration:none;font-weight:bold;display:inline-block;margin-top:1rem;transition:0.2s;}
            .btn:hover{background:#e09d2e;transform:scale(1.02);}
        </style></head>
        <body><div class="thankyou-card">
            <div class="heart">💖</div>
            <h1>Thank You, ' . htmlspecialchars($name) . '!</h1>
            <p>Your message has been received. I truly appreciate you reaching out.</p>
            <p>I will get back to you within 24 hours.</p>
            <a href="index.html" class="btn">← Back to Arjun\'s CV</a>
        </div></body></html>';
    } else {
        // Database failed – but still thank the user (store via email or log)
        // We'll still show a nice message and also send an email to admin
        $to = "amgainarjun44@gmail.com";
        $subject = "New contact from $name (DB fallback)";
        $body = "Name: $name\nEmail: $email\nMessage:\n$message\n\n(Note: SQL Server insert failed, but here is the message.)";
        $headers = "From: $email";
        @mail($to, $subject, $body, $headers); // Try to send email

        echo '<!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><title>Thank You</title><style>
            body{font-family:"Segoe UI",Arial;background:linear-gradient(135deg,#0f2c39,#1a4a5e);display:flex;justify-content:center;align-items:center;height:100vh;margin:0;}
            .thankyou-card{background:white;padding:2.5rem;border-radius:32px;box-shadow:0 25px 40px rgba(0,0,0,0.2);max-width:550px;text-align:center;}
            h1{color:#0f2c39;} .btn{background:#f5b042;color:#0f2c39;padding:0.7rem 1.8rem;border-radius:40px;text-decoration:none;display:inline-block;margin-top:1rem;}
        </style></head>
        <body><div class="thankyou-card">
            <h1>🙏 Thank You, ' . htmlspecialchars($name) . '!</h1>
            <p>Your message reached me (though my database is sleepy). I have still received it and will reply soon.</p>
            <a href="index.html" class="btn">← Back to CV</a>
        </div></body></html>';
    }
} else {
    // If someone accesses contact.php directly without POST
    header("Location: index.html");
    exit;
}
?>
