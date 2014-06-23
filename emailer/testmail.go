package main

import (
	"log"
	"net/smtp"
)

func main() {
	// Set up authentication information.
	auth := smtp.CRAMMD5Auth("steve","steve123x")

/*
	auth := smtp.PlainAuth(
		"",
		"steve@la-musette.net",
		"steve123x",
		"mail.cycle2u.com.au",
	)
*/
	// Connect to the server, authenticate, set the sender and recipient,
	// and send the email all in one step.
	err := smtp.SendMail(
		"mail.cycle2u.com.au:25",
		auth,
		"steve@la-musette.net",
		[]string{"steveoc64@gmail.com"},
		[]byte("how is this"),
		//[]byte("subject: another test\r\n\r\nThis is a test email from GO."),
	)
	if err != nil {
		log.Fatal(err)
	}
}

/*
<?php  
                    
    //send email if all is ok  
      $from = "From: steve@la-musette.net\r\n";  
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=iso-8859-1\r\n";  
          
      mail("steveoc64@gmail.com","A test from PHP land", "the body of the test message",$from . $headers);   

    
?>
*/
