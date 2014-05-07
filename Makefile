all: cycle2u

clean:
	rm -f cycle2u

cycle2u: cycle2u.go
	go build cycle2u.go
