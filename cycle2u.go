package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"github.com/appio/websocket"
	"github.com/codegangsta/martini"
	"github.com/steveoc64/cycle2u/contactsdb"
	"github.com/steveoc64/cycle2u/list"
	"github.com/steveoc64/tiedot/db"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"time"
)

// Command line flags
var (
	port = flag.Int("port", 9000, "port to run on, default = 9000")
)

// Convert a GO structure to a map[string]interface{}
func toMap(thing interface{}) map[string]interface{} {
	var jsonThing, err = json.Marshal(thing)
	if err != nil {
		panic(err)
	}
	var retval = map[string]interface{}{}
	json.Unmarshal(jsonThing, &retval)
	return retval
}

// init the DB, and return a ref to the database collection
func initDB() *db.Col {
	rand.Seed(time.Now().UTC().UnixNano())

	// Create and open database
	dir := "cycle2u.database"
	//os.RemoveAll(dir)
	os.MkdirAll(dir, os.ModePerm)

	myDB, err := db.OpenDB(dir)
	if err != nil {
		panic(err)
	}

	if err := myDB.Create("Contacts", 1); err == nil {
		// This is a fresh DB so insert some default data
		contactsData := myDB.Use("Contacts")
		contactsdb.CreateData(contactsData)
		log.Println("Created new database", dir)
	} else {
		log.Println("Existing database loaded", dir)
	}
	myDB.Scrub("Contacts")
	return myDB.Use("Contacts")
}

// Pool of websocket connections
var connections map[*websocket.Conn]bool

// Send message to all known connections
func sendAll(msg []byte) {
	for conn := range connections {
		sendMsg(conn, msg)
	}
}

// Send a message to all connections except this one
func sendOthers(fromConn *websocket.Conn, msg []byte) {
	for conn := range connections {
		if conn != fromConn {
			sendMsg(conn, msg)
		}
	}
}

// Send a message to a specified connection
func sendMsg(conn *websocket.Conn, msg []byte) {
	if err := conn.WriteMessage(websocket.TextMessage, msg); err != nil {
		delete(connections, conn)
		return
	}
}

func tilde(c bool) string {
	if c {
		return "~"
	} else {
		return ""
	}
}

// Martini handler for incoming socket request - runs forever until socket connection is closed
//
// A DataSocket handler defines a standard protocol, which automates the realtime updates
// for multiple clients collaborating on editing a number of documents.
//
// TODO - need to document the wire protocol.
//   General idea is to wrap JSON document records in a standard envelope with an Action and an Entity
//
//   The Action opcode allows for CRUD requests from the client and realtime updates from the server
//   The Entity opcode allows for multiplexing several doc types through the same NoSQL collection
//
// On the backend, a single handler will server multiple clients for a single collection.
// Fire up extra dataSocketHandlers for different collections
//
// On the frontend, a single call to DataSocket.connect($scope) will bind the current scope of an ng-grid
// for a single Entity type to the global DataSocket. This includes kicking off the first LIST request.

