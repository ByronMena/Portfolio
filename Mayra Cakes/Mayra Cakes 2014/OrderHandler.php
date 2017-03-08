<?php

	//Customer's contact information
	$first_name = $_POST['fName'];
	$last_name = $_POST['lName'];
	$fullname = $first_name . ' ' . $last_name;
	$phone_number = $_POST['pCall'];
	$client_email = $_POST['email'];

	//Client's preferred contact
	$contact_by = $_POST['typeofContact'];
	$contact_time = $_POST['timeCall'];

	// Gather Client's Order
	$OrderType =
	$_POST['OrderType1'] . ' ' .
	$_POST['OrderType2'] . ' ' .
	$_POST['OrderType3'] . ' ' .
	$_POST['OrderType4'] . ' ' .
	$_POST['OrderType5'] ;

	$serving_size = $_POST['servingSize'];
	$due_date = $_POST['dateofEvent'];
	$delivery_method = $_POST['deliveryMethod'];
	$icing = $_POST['typeofIcing'];
	$flavor = $_POST['typeofFlavor'];
	$filling = $_POST['typeofFilling'];
	$description = $_POST['cakeDescription'];

	$isOrderCorrect = $_POST['AGREED'];

	$message =
	'Name: ' . $fullname . '
	 Phone number: ' . $phone_number .  '
	 Email: ' .$client_email . '
	 Client preferred to be reached by ' . $contact_by . ' during ' . $contact_time . '
	 ' .

	 $fullname . ' wants to order ' . ( $OrderType ) . '
	 Serving Size: ' . $serving_size . '
	 Due Date: ' . $due_date . '
	 Delivery method: ' . $delivery_method . '
	 Icing: ' . $icing . '
	 Flavor:  ' . $flavor .  '
	 Filling: ' . $filling . '
	 Description: ' . $description . '
	  ' .

	 $fullname . $isOrderCorrect .  ' that the order is correct'
	 ;

    $sendto = "mayracakes@cakes.com"; //Your email
    $to = $sendto;
    $from = $client_email;
    $subject = 'You have an order from ' . $fullname;

	//Send mail
	 mail($sendto,$subject,$message);
	 header('Location: ordersent.html');
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Order Submitted</title>
</head>

<body>
</body>
</html>
