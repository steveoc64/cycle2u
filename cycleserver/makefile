all: build
	ls -ltra

build:
	go build .

run: build
	./cycleserver

prod:
	GOOS=freebsd go build .


