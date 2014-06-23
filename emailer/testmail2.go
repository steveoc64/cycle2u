package main

import (
	"bytes"
	"errors"
	"fmt"
	"labix.org/v2/mgo"
	"labix.org/v2/mgo/bson"
	"log"
	"net/smtp"
	"runtime"
	"strings"
	"text/template"
	"time"
)

type BookingInfo struct {
	Date time.Time
	Ip   string
	Msg  string
}

type ContactInfo struct {
	ID        bson.ObjectId `bson:"_id,omitempty"`
	Name      string
	Bike      []string
	Email     string
	Address   string
	Telephone string
	Booking   []BookingInfo
	Subscribe []string
}

func main() {
	session, err := mgo.Dial("localhost")
	if err != nil {
		panic(err)
	}
	defer session.Close()

	c := session.DB("cycle2u").C("contacts")

	var contacts []ContactInfo

	err = c.Find(bson.M{"subscribe": "Cycle2u"}).All(&contacts)
	if err != nil {
		panic(err)
	}

	for _, contact := range contacts {
		fmt.Println(contact.Name, " is subscribed to Cycle2u as ", contact.Email)

		nameFields := strings.Fields(contact.Name)
		firstName := nameFields[0]
		fmt.Println(firstName)

		go SendEmail(
			"mail.cycle2u.com.au",
			25,
			"theuser",
			"thepassword",
			[]string{contact.Email},
			"Cycle2U Newsletter Jun 2014",
			"Winter is Here !",
			firstName,
			`
	   With the change in season I remind you of one of my most uttered sayings.
	   Water is an enemy of push bikes!!!!
	   <p>
	   Now is the time for us all to ensure our bikes cope with the riggers of winter.
	   I recommend using a heavier ( wet lube ) designed not to wash off as easy and provide protection from the elements. They can and will run a bit darker, but this is still better than running a chain too dry. A good liberal application of wet lube and a wipe down with an old towel every three to four weeks works wonders.
	   <p>
	   Tyres are another important factor providing safety and resilience in these conditions. Flats are not only a pain but at speed can be hazardous. A couple of good options are the Panaracer Duro range ( my personal choice )  they have a protective casing covering the side walls as well and despite being a slick, they still provide grip and performance in all conditions. The other tyre I have heard good reports on are the Continental Four Season. Another popular choice.
	   Remember to wear bright coloured clothing ( time to break out the loud and Leary Knicks and tops ) and a good pair of booties can be the difference between warm and toasty or wet and miserable. They increase the life of your costly shoes as well.
	   <p>
	   For those who may hang up the bike and Knicks for winter it may be a good time to get the bike serviced and stored ready for spring and avoid the delays and kaos of spring/early summer bookings.
	   <p>
	     If you continue to brave the conditions take a little extra time to check wear on brake pads and general condition of your bike.
	    Ride to the conditions, stay safe, and importantly, have fun.
	   <p>
	   <center><img src=http://cycle2u.com.au/images/strade-bianche4.jpg></center>
	    <br><br><p>
	     See you out on the road.<br>
	    Best wishes. <br>
	    <b><i>Paul.</i></b><br>
	   `)
	}

	var unput string
	fmt.Print("All done ? ")
	fmt.Scanln(&unput)
}

func _CatchPanic(err *error, functionName string) {
	if r := recover(); r != nil {
		fmt.Printf("%s : PANIC Defered : %v\n", functionName, r)

		// Capture the stack trace
		buf := make([]byte, 10000)
		runtime.Stack(buf, false)

		fmt.Printf("%s : Stack Trace : %s", functionName, string(buf))

		if err != nil {
			*err = errors.New(fmt.Sprintf("%v", r))
		}
	} else if err != nil && *err != nil {
		fmt.Printf("%s : ERROR : %v\n", functionName, *err)

		// Capture the stack trace
		buf := make([]byte, 10000)
		runtime.Stack(buf, false)

		fmt.Printf("%s : Stack Trace : %s", functionName, string(buf))
	}
}

func SendEmail(host string, port int, userName string, password string,
	to []string, subject string, title string, addressName string, message string) (err error) {
	defer _CatchPanic(&err, "SendEmail")

	parameters := &struct {
		From        string
		To          string
		Subject     string
		Title       string
		AddressName string
		Message     string
	}{
		userName,
		strings.Join([]string(to), ","),
		subject,
		title,
		addressName,
		message,
	}

	buffer := new(bytes.Buffer)

	template := template.Must(template.New("emailTemplate").Parse(_EmailScript()))
	template.Execute(buffer, parameters)

	auth := smtp.PlainAuth("", userName, password, host)

	err = smtp.SendMail(
		fmt.Sprintf("%s:%d", host, port),
		auth,
		userName,
		to,
		buffer.Bytes())

	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Completed mail to", addressName, to, "with status", err)
	return err
}

// _EmailScript returns a template for the email message to be sent
func _EmailScript() (script string) {
	return `From: {{.From}}
To: {{.To}}
Subject: {{.Subject}}
MIME-version: 1.0
Content-Type: text/html; charset="UTF-8"

<html>
<body>
 <img src=http://cycle2u.com.au/images/logo.png>
<br>
 <h1>{{.Title}}</h1>
 Hi {{.AddressName}},<br>
     {{.Message}}
 <p>
 <hr>
 <a href=http://cycle2u.com.au/bookings.html><img src=http://cycle2u.com.au/images/book_now_button_on.gif><br>Book a Service Online</a>, thanks.
 <p>
 <img src=http://cycle2u.com.au/images/logos.jpg width="100%">
 <br>
 <img src=http://cycle2u.com.au/images/experience.png align=right>
</body>
</html>
`
}
