let urlfinal = ""
let adname = ""
let apiKey = ""

function createAds(element, index){
  fetch("https://inads.herokuapp.com/view/" + element.getAttribute("name"))
  .then(res=>{urlfinal = res.url; return res.blob()})
  .then(blob=>{
    var img = URL.createObjectURL(blob);
    if(blob.size == 6148){
        alert("Ad could not be loaded!")
    }
    adname = urlfinal.substring(urlfinal.lastIndexOf("/") + 1)
    console.log(adname)
    element.setAttribute('src', img);
    if(element.getAttribute("name") == "inadstandard"){
        element.style.removeProperty("width")
        element.style.removeProperty("height")
        element.className = "";
        element.removeAttribute("class")
        element.removeAttribute("name")
        element.setAttribute("height", "15%")
        element.setAttribute("width", "75%")
        element.insertAdjacentHTML("beforeend", "<small> Ads by InAds </small>")
    }
    if(element.getAttribute("name") == "inadsbanner"){
        element.style.removeProperty("width")
        element.style.removeProperty("height")
        element.className = "";
        element.removeAttribute("class")
        element.removeAttribute("name")
        element.setAttribute("height", "70%")
        element.setAttribute("width", "15%")
        element.insertAdjacentHTML("beforeend", "<small> Ads by InAds </small>")
    }
    if(element.getAttribute("name") == "inadsquare"){
        element.style.removeProperty("width")
        element.style.removeProperty("height")
        element.className = "";
        element.removeAttribute("class")
        element.removeAttribute("name")
        element.setAttribute("height", "20%")
        element.setAttribute("width", "20%")
        element.insertAdjacentHTML("afterend", "<small> Ads by InAds </small>")
    }
    element.setAttribute('onclick', "clickad(" + adname + ")");
})
}

let adElements = document.getElementsByClassName("inads");

if(adElements.length == 0){
    var insertad = '<img style="float: left;" class="inads" name=inadstandard src="" alt="" style="margin-left: auto; margin-right:auto">';
    document.body.insertAdjacentHTML("beforeEnd", insertad);
    document.body.insertAdjacentHTML("afterbegin", insertad);

    adElements = document.getElementsByClassName("inads");
}

for(var i = 0; i < adElements.length; i++) {
  createAds(adElements[i], i)
}

function clickad(index){
    document.location = "https://inads.herokuapp.com/adclick/" + index
}
