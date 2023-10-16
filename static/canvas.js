const socket = io()
const colors = "white black red orange yellow green blue purple darkred orangered gold greenyellow limegreen darkseagreen turquoise dodgerblue blueviolet darkviolet indigo gray lightgray brown".split(" ")


window.onload = function() {
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
}