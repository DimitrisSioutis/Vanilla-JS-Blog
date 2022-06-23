
/* Sticky Header on scroll down */
window.addEventListener("scroll", () => {
    var header = document.querySelector("header");
    var main = document.querySelector("main");
    header.classList.toggle("sticky", window.scrollY > 0)
    if(window.scrollY>0){
        main.style.top = "0px";
    }
    if(window.scrollY==0){
        main.style.top = "15vh";
    }
})


/* Search button */
const searchInput = document.getElementById("input")  
const searchResults = document.getElementById("autocom-box")

searchInput.addEventListener('input',e =>{
    fetch('getArticles', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({input: e.target.value})})
    .then(res => res.json()).then(data => {
        let input = data.input;
        searchResults.innerHTML = ``;         
        if (input.length < 1) {
            searchResults.innerHTML = ``;
            return;}
        input.forEach((item, index) => {
            if (index > 0) searchResults.innerHTML += `<hr>`;
            searchResults.innerHTML += `<li><a class="autocom-title" href="articles/${item.slug}">${item.title}</a><a class ="autocom-image" href="articles/${item.slug}"><img src="${item.image} " /></a></li>`
        });
    });
})

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



