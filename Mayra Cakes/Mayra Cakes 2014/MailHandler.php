<?php
if(isset($_POST['submit'])){
    $to = "mayracakes@cakes.com"; // this is your Email address
    $from = $_POST['email']; // this is the sender's Email address
    $first_name = $_POST['fName'];
    $last_name = $_POST['lName'];
    $subject = "Message submission from Mayra Cakes";
    $subject2 = "Copy of your message submission";
    $message = $first_name . " " . $last_name . " wrote the following:" . "\n\n" . $_POST['message'];
    $message2 = "Here is a copy of your message " . $first_name . "\n\n" . $_POST['message'];

    $headers = "From:" . $from;
    $headers2 = "From:" . $to;
    mail($to,$subject,$message,$headers);
    //mail($from,$subject2,$message2,$headers2); // sends a copy of the message to the sender
	header('Location: messagesent.html');
    echo "Mail Sent. Thank you " . $first_name . ", we will contact you shortly.";
    // You can also use header('Location: thank_you.php'); to redirect to another page.
    }
?>
<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>Email</title>
</head>

<body>
</body>
</html>
