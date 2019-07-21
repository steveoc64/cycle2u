package main

import (
	"github.com/steveoc64/memdebug"
	"log"
	"net/http"
	"time"
)

func mainHandler(w http.ResponseWriter, r *http.Request) {
	memdebug.Print(time.Now(), r.RequestURI)
	filename := r.RequestURI
	if r.RequestURI == "/" {
		filename = "/index.html"
	}
	http.ServeFile(w,r,"static" + filename)
}

func main() {
    http.HandleFunc("/", mainHandler)
    log.Fatal(http.ListenAndServe(":8080", nil))
}