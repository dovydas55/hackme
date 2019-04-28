package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	uuid "github.com/satori/go.uuid"
)

const mapWidth = 1000
const mapHeight = 1000

//ResponseEvent ...
type ResponseEvent struct {
	Type        string      `json:"type"`
	UserID      string      `json:"user_id"`
	WorldWidth  int         `json:"world_width"`
	WorldHeight int         `json:"world_height"`
	Event       interface{} `json:"event"`
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
	StartX    int    `json:"start_x"`
	StartY    int    `json:"start_y"`
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
		mv := MoveRequestEvent{}
		err := conn.ReadJSON(&mv)
		if err != nil {
			log.Println(err)
			clients.deleteConnection(conn)
			return
		}
		log.Println(mv.Type, mv.UserID, mv.Dx, mv.Dy)
		_, uID := findUserID(conn)
		response, responseErr := json.Marshal(ResponseEvent{
			Type:        "USER_MOVE_EVENT",
			UserID:      uID,
			WorldWidth:  mapWidth,
			WorldHeight: mapHeight,
			Event: MoveRequestEvent{
				UserID: uID,
				Dx:     mv.Dx,
				Dy:     mv.Dy,
			},
		})
		if responseErr != nil {
			log.Println(responseErr)
			return
		}
		writeMessage(websocket.TextMessage, response)
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
		Type:        "USER_JOIN_EVENT",
		WorldWidth:  mapWidth,
		WorldHeight: mapHeight,
		UserID:      userID,
		Event:       usr,
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
		StartX:    getRandomIntegerInRange(0, mapWidth),
		StartY:    getRandomIntegerInRange(0, mapHeight),
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

func getRandomIntegerInRange(min, max int) int {
	rand.Seed(time.Now().UnixNano())
	return rand.Intn(max-min) + min
}
