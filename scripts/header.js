/* Sticky Header on scroll down */
window.addEventListener("scroll", () => {
    var header = document.querySelector("header");
    var main = document.querySelector("main");
    header.classList.toggle("sticky", window.scrollY > 0)
    if(window.scrollY>0){
        main.style.top = "0px";
    }
    if(window.scrollY==0){
        main.style.top = "145px";
    }
})


/* Search button */
const input = document.getElementById("input")
const searchResults = document.getElementById("autocom-box")

input.onkeyup = (e)=>{
    fetch('getArticles', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({payload: e.target.value})
    }).then(res => res.json()).then(data => {
        let payload = data.payload;
        searchResults.innerHTML = ``;
        if (payload.length < 1) {
            searchResults.innerHTML = ``;
            return;
        }
        payload.forEach((item, index) => {
            if (index > 0) searchResults.innerHTML += `<hr>`;
            searchResults.innerHTML += `<li><a href="articles/${item.slug}">${item.title}</a></li>`
        });
    });
}

/* Social media pop ups on hover */
const socials = [];
for (let i=0; i<3; i++){
    const span = document.getElementById(`pop${i}`);
    const div = document.getElementById(`popup${i}`);
    const social = { span:span , div:div}
    socials.push(social);
}

socials.forEach(i=> i.div.addEventListener("mouseover",()=>{
    i.span.classList.toggle("show");
}))

socials.forEach(i=> i.div.addEventListener("mouseout",()=>{
    i.span.classList.remove("show");
}))

/* Mobile Burger Menu */
const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('mobile-menu')[0]

toggleButton.addEventListener('click', () => {
  navbarLinks.classList.toggle('active')
})



