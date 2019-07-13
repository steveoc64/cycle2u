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
        elseif(strlen($message) < 20){  
            $formok = false;  
            $errors[] = "Your message must be greater than 20 characters";  
        }  
          
    //send email if all is ok  
    if($formok){  
        $headers = "From: $email\r\n";  
        $headers .= "MIME-Version: 1.0\r\n";
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
                      <p><strong>Telephone: </strong> {$telephone} </p> 
                      <hr><p><strong>Message: </strong></p><p> {$message} </p> 
                      <hr>
                      <p><small>This message was sent from the IP Address: {$ipaddress} on {$date} at {$time}</small></p>
                      </body>                   
                      </html>";  
          
        mail("steve@la-musette.net, steveoc64@gmail.com",$subject, $emailbody,$headers);         
    }  
      
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