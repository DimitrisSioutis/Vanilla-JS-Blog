const searchResults = document.getElementById("autocom-box")
const searchInput = document.getElementById("input")


window.addEventListener("click",()=>{
    searchResults.style.display = "none";
})

/* Search button */

searchInput.addEventListener('input',e =>{
    searchResults.style.display = "block";
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
            if (index > 0) searchResults.innerHTML;
            searchResults.innerHTML += `<li>
                                            <a href="articles/${item.slug}">
                                                ${item.title}
                                                <img src="${item.image}"/>
                                            </a>
                                        </li>`
        });
    });
})


