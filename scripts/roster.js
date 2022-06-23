
const lastname_paragraph = Array.from(document.getElementsByClassName('lastname-paragraph'))

for (let i=0; i<lastname_paragraph.length; i++){
    if(lastname_paragraph[i].innerText.length>9){
        lastname_paragraph[i].style.letterSpacing = "0px"
        lastname_paragraph[i].style.fontSize = "3.8vw"
    }
}

