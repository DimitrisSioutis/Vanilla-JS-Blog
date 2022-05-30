const banners = []

/* Loading elements in an array */
for (let i = 0; i <= 2; i++) {
    const title = document.getElementById(`title${(i+1)}`)
    const markdown = document.getElementById(`markdown${(i+1)}`)
    const image = document.getElementById(`column${(i+1)}`)
    banners.push({
        title: title,
        markdown: markdown,
        image: image
    })
}

banners.forEach(i => i.image.addEventListener("mouseover", () => {
    onMouserOver(i.image, i.title, i.markdown)
}))

banners[0].image.addEventListener("mouseover", () => {
    banners[1].image.style.width = "25%";
    banners[2].image.style.width = "25%";
});

banners[1].image.addEventListener("mouseover", () => {
    banners[0].image.style.width = "25%";
    banners[2].image.style.width = "25%";
});

banners[2].image.addEventListener("mouseover", () => {
    banners[1].image.style.width = "25%";
    banners[0].image.style.width = "25%";
});

banners.forEach(i => i.image.addEventListener("mouseout", () => {
    onMouseOut(i.title, i.markdown)
}))

function onMouserOver(image, title, markdown) {
    image.style.width = "50%"
    image.style.transition = '0.4s';
    title.style.fontSize = "30px";
    title.style.marginTop = "400px";
    title.style.transition = '0.6s ';
    markdown.style.fontSize = "10px";
    markdown.style.display = "block";
}

function onMouseOut(title, markdown) {
    markdown.style.display = "none";
    title.style.fontSize = "16px";
    title.style.marginTop = "450px";
}