func dataSocketHandler(w http.ResponseWriter, r *http.Request, theData *db.Col) {

	// Perform handshake and upgrade connection
	conn, err := websocket.Upgrade(w, r, nil, 1024, 1024)
	if _, ok := err.(websocket.HandshakeError); ok {
		http.Error(w, "Not a websocket handshake", 400)
		return
	} else if err != nil {
		log.Println(err)
		return
	}

	// record new connection in our map
	connections[conn] = true
	log.Println("New Websocket connection ", connections)
	defer conn.Close()

	var RxMsg map[string]interface{}
	var myData map[string]interface{}

	// loop forever
	for {
		_, msg, err := conn.ReadMessage()
		// Connection died - remove it from the list of connections
		if err != nil {
			delete(connections, conn)
			log.Println("Removed connection ", connections)
			return
		}

		// Got a message on the socket !!!
		//log.Printf("<- %s", msg)
		json.Unmarshal(msg, &RxMsg)

		switch RxMsg["Action"] {
		case "MList":
			// Return an array of lists
			startTime := time.Now()
			Entities := RxMsg["Entities"].([]interface{})
			EntityNames := ""
			var mmsg []list.MessageFormat

			for _, Entity := range Entities {
				theEntity := Entity.(string)
				EntityNames = EntityNames + theEntity + " "
				msg, cached := list.Get(theData, theEntity)
				log.Printf("MLIST: %s (%s)%s", theEntity, time.Since(startTime), tilde(cached))
				startTime = time.Now()

				mmsg = append(mmsg, msg)
			}
			msg, _ = json.Marshal(list.MessageFormat{"MList", EntityNames, mmsg})
			sendMsg(conn, msg)

		case "List":
			// List all records for the given entity
			startTime := time.Now()
			theEntity := RxMsg["Entity"].(string)

			records, cached := list.Get(theData, theEntity)
			log.Printf("LIST: %s (%s)%s", theEntity, time.Since(startTime), tilde(cached))
			msg, _ = json.Marshal(records)
			sendMsg(conn, msg)

		case "Add":
			// Invalidate the LIST cache for this entity before we do any updates
			theEntity := RxMsg["Entity"].(string)

			list.Clear(theEntity)
			log.Println("ADD:", theEntity, RxMsg["Data"])

			myData = RxMsg["Data"].(map[string]interface{})
			myDocID, err := theData.Insert(contactsdb.DataMap(theEntity, myData))
			if err != nil {
				panic(err)
			}
			list.Clear(theEntity)
			log.Printf("Inserted as ID %d", myDocID)
			myData["@id"] = strconv.FormatUint(myDocID, 10)
			msg, _ := json.Marshal(list.MessageFormat{"Add", theEntity, myData})
			sendAll(msg)

		case "Update":
			// Invalidate the LIST cache for this entity before we do any updates
			theEntity := RxMsg["Entity"].(string)

			list.Clear(theEntity)

			log.Println("UPDATE:", theEntity, RxMsg["Data"])

			myData = RxMsg["Data"].(map[string]interface{})
			docID := myData["@id"]
			delete(myData, "@id") // strip the ID out of this record
			myDocID, _ := strconv.ParseUint(docID.(string), 0, 64)
			if myDocID > 0 {
				// Write to existing record
				log.Println("Write Record ID", myDocID, myData)
				if err := theData.Update(myDocID, contactsdb.DataMap(theEntity, myData)); err != nil {
					panic(err)
				}
				list.Clear(theEntity)
				//gameData.Read(myDocID, &myGameData)
				myData["@id"] = docID
				msg, _ := json.Marshal(list.MessageFormat{"Update", theEntity, myData})
				sendOthers(conn, msg)
			}

		case "Delete":
			log.Println("DELETE:", RxMsg["Entity"], RxMsg["ID"])

			theEntity := RxMsg["Entity"].(string)
			list.Clear(theEntity)

			myDocID, _ := strconv.ParseUint(RxMsg["ID"].(string), 0, 64)
			if myDocID > 0 {
				theData.Delete(myDocID)
				myData := make(map[string]interface{})
				myData["ID"] = RxMsg["ID"]
				msg, _ := json.Marshal(list.MessageFormat{"Delete", theEntity, myData})
				sendAll(msg)
			}

		case "Get":
			log.Println("GET:", RxMsg["Entity"])

		default:
			log.Println("WTF ?", RxMsg)
		}
	}
}

// Main loop
func main() {

	flag.Parse()

	connections = make(map[*websocket.Conn]bool)

	// Classic defaults for webserver - serve up files from public dir
	m := martini.Classic()
	m.Map(initDB())
	m.Get("/WorkshopData", dataSocketHandler)
	m.NotFound(func() {
		// handle not found
	})

	// Run the actual webserver
	addr := fmt.Sprintf(":%d", *port)
	log.Println("ActionFront GameData Editor starting on port ", addr)

	http.ListenAndServe(addr, m)
}
