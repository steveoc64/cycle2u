    <?php  
    if( isset($_POST) ){  
          
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
        $from = "From: $email\r\n";  
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=iso-8859-1\r\n";  
        $subject = "Website Enquiry ($enquiry) - $bike";

        $emailbody = "<html>
                     <head>
                          <title>Website Enquiry</title>
                      </head>
                    <body>
                      <h3>Website Enquiry ($enquiry)</h3>
                      <p><strong>Name: </strong> {$name} </p> 
                      <p><strong>Bike: </strong> {$bike} </p> 
                      <p><strong>Email Address: </strong> {$email} </p> 
                      <p><strong>Home Address: </strong> {$address} ";

        $emailbody .= "<p><a href=\"http://maps.google.com/?q={$address}\">Click for MAP</a>";

        $emailbody .= "<p><strong>Telephone: </strong> {$telephone} </p> 
                      <hr><p><strong>Message: </strong></p><p> {$message} </p> 
                      <hr>
                      <p><small>This message was sent from the IP Address: {$ipaddress} on {$date} at {$time}</small></p>
                      </body>                   
                      </html>";  

        $emailbody2 = "<html>
                     <head>
                          <title>Thanks for your enquiry !</title>
                      </head>
                    <body>
                      <h3>Thanks for your Enquiry ($enquiry)</h3>
                      <p>We will get back to you soon.
                      <p>If you dont see a reply in the next 24hr - <i>Check your SPAM folder just in case !!</i>
                      
                      <p><strong>Bike: </strong> {$bike} </p> 
                      <p><strong>Telephone: </strong> {$telephone} </p> 
                      <p><strong>Address: </strong> {$address} </p> 
                      <hr><p><strong>Message: </strong></p><p> {$message} </p> 
                      </body>                   
                      </html>";  
        
        mail("$email","Cycle2U ".$subject, $emailbody2, "From: no-reply@cycle2u.com.au\r\n" . $headers);         
          
      //  Production
      mail("paul@cycle2u.com.au, paulcaptein@hotmail.com, steve@la-musette.net",$subject, $emailbody,$from . $headers);   
      // DEV
      //mail("steve@la-musette.net",$subject, $emailbody,$from . $headers);   


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
        $password = '59401496';
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
    if(empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) !== 'xmlhttprequest'){  
        //set session variables  
        session_start();  
        $_SESSION['cf_returndata'] = $returndata;  
          
        //redirect back to main index  
        header('location: index.html');  
    }  
}  
