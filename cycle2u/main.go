package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/steveoc64/memdebug"
)

func mainHandler(w http.ResponseWriter, r *http.Request) {
	memdebug.Print(time.Now(), r.Method, r.RequestURI)
	filename := r.RequestURI
	if filename == "/" {
		filename = "/index.html"
	}
	filename = "static" + filename
	switch r.Method {
	case "POST":
		memdebug.Print(time.Now(), "Posting a booking")
		if err := r.ParseForm(); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		println("name", r.FormValue("name"))
		println("bike", r.FormValue("bike"))
		println("equiry", r.FormValue("equiry"))
		println("email", r.FormValue("email"))
		println("telephone", r.FormValue("telephone"))
		println("address", r.FormValue("address"))
		println("message", r.FormValue("message"))
		http.ServeFile(w, r, "static/thanks.html")
	case "GET":
		if _, err := os.Stat(filename); os.IsNotExist(err) {
			filename = "static/index.html"
		}
		http.ServeFile(w, r, filename)
	}
}

func main() {
	http.HandleFunc("/", mainHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
