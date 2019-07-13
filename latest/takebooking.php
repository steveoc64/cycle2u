    <?php  
    if( isset($_POST) ){  
          
	// Include the PHPMailer library
	require_once('PHPMailer/PHPMailerAutoload.php');

        //form validation vars  
        $formok = true;  
        $errors = array();  
          
        //sumbission data  
        $ipaddress = $_SERVER['REMOTE_ADDR'];  
        $date = date('d/m/Y');  
        $time = date('H:i:s');  
          
        //form data  
        $name = $_POST['name'];      
        $address = $_POST['address'];      
        $bike = $_POST['bike'];
        $email = $_POST['email'];  
        $telephone = $_POST['telephone'];  
        $enquiry = $_POST['enquiry'];  
        $message = $_POST['message'];  
          
        //form validation to go here....  
          
        //validate name is not empty  
        if(empty($name)){  
            $formok = false;  
            $errors[] = "You have not entered a name";  
        }  
          
        //validate email address is not empty  
        if(empty($email)){  
            $formok = false;  
            $errors[] = "You have not entered an email address";  
        //validate email address is valid  
        }elseif(!filter_var($email, FILTER_VALIDATE_EMAIL)){  
            $formok = false;  
            $errors[] = "You have not entered a valid email address";  
        }  
          
        //validate message is not empty  
        if(empty($message)){  
            $formok = false;  
            $errors[] = "You have not entered a message";  
        }  
        //validate message is greater than 20 characters  
        //elseif(strlen($message) < 20){  
            //$formok = false;  
            //$errors[] = "Your message must be greater than 20 characters";  
        //}  

	$formok = true;
          
    //send email if all is ok  
    if($formok){  

	// Passing 'true' enables exceptions.  This is optional and defaults to false.
	$mailer = new PHPMailer(true);

	// Set up our connection information.
	$mailer->IsSMTP();
	$mailer->SMTPAuth = true;
	$mailer->SMTPSecure = 'ssl';
	$mailer->Port = 465;
	$mailer->Host = 'localhost';
	$mailer->Username = 'paul';
	$mailer->Password = 'cappers';

	// Set up to, from, and the message body.  The body doesn't have to be HTML; check the PHPMailer documentation for details.
	// First, send a reply to the person who booked the service
	$mailer->Sender = 'paul@cycle2u.com.au';
	$mailer->AddReplyTo('paul@cycle2u.com.au', 'Cycle 2U');
	$mailer->SetFrom('paul@cycle2u.com.au', 'Cycle 2U');
	$mailer->AddAddress($email);
	$mailer->Subject = "Cycle2U ($enquiry) - $bike";

	$mailer->MsgHTML("<h3>Thanks for your Enquiry ($enquiry)</h3>
<p>We will get back to you soon.
<p>If you dont see a reply in the next 24hr - <i>Check your SPAM folder just in case !!</i>

<p><strong>Bike: </strong> {$bike} </p> 
<p><strong>Telephone: </strong> {$telephone} </p> 
<p><strong>Address: </strong> {$address} </p> 
<hr><p><strong>Message: </strong></p><p> {$message} </p>");
	
	// Send the first message to the poster
	$mailer->Send();


	// Repeat, sending a booking email to paul
	$mailer->Sender = 'paul@cycle2u.com.au';
	$mailer->clearReplyTos();
	// $mailer->AddReplyTo($email,$name);
	$mailer->SetFrom('paul@cycle2u.com.au','Cycle 2U Booking System');
	$mailer->clearAddresses();
	$mailer->addAddress('paul@cycle2u.com.au');
	$mailer->addAddress('paulcaptein@hotmail.com');
	$mailer->addAddress('steve@la-musette.net');
	$mailer->addAddress('steveoc64@gmail.com');

	$mailer->MsgHTML("<h3>Cycle2U Website Enquiry ($enquiry)</h3>
<p><strong>Name: </strong> {$name} </p> 
<p><strong>Bike: </strong> {$bike} </p> 
<p><strong>Email Address: </strong> {$email} </p> 
<p><strong>Home Address: </strong> {$address}
<p><a href=\"http://maps.google.com/?q={$address}\">Click for MAP</a>
<p><strong>Telephone: </strong> {$telephone} </p> 
<hr><p><strong>Message: </strong></p><p> {$message} </p> 
<hr>
<p><small>This message was sent from the IP Address: {$ipaddress} on {$date} at {$time}</small></p>");

	$mailer->Send();

      // Cut and Paste from smsbroadcast API example ... KISS
        function sendSMS($content) {
          $ch = curl_init('https://api.smsbroadcast.com.au/api-adv.php');
          curl_setopt($ch, CURLOPT_POST, true);
          curl_setopt($ch, CURLOPT_POSTFIELDS, $content);
          curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
          $output = curl_exec ($ch);
          curl_close ($ch);
          return $output;    
        }

        $username = 'ministryofcolor';
        $password = 'VJqHPs4k';
	$password = 'ttr665_u';
	$password = 'tLMDaNqb';
        $destination = '0459215116'; // PRODUCTION
        //$destination = '0415083977,0459215116,0418847211'; // DEV TESTING

        $source    = 'Cycle2U';
        $text = substr("$name\nPh: $telephone\n\n$bike\n\n$address\n---\n$message", 0, 159);
        $ref = 'abc123';
            
        $content =  'username='.rawurlencode($username).
                    '&password='.rawurlencode($password).
                    '&to='.rawurlencode($destination).
                    '&from='.rawurlencode($source).
                    '&message='.rawurlencode($text).
                    '&maxsplit=2';             
      
        $smsbroadcast_response = sendSMS($content);
        $response_lines = explode("\n", $smsbroadcast_response);
    
        foreach( $response_lines as $data_line){
          $message_data = "";
          $message_data = explode(':',$data_line);
          if($message_data[0] == "OK"){
              echo "The message to ".$message_data[1]." was successful, with reference ".$message_data[2]."\n";
          }elseif( $message_data[0] == "BAD" ){
              echo "The message to ".$message_data[1]." was NOT successful. Reason: ".$message_data[2]."\n";
          }elseif( $message_data[0] == "ERROR" ){
              echo "There was an error with this request. Reason: ".$message_data[1]."\n";
          }
      }           
      // end CUT AND PAST smsbroadcast API example

    }

	// log some stuff now
	$fp1 = fopen("/tmp/c2u.log","a");
	fprintf($fp1,"Name:%s\nBike:%s\nEmail:%s\nTel:%s\nEnq:%s\nMsg:%s\n",$name,$bike,$email,$telephone,$enquiry,$message);
	//fprintf($fp1,"%s\n=======================================\n",$errors);
	foreach($errors as $err) {
		fprintf($fp1,"Error: %s\n", $err);
	}
	fprintf($fp1,"\n=======================================\n");
	fclose($fp1);


    //what we need to return back to our form  
    $returndata = array(  
        'posted_form_data' => array(  
            'name' => $name,  
            'bike' => $bike,
            'email' => $email,  
            'telephone' => $telephone,  
            'enquiry' => $enquiry,  
            'message' => $message  
        ),  
        'form_ok' => $formok,  
        'errors' => $errors  
    );  
          
      
    //if this is not an ajax request  
    //if(empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) !== 'xmlhttprequest'){  
        //set session variables  
        session_start();  
        $_SESSION['cf_returndata'] = $returndata;  
          
        //redirect back to main index  
        header('location: index.html');  
    //}  
}  
