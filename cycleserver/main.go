package main

import (
	"net/mail"
	"time"

	gomail "gopkg.in/jpoehls/gophermail.v0"
)

func main() {
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
