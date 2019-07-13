
<?php

phpinfo();


// Include the PHPMailer library
require_once('PHPMailer/PHPMailerAutoload.php');
// Passing 'true' enables exceptions.  This is optional and defaults to false.
$mailer = new PHPMailer(true);
 
// Send a mail from Bilbo Baggins to Gandalf the Grey
 
// Set up to, from, and the message body.  The body doesn't have to be HTML; check the PHPMailer documentation for details.
$mailer->Sender = 'steve@la-musette.net';
$mailer->AddReplyTo('steve@la-musette.net', 'Steve LaMusette');
$mailer->SetFrom('steve@la-musette.net', 'Steve O Musette');
$mailer->AddAddress('steveoc64@gmail.com');
$mailer->Subject = 'The finest weed in the South Farthing';
$mailer->MsgHTML('<p>You really must try it, Gandalf!</p><p>-Bilbo</p>');
 
// Set up our connection information.
$mailer->IsSMTP();
$mailer->SMTPAuth = true;
$mailer->SMTPSecure = 'ssl';
$mailer->Port = 465;
$mailer->Host = 'localhost';
$mailer->Username = 'steve';
$mailer->Password = 'unx911zxx';
 
// All done!
$mailer->Send();

?>
