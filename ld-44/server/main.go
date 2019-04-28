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
	Type   string      `json:"type"`
	Event  interface{} `json:"event"`
}

//MoveRequestEvent ...
type MoveRequestEvent struct {
	Type   string `json:"type"`
	UserID string `json:"user_id"`
	Dx     int    `json:"dx"`
	Dy     int    `json:"dy"`
}

//User ...
type User struct {
	UserID    string `json:"user_id"`
	Timestamp string `json:"timestamp"`
}

//Move ...
type MoveEvent struct {
	UserID    string `json:"user_id"`
	Dx     int    `json:"dx"`
	Dy     int    `json:"dy"`
}

type JoinEvent struct {
	UserID    string `json:"user_id"`
	Users	  []User `json:"users"`
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
		json := MoveRequestEvent{}
		err := conn.ReadJSON(&json)
		if err != nil {
			log.Println(err)
			clients.deleteConnection(conn)
			return
		}
		log.Println(json.Type, json.UserID, json.Dx, json.Dy)
		/*i, userId := findUserID(conn)
		if i < 0 {
			return
		}
		response, responseErr := json.Marshal(ResponseEvent{
			Type: "USER_MOVE_EVENT",
			Event: MoveEvent{
				UserID: userId,
				Dx: json.Dx,
				Dy: json.Dy,
			},
		})
		if responseErr != nil {
			log.Println(responseErr)
			return
		}
		writeMessage(1, response)*/
	}
}

func findUserID(key *websocket.Conn) (int, string) {
	for i, u := range clients.usrs {
		if u.conn == key {
			return i, u.user.UserID
		}
	}
	return -1, ""
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
		Type:   "USER_JOIN_EVENT",
		Event:  JoinEvent{
			UserID: userID,
			Users:usr,
		},
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

func (cs *concurrentSlice) deleteConnection(item *websocket.Conn) {
	cs.Lock()
	defer cs.Unlock()
	i, _ := findUserID(item)
	cs.usrs = append(cs.usrs[:i], cs.usrs[i+1:]...)
}
