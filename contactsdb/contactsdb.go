package contactsdb

import (
	"encoding/json"
	"fmt"
	"github.com/steveoc64/tiedot/db"
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
}

type Bike struct {
	Owner uint64
	Name  string
	Make  string
	Type  string
	Group string
	KPM   uint64
}

type Booking struct {
	Who     uint64
	BikeID  uint64
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

// Create a DataMap envelope with type name and a JSON representation of the thing
func DataMap(typeName string, thing interface{}) map[string]interface{} {
	var jsonThing, err = json.Marshal(thing)
	if err != nil {
		panic(err)
	}
	var thingMap = map[string]interface{}{}
	json.Unmarshal(jsonThing, &thingMap)

	var retval = map[string]interface{}{}
	retval["Type"] = typeName
	retval["Data"] = thingMap
	return retval
}

// Create a Fresh Database of Contacts Data from scratch

func CreateData(Data *db.Col) {

	// Open the datafile, and load stuff in from there
	content, err := ioutil.ReadFile("cycle2u.data")
	if err != nil {
		panic(err)
	}
	lines := strings.Split(string(content), "\n")
	//log.Println(lines)
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

				const dateLayout = "05/01/2006 15:04:05 MST"
				t, _ := time.Parse(dateLayout, fmt.Sprintf("%s %s ACST", MsgDate, MsgTime))
				MsgDateTime = t.String()
				mode = "---"
			}
		case "---":
			if strings.HasPrefix(line, "------") {
				contactID, err := Data.Insert(DataMap("Contact", myContact))
				if err != nil {
					panic(err)
				}
				myBike := Bike{contactID, myContact.Bike, "", "", "", 0}
				bikeID, _ := Data.Insert(DataMap("Bike", myBike))

				myBooking := Booking{contactID, bikeID, MsgDateTime, "", "", IPAddress, BookingMsg}
				Data.Insert(DataMap("Booking", myBooking))

				log.Println(myContact)
				log.Println(myBike)
				log.Println(myBooking)
				log.Println("---")

				mode = "Name"
				BookingMsg = ""
				IPAddress = ""
				MsgDate = ""
				MsgTime = ""

			}
		}
	}

	// Now create some indexes
	log.Println("Creating Index on Type")
	if err := Data.Index([]string{"Type"}); err != nil {
		panic(err)
	}
}
