let urlfinal = ""
let adname = ""
let apiKey = ""
let textcontent = ""

function createAds(element, index){
  fetch("https://inads.herokuapp.com/view/" + element.getAttribute("name"))
  .then(res=>{urlfinal = res.url; return res.blob()})
  .then(blob=>{
    if(blob.size < 150){
        return "Cannot complete action"
    }
    var img = URL.createObjectURL(blob);
    adname = urlfinal.substring(urlfinal.lastIndexOf("/") + 1)
    element.setAttribute('src', img);
    if(element.getAttribute("name") == "inadstandard"){
        element.style.removeProperty("width")
        element.style.removeProperty("height")
        element.className = "";
        element.removeAttribute("class")
        element.removeAttribute("name")
        element.setAttribute("width", "75%")
        element.setAttribute("padding-bottom", "9.25%")
        element.insertAdjacentHTML("beforeend", "<small> Ads by InAds </small>")
    }
    if(element.getAttribute("name") == "inadsbanner"){
        element.style.removeProperty("width")
        element.style.removeProperty("height")
        element.className = "";
        element.removeAttribute("class")
        element.removeAttribute("name")
        element.setAttribute("width", "15%")
        element.setAttribute("padding-bottom", "39,375%")
        element.insertAdjacentHTML("beforeend", "<small> Ads by InAds </small>")
    }
    if(element.getAttribute("name") == "inadsquare"){
        element.style.removeProperty("width")
        element.style.removeProperty("height")
        element.className = "";
        element.removeAttribute("class")
        element.removeAttribute("name")
        element.setAttribute("width", "20%")
        element.setAttribute("padding-bottom", "20%")
    }
    element.setAttribute('onclick', "clickad(" + adname + ")");
})
}

let adElements = document.getElementsByClassName("inads");
document.body.insertAdjacentHTML("beforebegin", "<small> Ads by InAds </small>")

if(adElements.length == 0){
    var insertad = '<img class="inads" name=inadstandard src="" alt="" style="margin-left: 12.5%; margin-right:auto">';
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
