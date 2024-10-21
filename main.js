document.addEventListener("DOMContentLoaded", () =>{
    let chocolate = 0
    let array = ["milk","dark","milk","milk","milk","milk","milk","milk"]
    let selectedC = 0
    let selectedCH = 1
    let cDmg = 1
    let nValAr = {
        "milk": 1,
        "dark": 5,
    }
    let nHpAr = {
        "milk": 1,
        "dark": 3,
    }
    document.getElementById("Button1").addEventListener("click", () =>{
        selectedCH -= cDmg
        if (selectedCH <= 0) {
            chocolate += nValAr[array[selectedC]]

            selectedC += 1
            if (selectedC > 7) {
                selectedC = 0
            }
            selectedCH = nValAr[array[selectedC]]
        }
        document.getElementById("text1").innerHTML = chocolate+""
    })
});