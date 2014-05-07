package contactsdb

import (
	"encoding/json"
	"fmt"
	"github.com/steveoc64/cycle2u/list"
	"github.com/steveoc64/tiedot/db"
	"io/ioutil"
	"log"
	"strconv"
	"strings"
	"time"
)

var flightMode = false

type Contact struct {
	Name   string
	Bike   string
	Email  string
	Tel    string
	Addr   string
	Subbed bool
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

func Init(Data *db.Col) {
	// Create indexes first, since we need these to bootstrap the data !!!
	log.Println("Creating Index on Type")
	if err := Data.Index([]string{"Type"}); err != nil {
		panic(err)
	}

	log.Println("Creating Index on Name")
	if err := Data.Index([]string{"Data,Name"}); err != nil {
		panic(err)
	}
	log.Println("Creating Index on Owner")
	if err := Data.Index([]string{"Data,Owner"}); err != nil {
		panic(err)
	}
	log.Println("Creating Index on Email")
	if err := Data.Index([]string{"Data,Email"}); err != nil {
		panic(err)
	}

	// Ideally, wait for the indexes to be built before going any further !
	Data.Flush()

}

func LoadData(Data *db.Col, filename string) {

	// Open the datafile, and load stuff in from there
	content, err := ioutil.ReadFile(filename)
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
				slowAddBooking(Data, b, IPAddress, MsgDateTime)
				/*

					contactID, err := Data.Insert(DataMap("Contact", myContact))
					if err != nil {
						panic(err)
					}
					myBike := Bike{fmt.Sprintf("%d", contactID), myContact.Bike, "", "", "", 0}
					bikeID, _ := Data.Insert(DataMap("Bike", myBike))

					myBooking := Booking{fmt.Sprintf("%d", contactID), "bikeservice", myContact.Addr, fmt.Sprintf("%d", bikeID), MsgDateTime, "", "", IPAddress, BookingMsg}
					Data.Insert(DataMap("Booking", myBooking))

					log.Println(myContact)
					log.Println(myBike)
					log.Println(myBooking)
					log.Println("---")
				*/

				mode = "Name"
				BookingMsg = ""
				IPAddress = ""
				MsgDate = ""
				MsgTime = ""

			}
		}
	}
	Data.Flush()
	flightMode = true
	log.Println("Flight Mode is now ON")
}

// Get the contact for the given email address
func LookupContact(Data *db.Col, email string) (uint64, map[string]interface{}) {
	var myData map[string]interface{}

	queryStr := `{"n": [ {"eq": "` + email + `", "in": ["Data,Email"]},{"eq": "Contact", "in": ["Type"]} ]}`
	//log.Println(queryStr)
	var query interface{}
	json.Unmarshal([]byte(queryStr), &query)
	queryResult := make(map[uint64]struct{}) // query result (document IDs) goes into map keys

	if err := db.EvalQuery(query, Data, &queryResult); err != nil {
		panic(err)
	}

	for id := range queryResult {
		Data.Read(id, &myData)
		//log.Println(id, myData)
		contactData := myData["Data"].(map[string]interface{})
		theID := myData["@id"].(string)
		contactData["@id"] = theID
		return id, contactData
	}
	return 0, nil
}

// Get the given bike for the given owner
func LookupBike(Data *db.Col, bikeName string, owner string) (uint64, map[string]interface{}) {
	var myData map[string]interface{}

	queryStr := `{"n": [ {"eq": "` + bikeName + `", "in": ["Data,Name"]},{"eq": "Bike", "in": ["Type"]},{"eq": "` + owner + `", "in": ["Data,Owner"]} ]}`
	//log.Println(queryStr)
	var query interface{}
	json.Unmarshal([]byte(queryStr), &query)
	queryResult := make(map[uint64]struct{}) // query result (document IDs) goes into map keys

	if err := db.EvalQuery(query, Data, &queryResult); err != nil {
		panic(err)
	}

	for id := range queryResult {
		Data.Read(id, &myData)
		//log.Println(id, myData)
		bikeData := myData["Data"].(map[string]interface{})
		theID := myData["@id"].(string)
		bikeData["@id"] = theID
		return id, bikeData
	}
	return 0, nil
}

