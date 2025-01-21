import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
document.addEventListener("DOMContentLoaded", () =>{
    document.addEventListener('click', function() {
        document.getElementById('ID').play() 
        document.getElementById('ID').addEventListener(
            "ended",
            () => {
                document.getElementById('ID').currentTime = 0;
                document.getElementById('ID').play();
            },
            false
        );
    })
    let chocolate = new Decimal("600000")
    let melts = new Decimal("0")
    let realInvArray = ["milk","milk","milk","milk","milk","milk","milk","milk"]
    let array = []
    let selectedC = 0
    let selectorSelection = 0
    let selectedCH = new Decimal("1")
    let cDmg = new Decimal("1")
    let clickable = true
    let chocolateValueMulti = new Decimal('1')
    let selectedStoreSection = "chocolatebars"
    let multiArray = [new Decimal('1'),new Decimal('1'),new Decimal('1'),new Decimal('1'),new Decimal('1'),new Decimal('1'),new Decimal('1'),new Decimal('1')]
    let defaultInv = {
        "milk": new Decimal("8"),
        "dark": new Decimal("0"),
        "white": new Decimal("0"),
        "ruby": new Decimal("0"),
        "sapphire": new Decimal("0"),
        "jade": new Decimal("0"),
        "metal": new Decimal("0"),
        "peanutButter": new Decimal("0"),
        "raw": new Decimal("0"),
        "wafer": new Decimal("0"),
    }
    let cInv = {...defaultInv}
    let nValAr = {
        "milk": new Decimal("1"),
        "dark": new Decimal("8"),
        "white": new Decimal("1"),
        "ruby": new Decimal("2"),
        "sapphire": new Decimal("25"),
        "jade": new Decimal("1"),
        "metal": new Decimal("50"),
        "peanutButter": new Decimal("1"),
        "raw": new Decimal("1"),
        "wafer": new Decimal("0.5"),
    }
    let nHpAr = {
        "milk": new Decimal("1"),
        "dark": new Decimal("4"),
        "white": new Decimal("1"),
        "ruby": new Decimal("3"),
        "sapphire": new Decimal("3"),
        "jade": new Decimal("3"),
        "metal": new Decimal("20"),
        "peanutButter": new Decimal("1"),
        "raw": new Decimal("2"),
        "wafer": new Decimal("1"),
        
    }
    let nFlTxt = {
        "milk": '"standard milk chocolate"<br> (1/1), no special effects',
        "dark": '"a stronger tasting dark chocolate"<br> (8/4), no special effects',
        "white": '"white chocolate made from cocoa butter"<br> (1,1), nearby chocolate is worth 1.5x',
        "ruby": '"a more acidic chocolate between white and milk chocolate"<br> (2,3), when eaten bite strength +2',
        "sapphire": '"this chocolate is not actually made of sapphire, its just blue"<br> (25, 3), value decreases over time',
        "jade": '"most popular chocolate used for chocolate jewerly"<br> (3, 3), value increases over time, capped at x200',
        "wafer": '"despite barely adding flavor, it makes this up with its texture"<br> (1, 1), bar value is worth 25% more',
        "raw": '"tastes good even though its raw"<br> (2, 1), value depends on the amount of unique chocolate types in the bar',
        "peanutButter": '"this chocolate is nuts"<br> (1, 1), increases bar value by 65%, but decreases bite strength by 2',
        "metal": '"chocolate infused with metal to the point of near inedibility"<br> (50, 20), no special effects',
    }
    let meltBoughtUpgrades = {

    }
    let timeSince = Date.now()
    let chocolateFunctionsPassive = {
        milk:function(){},
        dark:function(){},
        ruby:function(){},
        white:function(hawk){
            let v = checkadjacent(hawk)
            for (let i in v) {
                multiArray[v[i]] = multiArray[v[i]].times(new Decimal('1.5'))
            }
        },
        wafer:function(){
            for (let i in multiArray) {
                multiArray[i] = multiArray[i].times(new Decimal('1.25'))
            }
        },
        jade:function(){},
        sapphire:function(){},
        raw:function(){},
        peanutButter:function(){},
        metal:function(){},
    }
    let chocolateFunctionsEaten = {
        milk:function(){},
        dark:function(){},
        ruby:function(){cDmg = cDmg.add(2)},
        white:function(){},
        wafer:function(){},
        jade:function(){
            multiArray[selectedC] = multiArray[selectedC].times(new Decimal('2').pow(new Decimal('-25').div((Date.now() + 1 - timeSince) / 1000))).times(new Decimal('100'))
        },
        sapphire:function(){
            multiArray[selectedC] = multiArray[selectedC].div(new Decimal((Date.now() + 1 - timeSince) / 500))
        },
        raw:function(){
            let v = [...new Set (array)].length
            multiArray[selectedC] = multiArray[selectedC].times(new Decimal(1.6).pow(v))
        },
        peanutButter:function(){
            for (let i in multiArray) {
                multiArray[i] = multiArray[i].times(new Decimal('1.65'))
            }
            cDmg = cDmg.sub(2)
        },
        metal:function(){},
    }

    let nStoContents = {
        "BarOne": {
            "dark": 40,
            "white": 35,
            "ruby": 25,
        },
        "BarTwo": {
            "wafer": 34,
            "metal": 33,
            "raw": 33,
        },
        "BarThree": {
            "sapphire": 33,
            "jade": 33,
            "peanutButter": 34,
        },
    }
    let bPrices = {
        "BarOne": new Decimal("50"),
        "BarTwo": new Decimal("1750"),
        "BarThree": new Decimal("11250"),
    }
    let save = {}; //for future local storage shenanigans
    let tabselected = 0; //what tab is being selected atm

    function updateBarArray() {
        for (let n in realInvArray) {
            array[n] = realInvArray[n]
        }
    }
    function updateStore() {
        for (let i in bPrices) {
            let newElement = document.createElement('div')
            newElement.addEventListener("mouseover", () => {
                document.getElementById("hovertext2").innerHTML = '<span class="hovertitle">' + i + "</span><br>"
                for (let e in eval("nStoContents." + i)) {
                    document.getElementById("hovertext2").innerHTML += e + ": " + eval("nStoContents." + i + "." + e) + "%<br>";
                }
            })
            newElement.innerHTML = '<span class="nane">'+i+'</span>'+"<br>Price: "+bPrices[i]+" Chocolates"
            let newButton = document.createElement('button')
            newButton.addEventListener("click", () => {
                if (chocolate.cmp(bPrices[i]) >= 0) {
                    chocolate = chocolate.minus(bPrices[i]);
                    bPrices[i] = (bPrices[i].times(new Decimal('1.15'))).round()
                    newElement.innerHTML = '<span class="nane">'+i+'</span>'+"<br>Price: "+bPrices[i]+" Chocolates"
                    newElement.appendChild(newButton)
                    updateChDisplay()
                    for (let v = 0; v < 2; v++) {
                        let rInt = Math.floor(Math.random() * 100)+1
                        for (let j in nStoContents[i]) {
                            rInt -= nStoContents[i][j]
                            if (rInt <= 0) {
                                cInv[j] = cInv[j].add(new Decimal('1'))
                                updateSelector()
                                break
                            }
                        }
                    }
                }
            });
            newButton.innerHTML = "buy"
            newElement.append(newButton)
            document.getElementById('StoreButtons').appendChild(newElement)
        }
    }
    function updateResets(){
        let newReset = document.createElement("div")
        newReset.innerHTML = '<span class="nane">Melt</span>'
        let newButton = document.createElement("button")
        newButton.innerHTML = "Convert"
        newReset.appendChild(newButton)
        document.getElementById("Resets").appendChild(newReset)
    }
    //updateResets()
    updateStore();
    function updateSelector(buttonhighlight = 0) {
        let poo = {}
        for (let n in cInv) {
            poo[n] = cInv[n]
        }
        for (let v in realInvArray) {
            poo[realInvArray[v]] = poo[realInvArray[v]].minus(new Decimal("1"))
        }
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
                    newButton.classList.add("green");
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
                newButton.addEventListener("mouseover", () => {
                    document.getElementById("hovertext").innerHTML = '<span class="hovertitle">' + quantity + "</span><br>" + eval("nFlTxt." + quantity);
                });
                newButton.addEventListener("mouseout", () => {
                    document.getElementById("hovertext").innerHTML = '<span class="hovertitle">' + realInvArray[selectorSelection] + "</span><br>" + eval("nFlTxt." + realInvArray[selectorSelection]);
                });
                buttonId++;
            }
        }
    }
    updateSelector();
    let temparray = array
    //checks for nearby pieces
    function checkadjacent(index) {
        if (index == 0) {
            return [1,4]
        }
        if (index == 1) {
            return [0,2,5]
        }
        if (index == 2) {
            return [1,3,6]
        }
        if (index == 3) {
            return [2,7]
        }
        if (index == 4) {
            return [0,5]
        }
        if (index == 5) {
            return [1,4,6]
        }
        if (index == 6) {
            return [2,5,7]
        }
        if (index == 7) {
            return [3,6]
        }
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
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70 , window.innerWidth / window.innerHeight, 1, 1000);
    const renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setSize( window.innerWidth / 2.4, window.innerHeight / 2.4);
    document.getElementById("Chocolate3dRender").appendChild( renderer.domElement );
    const light = new THREE.PointLight(0xFFFFFF, 150);
    light.decay = 1
    light.position.y = 2
    const light2 = new THREE.AmbientLight(0xFFFFFF, 2.5);
    light.castShadow = true
    scene.add( light );
    scene.add( light2 );
    const mtlLoader = new MTLLoader()
    function addSceneitem(name,mtlLocation, objLocation,xPos,yPos,zPos) {
        mtlLoader.load(
            mtlLocation,
            (materials) => {
                materials.preload()
                let loader = new OBJLoader();
                loader.setMaterials(materials)
            loader.load(
                objLocation,
                function (obj) {
                    obj.castShadow = true
                    obj.receiveShadow = true
                    obj.position.x = xPos
                    obj.position.y = yPos
                    obj.position.z = zPos
                    obj.name = name
                    
                    scene.add(obj);
                },
            )
            },
        )
    }
    camera.position.set(0,15,0);
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true
    controls.enablePan = false
    controls.enableZoom = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    controls.target = new THREE.Vector3(0, 0, 0);
    controls.update()
    function animate() {
	    controls.update();
	    renderer.render( scene, camera );
    }
    
    function updateChDisplay() {
        document.getElementById("ChocolateDisplayText").innerHTML = chocolate.toFixed(0) +" chocolates";
    }

    let nameToObjName = {
        milk: 'MilkChocolate',
        dark: 'DarkChocolate',
        ruby: 'RubyChocolate',
        white: 'WhiteChocolate',
        jade: 'JadeChocolate',
        metal: 'MetalChocolate',
        peanutButter: 'PeanutButterChocolate',
        raw: 'RawChocolate',
        sapphire: 'SapphireChocolate',
        wafer: 'Wafer',
    }

    renderer.setAnimationLoop( animate );

    function generateThreeBoard() {
        clickable = false
        for (let n in scene.children) {
            if (scene.children[n].isGroup == true) {
                scene.remove(scene.children[n])
            }
        }
        for (let i = 0; i < 8; i++) {
            let e = temparray[i];
            addSceneitem(i,'models/'+nameToObjName[e]+'/'+nameToObjName[e]+'.mtl','models/'+nameToObjName[e]+'/'+nameToObjName[e]+'.obj',4*i - 16* Math.floor(i/4)-6,0,4 * Math.floor(i/4)-2)
        };
        setTimeout(function() {
            clickable = true
        },350)
    }
    generateThreeBoard()
    
    for (let hawk in array) {
        chocolateFunctionsPassive[array[hawk]](hawk)
    }

    document.getElementById("EatButton").addEventListener("click", () =>{
        if (clickable) {
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
                chocolateFunctionsEaten[array[selectedC]]()
                chocolate = chocolate.plus(nValAr[array[selectedC]].times(multiArray[selectedC]).times(chocolateValueMulti));
                for (let n in scene.children) {
                    if (scene.children[n].name === selectedC) {
                        scene.remove(scene.children[n])
                    }
                }
                selectedC += 1
                temparray = temparray.slice(1);
                if (selectedC > 7) {
                    selectedC = 0
                    cDmg = new Decimal("1")
                    updateBarArray()
                    temparray = array;
                    multiArray = [new Decimal('1'),new Decimal('1'),new Decimal('1'),new Decimal('1'),new Decimal('1'),new Decimal('1'),new Decimal('1'),new Decimal('1')]
                    generateThreeBoard()
                    timeSince = Date.now()

                    for (let hawk in array) {
                        chocolateFunctionsPassive[array[hawk]](hawk)
                    }
                }
                selectedCH = nHpAr[array[selectedC]]
                updateChDisplay()
            }
           
        }
    })
    document.querySelectorAll(".rightbutton").forEach((e, i) => {
        e.addEventListener("click", () => {
            document.getElementsByClassName("menu")[tabselected].style.display = "none";
            document.getElementsByClassName("rightbutton")[tabselected].style.backgroundColor = "white";
            tabselected = i;
            if (tabselected !== 0) {
                document.getElementById("leftbuttons").style.opacity = "0";
            } else {
                document.getElementById("leftbuttons").style.opacity = "1";
            }
            document.getElementsByClassName("menu")[tabselected].style.display = "flex";
            e.style.backgroundColor = "gold";
        });
    });
    document.querySelectorAll(".leftbutton").forEach((e, i) => {
        e.addEventListener("click", () => {
            document.querySelectorAll(".leftbutton")[selectorSelection].classList.remove("green");
            selectorSelection = i;
            e.classList.add("green");
            updateSelector();
        });
    });
    function updateResetDisplays() {
        if (chocolate.compare(new Decimal(3000)) >= 0) {
            let gain = (new Decimal(3).pow(chocolate.sub(new Decimal(2999)).log(5))).div(20).plus(chocolate.pow(new Decimal(2))).div(new Decimal(90000000000)).round()
            document.getElementById("meltbutton").innerHTML = "reset for "+gain+" melts"
        } else {
            document.getElementById("meltbutton").innerHTML = "reach 3000 chocolates to unlock this..."
        }
    }
    updateResetDisplays()
    document.getElementById("meltbutton").addEventListener("click", () => {
        if (chocolate.compare(new Decimal(3000)) >= 0) {
            for (let n in scene.children) {
                if (scene.children[n].name === selectedC) {
                    scene.remove(scene.children[n])
                }
            }
            let gain = (new Decimal(3).pow(chocolate.sub(new Decimal(2999)).log(5))).div(20) + (chocolate.pow(new Decimal(2))).div(new Decimal(90000000000)).round()
            melts = melts.add(gain)
            chocolate = new Decimal(0)
            cInv = defaultInv
            realInvArray = ["milk","milk","milk","milk","milk","milk","milk","milk"]
            array = ["milk","milk","milk","milk","milk","milk","milk","milk"]
            selectedC = 0
            cDmg = new Decimal("1")
            updateBarArray()
            temparray = array;
            multiArray = [new Decimal('1'),new Decimal('1'),new Decimal('1'),new Decimal('1'),new Decimal('1'),new Decimal('1'),new Decimal('1'),new Decimal('1')]
            timeSince = Date.now()

            for (let hawk in array) {
                chocolateFunctionsPassive[array[hawk]](hawk)
            }    
            selectedCH = nHpAr[array[selectedC]]        
            updateChDisplay()
            updateResetDisplays()
            updateSelector();
            generateThreeBoard();
        }
    })
});