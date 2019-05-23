"use strict";
var loaded = 0;
var loaded2 = 0;
var loaded3 = 0;
var anim1;
var anim2;
var anim3;

var base;
var flavourChoice;

function tilt(item) {
    var obj = document.getElementById(item);
    obj.style.transform = "rotate(20deg)";
}

function untilt(item) {
    var obj = document.getElementById(item);
    obj.style.transform = "rotate(0deg)";
}

function playanim() {
    if (loaded === 0) {
        loaded = 1;
        spirit.loadAnimation({ autoPlay: false, loop: true, yoyo: true, container: document.getElementById("1"), path:       './Images/smoke.json' })
        .then(timeline => {
            anim1 = timeline;
        })
    }
    if (loaded === 1) {
        anim1.play(0);
    }
}

function playanim2() {
    if (loaded2 === 0) {
        loaded2 = 1;
        spirit.loadAnimation({ autoPlay: false, loop: true, yoyo: true, path: './Images/strong.json' })
        .then(timeline => {
            anim2 = timeline;
        })
    }
    if (loaded2 === 1) {
        anim2.play(0);
    }
}

function playanim3() {
    if (loaded3 === 0) {
        loaded3 = 1;
        spirit.loadAnimation({ autoPlay: false, loop: true, yoyo: true, path: './Images/sweet.json' })
        .then(timeline => {
            anim3 = timeline;
        })
    }
    if (loaded3 === 1) {
        anim3.play(0);
    }
}

function stopanim(val) {
    if (val === 1) {
        anim1.pause(0);
    }
    if (val === 2) {
        anim2.pause(0);
    }
    if (val === 3) {
        anim3.pause(0);
    }
}

function selectbase(item) {
    base = item;
    console.log(base);
    document.getElementById("choosebase").style.visibility = "hidden";
    document.getElementById("choosetaste").style.visibility = "visible";
    document.getElementById("name").innerHTML = "What flavour are you going for?";
}

function selectflavour(flavour) {
    flavourChoice = flavour;
    console.log(flavourChoice);
    document.getElementById("choosetaste").style.visibility = "hidden";
    document.getElementById("result").style.visibility = "visible";
    if (base === "vodka") {
        if (flavourChoice === "strong") {
            document.getElementById("resulttitle").innerHTML = "Vodka Martini";
            document.getElementById("resultwords").innerHTML = "Perfect for the midweek blues. Vodka and dry vermouth.";
        }
        else if (flavourChoice === "sweet") {
            document.getElementById("resulttitle").innerHTML = "French Martini";
            document.getElementById("resultwords").innerHTML = "For the sweet tooth cravings. Vodka, raspberry liqueur and a dash of pineapple juice.";
        }
        else if (flavourChoice === "smokey") {
            document.getElementById("resulttitle").innerHTML = "Smokey Maple";
            document.getElementById("resultwords").innerHTML = "A hint of sweetness to a strong oak flavour. Smoked vodka and a tablespoon of maple syrup.";
        }
    }
    else if (base === "whisky") {
        if (flavourChoice === "strong") {
            document.getElementById("resulttitle").innerHTML = "Manhattan";
            document.getElementById("resultwords").innerHTML = "A true classic. Bourbon or rye whisky, sweet vermouth, Angostura bitters.";
        }
        else if (flavourChoice === "sweet") {
            document.getElementById("resulttitle").innerHTML = "Old Fashioned";
            document.getElementById("resultwords").innerHTML = "Does this count as dessert? Bourbon, bitters, fresh orange, a cherry, a dash of syrup.";
        }
        else if (flavourChoice === "smokey") {
            document.getElementById("resulttitle").innerHTML = "Smoked Boulevardier";
            document.getElementById("resultwords").innerHTML = "Delightful on a cold night. Smoky whisky, sweet vermouth, campari. Add a lemon peel for garnish.";
        }
    }
}

