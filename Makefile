all: cycle2u

clean:
	rm -f cycle2u

cycle2u: cycle2u.go Makefile
	go-bindata public public/css public/js public/js/vendor/ 
	go build
	./cycle2u
