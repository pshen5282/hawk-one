document.addEventListener("DOMContentLoaded", () =>{

    let ar = [1,1,1,1,1,1]
window.console.log(document.getElementById("Button1"))
document.getElementById("Button1").addEventListener("click", () => {
    window.console.log(ar[1])
    ar[1] += 1
});

});