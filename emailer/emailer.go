package main

import (
	"fmt"
	"labix.org/v2/mgo"
	//	"labix.org/v2/mgo/bson"
	"io/ioutil"
	"log"
	"strings"
	"time"
)

type Contact struct {
	Name   string
	Bike   string
	Email  string
	Tel    string
	Addr   string
	Subbed bool
	Passwd string
}

type Bike struct {
	Owner string
	Name  string
	Make  string
	BType string
	Group string
	KPM   uint64
}

type Booking struct {
	Owner   string
	What    string
	Addr    string
	Tel     string
	BikeID  string
	IDate   string // When the booking was made
	JDate   string // when the job was done
	FDate   string // followup date
	IP      string
	Message string
}

type Newsletter struct {
	When    string
	Title   string
	Content string
}

// Structure to fill in to confirm a booking
type BookingInfo struct {
	Name      string
	Bike      string
	Enquiry   string
	Email     string
	Telephone string
	Address   string
	Message   string
}

func main() {
	session, err := mgo.Dial("localhost")
	if err != nil {
		panic(err)
	}
	defer session.Close()

	c := session.DB("cycle2u").C("contacts")

	LoadData(c, "cycle2u.data")

}

func LoadData(c *mgo.Collection, filename string) {

	// Open the datafile, and load stuff in from there
	content, err := ioutil.ReadFile(filename)
	if err != nil {
		panic(err)
	}
	lines := strings.Split(string(content), "\n")
	log.Println(lines)
	mode := "Name"

	var myContact Contact
	myContact.Subbed = true

	BookingMsg := ""
	IPAddress := ""
	MsgDate := ""
	MsgTime := ""
	MsgDateTime := ""

	for _, line := range lines {
		//log.Println(line)
		switch mode {
		case "Name":
			if strings.HasPrefix(line, "Name:") {
				myContact.Name = ""
				if len(line) >= 6 {
					myContact.Name = line[6:len(line)]
				}
				mode = "Bike"
			}
		case "Bike":
			if strings.HasPrefix(line, "Bike:") {
				myContact.Bike = ""
				if len(line) >= 6 {
					myContact.Bike = line[6:len(line)]
					log.Println("Bike:" + myContact.Bike + ":")
				}
				mode = "Email"
			}
		case "Email":
			if strings.HasPrefix(line, "Email Address:") {
				myContact.Email = ""
				if len(line) >= 15 {
					myContact.Email = line[15:len(line)]
				}
				mode = "Addr"
			}
		case "Addr":
			if strings.HasPrefix(line, "Home Address:") {
				myContact.Addr = ""
				if len(line) >= 14 {
					myContact.Addr = line[14:len(line)]
				}
				mode = "Tel"
			}
		case "Tel":
			if strings.HasPrefix(line, "Telephone:") {
				myContact.Tel = ""
				if len(line) >= 11 {
					myContact.Tel = line[11:len(line)]
				}
				mode = "MsgHeader"
			}
		case "MsgHeader":
			if strings.HasPrefix(line, "Message:") {
				BookingMsg = ""
				mode = "MsgBody"
			}
		case "MsgBody":
			if len(line) > 0 {
				BookingMsg = line
				mode = "IP"
			}
		case "IP":
			if strings.HasPrefix(line, "This message was sent from the IP Address:") {
				fields := strings.Fields(line[43:len(line)])
				IPAddress = fields[0]
				MsgDate = fields[2]
				MsgTime = fields[4]

				const dateLayout = "05/01/2006 15:04:05 -0700 MST"
				t, _ := time.Parse(dateLayout, fmt.Sprintf("%s %s +0930 CST", MsgDate, MsgTime))
				MsgDateTime = t.String()
				mode = "---"
			}
		case "---":
			if strings.HasPrefix(line, "------") {

				b := BookingInfo{myContact.Name, myContact.Bike, "bikeservice", myContact.Email, myContact.Tel, myContact.Addr, BookingMsg}

				log.Println(b, IPAddress, MsgDateTime)
				log.Println(myContact)
				mode = "Name"
				BookingMsg = ""
				IPAddress = ""
				MsgDate = ""
				MsgTime = ""

			}
		}
	}

}
