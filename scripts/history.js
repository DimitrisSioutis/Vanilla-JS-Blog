var revealA = document.querySelectorAll('.reveal-a')
var revealB = document.querySelectorAll('.reveal-b')
var revealC = document.querySelectorAll('.reveal-c')

window.addEventListener("scroll", () => {
  revealA.forEach((reveal) => {
    if (window.scrollY > 400) {
      reveal.classList.add('active')
    }
  })

  revealB.forEach((reveal) => {
    if (window.scrollY > 900) {
      reveal.classList.add('active')
    }
  })

  revealC.forEach((reveal) => {
    if (window.scrollY > 1300) {
      reveal.classList.add('active')
    }
  })
})