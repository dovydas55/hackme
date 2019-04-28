package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	uuid "github.com/satori/go.uuid"
)

//ResponseEvent ...
type ResponseEvent struct {
	Type  string      	`json:"type"`
	UserID  string 		`json:"user_id"`
	Event interface{} 	`json:"event"`
}

//User ...
type User struct {
	UserID    string `json:"user_id"`
	Timestamp string `json:"timestamp"`
}

//Move ...
type Move struct {
	Direction string `json:"direction"`
	UserID    string `json:"user_id"`
}

type userData struct {
	conn *websocket.Conn
	user User
}

type concurrentSlice struct {
	sync.RWMutex
	usrs []userData
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
		response, responseErr := json.Marshal(ResponseEvent{
			Type: "USER_MOVE_EVENT",
			Event: Move{
				Direction: string(p),
				UserID:    findUserID(conn),
			},
		})
		if responseErr != nil {
			log.Println(responseErr)
			return
		}
		writeMessage(messageType, response)
	}
}

func findUserID(key *websocket.Conn) string {
	for _, u := range clients.usrs {
		if u.conn == key {
			return u.user.UserID
		}
	}
	return ""
}

func writeMessage(messageType int, p []byte) {
	for _, u := range clients.usrs {
		if err := u.conn.WriteMessage(messageType, p); err != nil {
			log.Println(err)
			return
		}
	}
}

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println("Client succesfully connected")
	var userID = clients.append(ws)
	if userID == "" {
		return
	}

	var usr []User
	for _, allUsrs := range clients.usrs {
		usr = append(usr, allUsrs.user)
	}
	response, responseErr := json.Marshal(ResponseEvent{
		Type:  "USER_JOIN_EVENT",
		UserID: userID,
		Event: usr,
	})
	if responseErr != nil {
		log.Println(responseErr)
		return
	}
	writeMessage(websocket.TextMessage, response)
	go reader(ws)
}

func setupRoutes() {
	http.HandleFunc("/ws", wsEndpoint)
}

func main() {
	setupRoutes()
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func (cs *concurrentSlice) append(item *websocket.Conn) string {
	cs.Lock()
	defer cs.Unlock()
	id, uuidErr := uuid.NewV4()
	if uuidErr != nil {
		log.Println(uuidErr)
		return ""
	}
	usr := User{
		UserID:    id.String(),
		Timestamp: time.Now().String(),
	}
	cs.usrs = append(cs.usrs, userData{conn: item, user: usr})

	return id.String()
}
