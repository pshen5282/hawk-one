import * as THREE from 'three';

document.addEventListener("DOMContentLoaded", () =>{
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    let chocolate = 0
    let array = ["ruby","dark","milk","milk","milk","milk","milk","milk"]
    let selectedC = 0
    let selectedCH = 1
    let cDmg = 1
    let cInv = {
        "milk": 8,
        "dark": 0,
        "white": 0,
        "ruby": 0.
    }
    let nValAr = {
        "milk": 1,
        "dark": 8,
        "white": 1,
        "ruby": 2,
    }
    let nHpAr = {
        "milk": 1,
        "dark": 4,
        "white": 1,
        "ruby": 3,
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
        "BarOne": 50
    }
    document.getElementById("EatButton").addEventListener("click", () =>{
        selectedCH -= cDmg
        if (selectedCH <= 0) {
            chocolate += nValAr[array[selectedC]]

            selectedC += 1
            if (selectedC > 7) {
                selectedC = 0
            }
            selectedCH = nValAr[array[selectedC]]
        }
        document.getElementById("ChocolateDisplayText").innerHTML = chocolate+""
    })
});