package main

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

type concurrentSlice struct {
	sync.RWMutex
	items []*websocket.Conn
}

var clients concurrentSlice

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func reader(conn *websocket.Conn) {
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		log.Println(string(p), messageType)
		writeMessage(messageType, p)
	}
}

func writeMessage(messageType int, p []byte) {
	for _, conn := range clients.items {
		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Println(err)
			return
		}
	}
}

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}

	log.Println("Client succesfully connected")
	clients.append(ws)
	go reader(ws)
}

func setupRoutes() {
	http.HandleFunc("/ws", wsEndpoint)
}

func main() {
	setupRoutes()
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func (cs *concurrentSlice) append(item *websocket.Conn) {
	cs.Lock()
	defer cs.Unlock()
	cs.items = append(cs.items, item)
}
