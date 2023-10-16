const socket = io()
const colors = "white black red orange yellow green blue purple darkred orangered gold greenyellow limegreen darkseagreen turquoise dodgerblue blueviolet darkviolet indigo gray lightgray brown".split(" ")
var currentColor = "black"

function resetResize() {
  let cw = document.getElementsByClassName("canvas-wrapper")[0]
  cw.style.height = ""
  cw.style.width = ""
}

function setPixel(e) {
  e.style.background = currentColor
  socket.emit('PixelChange', [e.id, colors.indexOf(currentColor)])
}

function setColor(i, e) {
  document.getElementsByClassName("selected-color")[0].classList.remove("selected-color")
  e.classList.add("selected-color")
  currentColor = colors[i]
}

function sendMessage() {
  outboundMessage = true
  socket.emit("NewMessage", {"content": messageInput.value})
  messageInput.value = ""
}

function createMessage(content, fromSelf=false) {
  if (content.length > 0) {
    let message = document.createElement("div")
    let time = new Date().toLocaleTimeString()
    message.className = "message"
    message.innerHTML = `<div class="message-time">${time.split(":")[0]}:${time.split(":")[1]} ${time.split(" ")[1]}</div> ${content}`
    if (fromSelf) {
      message.style.background = "lightgray"
    }
    document.querySelector("#messagesContainer").append(message)
    message.scrollIntoView()
  }
}

var messageInput
var outboundMessage = false
window.onload = function() {
  messageInput = document.querySelector("#messageInput")
  const canvas = document.querySelector("#canvas")
  let i = 0
  
  pixelData.forEach(function(e) {
    const pixel = document.createElement("div")
    pixel.id = i
    pixel.style.background = colors[e]
    pixel.onclick = function() {setPixel(pixel)}
    i ++
    canvas.append(pixel)
  })

  socket.on("PixelChange", (data) => {
    document.getElementById(data[0]).style.background = colors[data[1]]
  })

  socket.on("RecieveMessage", (data) => {
    if (outboundMessage) {
      outboundMessage = false
      createMessage(data.content, fromSelf=true)
    } else {
      createMessage(data.content)
    }
  })

  messageInput.addEventListener("change", function(e) {sendMessage()})
}