// Add a new booking, using indexed lookups
func AddBooking(Data *db.Col, b BookingInfo, IPAddress string, theDate string) uint64 {

	contactID := uint64(0)

	var myContact map[string]interface{}
	contactID, myContact = LookupContact(Data, b.Email)
	if contactID > 0 {
		log.Println("Existing contact", contactID, myContact)
		err := Data.Update(contactID, DataMap("Contact", Contact{b.Name, b.Bike, b.Email, b.Telephone, b.Address, true}))
		if err != nil {
			panic(err)
		}
	} else {
		// New contact record
		log.Println("New contact", b.Name, b.Email)
		contactID, _ = Data.Insert(DataMap("Contact", Contact{b.Name, b.Bike, b.Email, b.Telephone, b.Address, true}))
	}
	var bikeID uint64
	var myBike map[string]interface{}

	bikeID, myBike = LookupBike(Data, b.Bike, fmt.Sprintf("%d", contactID))

	if bikeID > 0 {
		log.Println("Existing Bike", bikeID, myBike)
	} else {
		// New bike record
		log.Println("Adding new bike", bikeID, b.Bike)
		myBike := Bike{fmt.Sprintf("%d", contactID), b.Bike, "", "", "", 0}
		bikeID, _ = Data.Insert(DataMap("Bike", myBike))
	}

	if theDate == "" {
		theDate = time.Now().String()
	}
	myBooking := Booking{fmt.Sprintf("%d", contactID), "bikeservice", b.Address, fmt.Sprintf("%d", bikeID), theDate, "", "", IPAddress, b.Message}
	bookID, _ := Data.Insert(DataMap("Booking", myBooking))

	return bookID
}

//----------------------------------------------------
// SLOW routines - these are internal use only, and are to be used when bootstrapping the database
// from the existing old emails.
//
// These functions apply the same logic as above, but they dont rely on the indexes to be constructed
// yet.

// Get the given bike for the given owner
func slowLookupBike(Data *db.Col, bikeName string, owner string) (uint64, map[string]interface{}) {
	var myData map[string]interface{}

	queryStr := `{"eq": "Bike", "in": ["Type"]}`
	//log.Println(queryStr)
	var query interface{}
	json.Unmarshal([]byte(queryStr), &query)
	queryResult := make(map[uint64]struct{}) // query result (document IDs) goes into map keys

	if err := db.EvalQuery(query, Data, &queryResult); err != nil {
		panic(err)
	}

	for id := range queryResult {
		Data.Read(id, &myData)
		//log.Println(id, myData)
		bikeData := myData["Data"].(map[string]interface{})
		if bikeData["Name"].(string) == bikeName && bikeData["Owner"] == owner {
			theID := myData["@id"].(string)
			bikeData["@id"] = theID
			return id, bikeData
		}
	}
	return 0, nil
}

func SlowAddBooking(Data *db.Col, b BookingInfo, IPAddress string, theDate string) uint64 {
	return slowAddBooking(Data, b, IPAddress, theDate)
}

// Add a new booking, but without using the database indexes (which are not guaranteed to be built yet)
func slowAddBooking(Data *db.Col, b BookingInfo, IPAddress string, theDate string) uint64 {

	contactID := uint64(0)

	Contacts := list.Lookup(Data, "Contact", "Email")
	if myContact, ok := Contacts[b.Email]; ok {
		// existing contact
		log.Println("Existing contact", myContact)
		contactID, _ = strconv.ParseUint(myContact["@id"].(string), 0, 64)
		if contactID > 0 {
			// Update existing record
			Data.Update(contactID, DataMap("Contact", Contact{b.Name, b.Bike, b.Email, b.Telephone, b.Address, myContact["Subbed"].(bool)}))
		}
		log.Println("CID", contactID)
	} else {
		// New contact
		log.Println("New contact", b.Name, b.Email)
		contactID, _ = Data.Insert(DataMap("Contact", Contact{b.Name, b.Bike, b.Email, b.Telephone, b.Address, true}))
	}
	var bikeID uint64
	var myBike map[string]interface{}

	bikeID, myBike = slowLookupBike(Data, b.Bike, fmt.Sprintf("%d", contactID))

	if bikeID > 0 {
		log.Println("Existing Bike", bikeID, myBike)
	} else {
		// New bike record
		log.Println("Adding new bike", bikeID, b.Bike)
		myBike := Bike{fmt.Sprintf("%d", contactID), b.Bike, "", "", "", 0}
		bikeID, _ = Data.Insert(DataMap("Bike", myBike))
	}

	if theDate == "" {
		theDate = time.Now().String()
	}
	myBooking := Booking{fmt.Sprintf("%d", contactID), "bikeservice", b.Address, fmt.Sprintf("%d", bikeID), theDate, "", "", IPAddress, b.Message}
	bookID, _ := Data.Insert(DataMap("Booking", myBooking))

	// Clear the lookup cache
	list.Init()

	return bookID
}
