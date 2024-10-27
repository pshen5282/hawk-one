import * as THREE from 'three';
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
/* 
                let audiotrack = new Audio("/sounds/bite.mp3");
				audiotrack.play();
*/
document.addEventListener("DOMContentLoaded", () =>{
    document.addEventListener('click', function() { 
        document.getElementById('ID').play() 
        document.getElementById('ID').addEventListener(
            "ended",
            () => {
                this.currentTime = 0;
                this.play();
            },
            false
        );
    })
    let chocolate = new Decimal("0")
    let array = ["milk","milk","milk","milk","milk","milk","milk","milk"]
    let selectedC = 0
    let selectorSelection = 0
    let selectedCH = new Decimal("1")
    let cDmg = new Decimal("1")
    let cInv = {
        "milk": new Decimal("8"),
        "dark": new Decimal("2"),
        "white": new Decimal("2"),
        "ruby": new Decimal("2"),
    }
    let nValAr = {
        "milk": new Decimal("1"),
        "dark": new Decimal("8"),
        "white": new Decimal("1"),
        "ruby": new Decimal("2"),
    }
    let nHpAr = {
        "milk": new Decimal("1"),
        "dark": new Decimal("4"),
        "white": new Decimal("1"),
        "ruby": new Decimal("3"),
    }
    let nFlTxt = {
        "milk": '\'standard milk chocolate\' (1/1), no special effects',
        "dark": '\'a stronger tasting dark chocolate\' (8/4), no special effects',
        "white": '\'white chocolate made from cocoa butter\' (1,1), nearby chocolate is worth 1.5x',
        "ruby": '\'a more acidic chocolate between white and milk chocolate\'(2,3), when eaten bite strength +2'
    }
    let nStoContents = {
        "BarOne": {
            "dark": 34,
            "white": 33,
            "ruby": 33,
        },
    }
    let bPrices = {
        "BarOne": new Decimal("50")
    }
    //new chocolate display becuase i fucking hate the old one with a burning passino i hope it gets sent to teh depths of the aku realms and sealed forever that shit looks so disgusting
    let child = null
    for (let i = 7; i >= 0; i--) {
        child = document.createElement("div");
        child.classList.add("chocolate");
        child.id = "chocolate" + i.toString();
        document.getElementById("ChocolateTempDisplay").appendChild(child);
    }
    function updateSelector(buttonhighlight = 0) {
        let poo = {}
        for (let n in cInv) {
            poo[n] = cInv[n]
        }
        for (let v in array) {
            poo[array[v]] = poo[array[v]].minus(new Decimal("1"))
        }
        document.getElementById("CHSHeaderText").innerHTML = selectorSelection + 1 + " Piece"
        document.getElementById("CSelOptions").innerHTML = "";
        let buttonId = 1;
        for (let quantity in cInv) {
            let val = (poo[quantity])
            if (val.cmp(0) === 1 || quantity === array[selectorSelection]){
                let newButton = document.createElement("button")
                newButton.innerHTML = quantity + " x"+ val
                newButton.id = "button" + buttonId.toString();
                newButton.style.backgroundColor = "white";
                document.getElementById("CSelOptions").appendChild(newButton)
                if (quantity == array[selectorSelection]) {
                    newButton.style.backgroundColor = "green";
                    buttonhighlight = parseInt(newButton.id.slice(6));
                }
                newButton.addEventListener("click", () => {
                        if (buttonhighlight !== 0) {
                            document.getElementById("button" + buttonhighlight.toString()).style.backgroundColor = "white";
                        }
                        buttonhighlight = parseInt(newButton.id.slice(6));
                        
                        newButton.style.backgroundColor = "green";
                        array[selectorSelection] = quantity;
                        updateSelector()
                });
                buttonId++;
            }
        }
    }
    updateSelector();
    let temparray = array
    //checks for nearby pieces
    function checkadjacent(index) {
        let array2 = [];
        let somethingtodo = 0;
        index >= 1 ? array2.push(array[index - 1]): somethingtodo++;
        index <= 6 ? array2.push(array[index + 1]): somethingtodo++;
        index + 4 <= 7 ? array2.push(array[index + 4]): somethingtodo++;
        index - 4 >= 1 ? array2.push(array[index - 4]): somethingtodo++;
        return array2;
    }
    //count # of things in table
    function countthing(array, thing) {
        let count = 0;
        array.forEach(e => {
            e === thing ? count++ : count += 0;
        });
        return count;
    }
    let rubyeaten = 0;
    document.getElementById("EatButton").addEventListener("click", () =>{
        let audiotrack = new Audio("/sounds/bite.mp3");
		audiotrack.play();
        window.console.log(temparray);
        selectedCH = selectedCH.minus(cDmg.plus(new Decimal('3').times(new Decimal(rubyeaten))));
        if (selectedCH <= 0) {
            chocolate = chocolate.plus(nValAr[array[selectedC]].times(new Decimal('1.5').pow(countthing(checkadjacent(selectedC), "white"))));
            selectedC += 1
            if (array[selectedC] === "ruby") {
                rubyeaten++;
            }
            temparray = temparray.slice(1);
            if (selectedC > 7) {
                selectedC = 0
                temparray = array;
                rubyeaten = 0;
            }
            selectedCH = nHpAr[array[selectedC]]

        }
        document.getElementById("ChocolateDisplayText").innerHTML = chocolate.toFixed(0) +"";
        document.querySelectorAll(".chocolate").forEach(e, i => {
            document.getElementById("chocolate" + (7 - i).toString()).style.backgroundColor = "transparent";
        });
        temparray.forEach((e, i) => {
            //anti yandere dev praticies right her
                if (e == "milk") {
                    document.getElementById("chocolate" + (i).toString()).style.backgroundColor = "#b88339";
                } else if (e == "dark") {
                    document.getElementById("chocolate" + (i).toString()).style.backgroundColor = "#8c5a19";
                } else if (e == "white") {
                    document.getElementById("chocolate" + (i).toString()).style.backgroundColor = "#f5f3b3";
                } else if (e == "ruby") {
                    document.getElementById("chocolate" + (i).toString()).style.backgroundColor = "#b51424";
                } else {
                    document.getElementById("chocolate" + (i).toString()).style.backgroundColor = "radial-gradient(#a400ff 0, #3b3b3b 10%, #d6d2d200 15%, #0b243a 50%, #d6d2d2 65%, #26483f 80%, #d6d2d200 95%), repeating-linear-gradient(45deg, #a78b4178, #a548a07a 50px), repeating-linear-gradient(135deg, #634610, #71b737 50px);";
                }
        });
    })
    document.getElementById("CHSHeaderLeft").addEventListener("click", () => {
        if (selectorSelection == 0) {
            selectorSelection = 7
        }
        else {
            selectorSelection -= 1
        }
        updateSelector(selectorSelection);
    })
    document.getElementById("CHSHeaderRight").addEventListener("click", () => {
        if (selectorSelection == 7) {
            selectorSelection = 0
        }
        else {
            selectorSelection += 1
        }
        updateSelector(selectorSelection);
    })
    // Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// Set size and append to the body
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Load GLTF model
const loader = new THREE.GLTFLoader();
loader.load(/models/MilkChocolate.gltf/, function (gltf) {
    scene.add(gltf.scene);
    
    // Optional: Adjust camera position to fit the model
    camera.position.set(0, 1, 3);
}, undefined, function (error) {
    console.error(error);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Start the animation
animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
});