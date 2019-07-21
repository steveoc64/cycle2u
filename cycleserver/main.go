package main

import (
	"crypto/tls"
	"fmt"
	"log"
	"net/mail"
	"net/smtp"
	"time"

	"github.com/emersion/go-imap"
	"github.com/emersion/go-imap/client"

	gomail "gopkg.in/jpoehls/gophermail.v0"
)

func main() {
	main_manual()
}

func main_imap() {
	log.Println("Connecting to server...")

	// Connect to server
	c, err := client.DialTLS("mail.cycle2u.com.au:993", nil)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Connected")

	// Don't forget to logout
	defer c.Logout()

	// Login
	if err := c.Login("paul@cycle2u.com.au", "cappers11"); err != nil {
		log.Fatal(err)
	}
	log.Println("Logged in")

	// List mailboxes
	mailboxes := make(chan *imap.MailboxInfo, 10)
	done := make(chan error, 1)
	go func() {
		done <- c.List("", "*", mailboxes)
	}()

	log.Println("Mailboxes:")
	for m := range mailboxes {
		log.Println("* " + m.Name)
	}

	if err := <-done; err != nil {
		log.Fatal(err)
	}

	// Select INBOX
	mbox, err := c.Select("INBOX", false)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Flags for INBOX:", mbox.Flags)

	// Get the last 4 messages
	from := uint32(1)
	to := mbox.Messages
	if mbox.Messages > 3 {
		// We're using unsigned integers here, only substract if the result is > 0
		from = mbox.Messages - 3
	}
	seqset := new(imap.SeqSet)
	seqset.AddRange(from, to)

	messages := make(chan *imap.Message, 10)
	done = make(chan error, 1)
	go func() {
		done <- c.Fetch(seqset, []imap.FetchItem{imap.FetchEnvelope}, messages)
	}()

	log.Println("Last 4 messages:")
	for msg := range messages {
		log.Println("* " + msg.Envelope.Subject)
	}

	if err := <-done; err != nil {
		log.Fatal(err)
	}

	log.Println("Done!")
}

func main_simple() {
	var (
		from       = "bookings@cycle2u.com.au"
		msg        = []byte("a test message")
		recipients = []string{"paul@cycle2u.com.au"}
	)

	// hostname is used by PlainAuth to validate the TLS certificate.
	hostname := "mail.cycle2u.com.au"
	//auth := smtp.PlainAuth("", "paul@cycle2u.com.au", "cappers11", hostname)
	//auth := smtp.CRAMMD5Auth("paul@cycle2u.com.au", "cappers11")

	err := smtp.SendMail(hostname+":25", nil, from, recipients, msg)
	if err != nil {
		log.Fatal(err)
	}
}

func main_manual() {
	// Connect to the remote SMTP server.
	c, err := smtp.Dial("mail.cycle2u.com.au:587")
	if err != nil {
		log.Fatal("dial " + err.Error())
	}

	if err := c.Hello("mail.cycle2u.com.au"); err != nil {
		log.Fatal("hello " + err.Error())
	}

	config := &tls.Config{
		ServerName:         "mail.cycle2u.com.au",
		InsecureSkipVerify: true,
	}
	if err := c.StartTLS(config); err != nil {
		log.Fatal("starttls " + err.Error())
	}

	//if err := c.Auth(smtp.CRAMMD5Auth("paul", "cappers11")); err != nil {
	//	log.Fatal(err)
	//}

	if err := c.Auth(smtp.PlainAuth("", "paul@cycle2u.com.au", "cappers11", "mail.cycle2u.com.au")); err != nil {
		log.Fatal("auth " + err.Error())
	}

	// Set the sender and recipient first
	if err := c.Mail("paul@cycle2u.com.au"); err != nil {
		log.Fatal(err)
	}
	if err := c.Rcpt("paul@cycle2u.com.au"); err != nil {
		log.Fatal(err)
	}

	// Send the email body.
	wc, err := c.Data()
	if err != nil {
		log.Fatal(err)
	}
	_, err = fmt.Fprintf(wc, "Test email body")
	if err != nil {
		log.Fatal(err)
	}
	err = wc.Close()
	if err != nil {
		log.Fatal(err)
	}

	// Send the QUIT command and close the connection.
	err = c.Quit()
	if err != nil {
		log.Fatal(err)
	}
}

func main_gomail() {
	println("cycleserver")
	m := &gomail.Message{}
	m.SetFrom("Cycle2U Booking <bookings@cycle2u.com.au>")
	//m.SetReplyTo("Don't reply <noreply@domain.com>")
	m.AddTo("Paul <paul@cycle2u.com.au>")
	//m.AddTo("to_2@domain.com")
	//m.AddCc("Less important person <to_3@domain.com>")
	m.AddBcc("Steve <steveoc64@gmail.com>")

	m.Subject = "My Subject (abcdefghijklmnop qrstuvwxyz0123456789 abcdefghijklmnopqrstuvwxyz0123456789_567890)"
	m.Body = "My Plain Text Body"
	m.HTMLBody = "<p>My <b>HTML</b> Body</p>"
	m.Headers = mail.Header{}
	m.Headers["Date"] = []string{time.Now().UTC().Format(time.RFC822)}
	err := gomail.SendMail("mail.cycle2u.com.au:25", nil, m)
	println("error", err.Error())
}
