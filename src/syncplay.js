// @flow

'use strict';
import ReconnectingWebSocket from './ReconnectingWebSocket';

var SyncPlay = function (vNode, initobj, onconnected, onerror) {
  var version = "1.3.4";
  var username: string;
  var room: string;
  var password = null;
  var url: string;
  var socket;
  var motd = null;
  var conn_callback: Function;
  var filename: string;
  var duration: number;
  var size: number;
  var clientRtt: number = 0;
  var videoNode;
  
  var clientIgnoringOnTheFly = 0;
  var serverIgnoringOnTheFly = 0;

  var seek = false;
  var latencyCalculation;

  var stateChanged = false;
  var decoder = new TextDecoder('utf8');

  function init(initobj, onconnected, vnode) {
    url = initobj.url;
    room = initobj.room;
    videoNode = vnode;
    username = initobj.name;
    conn_callback = onconnected;
    if (initobj.hasOwnProperty("password")) {
      password = initobj.password;
    }
  }
  init(initobj, onconnected, vNode);

  function establishWS(conncallback) {
    socket = new ReconnectingWebSocket(url);
    socket.onopen = p => {
      sendHello();
    };
    socket.onmessage = messageHandler;
    socket.onerror = onerror;
  }

  function sendState(doSeek, latencyCalculation, stateChange) {
    var state = {};
    if (typeof (stateChange) == "undefined") {
      return false;
    }
    var clientIgnoreIsNotSet = (clientIgnoringOnTheFly == 0 || serverIgnoringOnTheFly != 0);
    if (clientIgnoreIsNotSet) {
      state["playstate"] = {};
      state["playstate"]["position"] = videoNode.currentTime;
      state["playstate"]["paused"] = videoNode.paused;
      if (doSeek) {
        state["playstate"]["doSeek"] = doSeek;
        seek = false;
      }
    }
    state["ping"] = {}
    if (latencyCalculation != null) {
      state["ping"]["latencyCalculation"] = latencyCalculation;
    }
    state["ping"]["clientLatencyCalculation"] = (new Date).getTime() / 1000;
    state["ping"]["clientRtt"] = clientRtt;
    if (stateChange) {
      clientIgnoringOnTheFly += 1;
    }
    if (serverIgnoringOnTheFly || clientIgnoringOnTheFly) {
      state["ignoringOnTheFly"] = {};
      if (serverIgnoringOnTheFly) {
        state["ignoringOnTheFly"]["server"] = serverIgnoringOnTheFly;
        serverIgnoringOnTheFly = 0;
      }
      if (clientIgnoringOnTheFly) {
        state["ignoringOnTheFly"]["client"] = clientIgnoringOnTheFly;
      }
    }
    send({ "State": state });
  }

  function messageHandler(message) {
    var large_payload = decoder.decode(message.data);
    var split_payload = large_payload.split("\r\n");
    for (var index = 0; index < split_payload.length; ++index) {
      if (split_payload[index] == "") {
        break;
      }
      var payload = JSON.parse(split_payload[index]);
      console.log("Server << " + JSON.stringify(payload));
      if (payload.hasOwnProperty("Hello")) {
        motd = payload.Hello.motd;
        conn_callback({
          connected: true,
          motd: motd
        });
        if (username !== payload.Hello.username) {
          console.log('namechange', payload.Hello.username, username);
          username = payload.Hello.username;
          videoNode.dispatchEvent(new CustomEvent("namechange", { detail: { username: username } }));
        }
        sendRoomEvent("joined");
      }
      if (payload.hasOwnProperty("Error")) {
        throw payload.Error;
      }
      if (payload.hasOwnProperty("Set")) {
        if (payload.Set.hasOwnProperty("user")) {
          for (var i in payload.Set.user) {
            if (payload.Set.user[i].hasOwnProperty("event")) {
              var sevent = new CustomEvent("userlist", {
                detail: {
                  user: Object.keys(payload.Set.user)[0],
                  evt: Object.keys(payload.Set.user[i]["event"])[0]
                },
                bubbles: true,
                cancelable: true
              });
              videoNode.dispatchEvent(sevent);
            }
            if (payload.Set.user[i].hasOwnProperty("file")) {
              if (Object.keys(payload.Set.user)[0] != username) {
                var sevent = new CustomEvent("fileupdate", {
                  detail: payload.Set,
                  bubbles: true,
                  cancelable: true
                });
                videoNode.dispatchEvent(sevent);
              }
            }
          }
        }
      }
      if (payload.hasOwnProperty("List")) {
        var room = Object.keys(payload.List)[0];
        var sevent = new CustomEvent("listusers", {
          detail: payload.List[room],
          bubbles: true,
          cancelable: true
        });
        videoNode.dispatchEvent(sevent);
      }
      if (payload.hasOwnProperty("State")) {
        clientRtt = payload.State.ping.yourLatency;
        latencyCalculation = payload.State.ping.latencyCalculation;

        if (payload.State.hasOwnProperty("ignoringOnTheFly")) {
          var ignore = payload.State.ignoringOnTheFly;
          if (ignore.hasOwnProperty("server")) {
            serverIgnoringOnTheFly = ignore["server"];
            clientIgnoringOnTheFly = 0;
            stateChanged = false;
          } else if (ignore.hasOwnProperty("client")) {
            if ((ignore["client"]) == clientIgnoringOnTheFly) {
              clientIgnoringOnTheFly = 0;
              stateChanged = false;
            }
          }
        }
        if (payload.State.playstate.hasOwnProperty("setBy")
        ) {
          if (payload.State.playstate.setBy != null) {
            if (payload.State.playstate.setBy != username) {
              var sevent = new CustomEvent("userevent", {
                detail: payload.State.playstate,
                bubbles: true,
                cancelable: true
              });
              if (!stateChanged && !clientIgnoringOnTheFly) {
                stateChanged = false;
                videoNode.dispatchEvent(sevent);
              }
            }
          }
          sendState(seek, latencyCalculation, stateChanged);
        }
      }
    }
  }

  function sendFileInfo() {
    var payload = {
      "Set": {
        "file": {
          "duration": duration,
          "name": filename,
          "size": size
        }
      }
    };
    send(payload);
  }

  function sendList() {
    var payload = {
      "List": null
    };
    send(payload);
  }

  function sendRoomEvent(evt) {
    var user = username;
    var payload = {
      "Set": {
        "user": {}
      }
    };
    var userval = {
      "room": {
        "name": room
      },
      "event": {}
    }
    userval["event"][evt] = true;
    payload.Set.user[user] = userval;
    send(payload);
  }

  function sendHello() {
    var payload: {
      Hello: {
        username: string,
        password?: string,
        room: {},
        version: string
      }
    } = {
      "Hello": {
        "username": username,
        "room": {
          "name": room
        },
        "version": version
      }
    };
    if (password != null) {
      if (typeof (window.md5) != "undefined") {
        payload.Hello["password"] = window.md5(password);
      }
    }
    send(payload);
    sendList();
  }

  function send(message) {
    var jsonText = JSON.stringify(message);
    console.log("Client >> " + jsonText);
    message = jsonText + "\r\n";
    socket.send_string(message);
  }

  function playPause() {
    stateChanged = true;
  }

  function seeked() {
    seek = true;
    stateChanged = true;
  }

  return {
    connect: function () {
      establishWS(onconnected);
    },
    set_file: function (name, length, size_bytes) {
      filename = name;
      duration = length;
      size = size_bytes;
      sendFileInfo();
    },
    disconnect: function () {
      sendRoomEvent("left");
      socket.close();
    },
    playPause: playPause,
    seeked: seeked
  }
};

window.SyncPlay = SyncPlay;
