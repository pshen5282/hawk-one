import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
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
    let realInvArray = ["milk","milk","milk","milk","milk","milk","milk","milk"]
    let array = []
    let selectedC = 0
    let selectorSelection = 0
    let selectedCH = new Decimal("1")
    let cDmg = new Decimal("1")
    let cInv = {
        "milk": new Decimal("899999"),
        "dark": new Decimal("899999"),
        "white": new Decimal("899999"),
        "ruby": new Decimal("899999"),
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
    function updateBarArray() {
        for (let n in realInvArray) {
            array[n] = realInvArray[n]
        }
    }
    function updateSelector(buttonhighlight = 0) {
        let poo = {}
        for (let n in cInv) {
            poo[n] = cInv[n]
        }
        for (let v in realInvArray) {
            poo[realInvArray[v]] = poo[realInvArray[v]].minus(new Decimal("1"))
        }
        document.getElementById("CHSHeaderText").innerHTML = selectorSelection + 1 + " Piece"
        document.getElementById("CSelOptions").innerHTML = "";
        let buttonId = 1;
        for (let quantity in cInv) {
            let val = (poo[quantity])
            if (val.cmp(0) === 1 || quantity === realInvArray[selectorSelection]){
                let newButton = document.createElement("button")
                newButton.innerHTML = quantity + " x"+ val
                newButton.id = "button" + buttonId.toString();
                newButton.style.backgroundColor = "white";
                document.getElementById("CSelOptions").appendChild(newButton)
                if (quantity == realInvArray[selectorSelection]) {
                    newButton.style.backgroundColor = "green";
                    buttonhighlight = parseInt(newButton.id.slice(6));
                }
                newButton.addEventListener("click", () => {
                        if (buttonhighlight !== 0) {
                            document.getElementById("button" + buttonhighlight.toString()).style.backgroundColor = "white";
                        }
                        buttonhighlight = parseInt(newButton.id.slice(6));
                        
                        newButton.style.backgroundColor = "green";
                        realInvArray[selectorSelection] = quantity;
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

    updateBarArray()

    document.getElementById("EatButton").addEventListener("click", () =>{
        if (Math.floor(Math.random() * 1.1) === 0) {
            let audiotrack = new Audio("/sounds/bite.mp3");
		    audiotrack.play();
        }
        else {
            let audiotrack = new Audio("/sounds/crunch.mp3");
		    audiotrack.play();
        }
        
        selectedCH = selectedCH.minus(cDmg);
        if (selectedCH <= 0) {
            chocolate = chocolate.plus(nValAr[array[selectedC]].times(new Decimal('1.5').pow(countthing(checkadjacent(selectedC), "white"))));
            if (array[selectedC] === "ruby") {
                cDmg = cDmg.add(3)
            }
            selectedC += 1
            temparray = temparray.slice(1);
            if (selectedC > 7) {
                selectedC = 0
                cDmg = new Decimal("3")
                updateBarArray()
                temparray = array;
            }
            selectedCH = nHpAr[array[selectedC]]

        }
        document.getElementById("ChocolateDisplayText").innerHTML = chocolate.toFixed(0) +"";
        document.querySelectorAll(".chocolate").forEach((e, i) => {
            document.getElementById("chocolate" + (7 - i).toString()).style.backgroundColor = "transparent";
        });
        let i = 0


        for (i; i < 8; i++) {
            let e = temparray[7 - i - selectedC];
                if (e == "milk") {
                    document.getElementById("chocolate" + (i).toString()).style.backgroundColor = "#b88339";
                } else if (e == "dark") {
                    document.getElementById("chocolate" + (i).toString()).style.backgroundColor = "#8c5a19";
                } else if (e == "white") {
                    document.getElementById("chocolate" + (i).toString()).style.backgroundColor = "#f5f3b3";
                } else if (e == "ruby") {
                    document.getElementById("chocolate" + (i).toString()).style.backgroundColor = "#b51424";
                } else {
                    document.getElementById("chocolate" + (i).toString()).style.backgroundColor = "transparent";
                }
        };
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

    //three js stuff
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById("CenterSection").appendChild( renderer.domElement );
    const light = new THREE.PointLight(0xFFFFFF, 300);
    light.position.y = 3
    const light2 = new THREE.AmbientLight(0xFFFFFF, 5);
    light.castShadow = true
    scene.add( light );
    scene.add( light2 );
    const mtlLoader = new MTLLoader()
    const controls = new OrbitControls( camera, renderer.domElement );
    
mtlLoader.load(
    'models/MilkChocolate/MilkChocolate.mtl',
    (materials) => {
        materials.preload()
        console.log(materials)
        let loader = new OBJLoader();
        loader.setMaterials(materials)
    loader.load(
        "/models/MilkChocolate/MilkChocolate.obj",
        function (obj) {
            obj.castShadow = true
            obj.receiveShadow = true
            obj.position.x = 0
            obj.position.y = 0
            obj.position.z = 0
            
            scene.add(obj);
        },
    )
    },
)
    camera.position.set(5,3,3);
    camera.lookAt(0,0,0)
    function animate() {
        

	// required if controls.enableDamping or controls.autoRotate are set to true
	    controls.update();
	    renderer.render( scene, camera );
    }
    document.addEventListener("mousedown", (event) => {
        //right()
    });
    renderer.setAnimationLoop( animate );
});