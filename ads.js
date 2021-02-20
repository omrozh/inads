let urlfinal = ""
let adname = ""
let apiKey = ""
let textcontent = ""

function createAds(element, index){
  fetch("https://inads.herokuapp.com/view/" + element.getAttribute("name"))
  .then(res=>{adname = res.url.substring(res.url.lastIndexOf("/") + 1); element.setAttribute('onclick', "clickad(" + adname + ")"); return res.blob()})
  .then(blob=>{

    if(blob.size < 150){
        return "Cannot complete action"
    }
    var img = URL.createObjectURL(blob);
    element.setAttribute('src', img);
    if(window.getComputedStyle(element).position)
        element.insertAdjacentHTML("beforebegin", '<a href="http://inads.herokuapp.com" style="text-decoration: none; color:yellow; float: ' + window.getComputedStyle(element).float + '"><small style="font-size: 6px; margin-left: ' + window.getComputedStyle(element).marginLeft + '; margin-right: ' + window.getComputedStyle(element).marginRight + '">Ads by <span style="color: black;">InAds</small></span></a><br>')

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
        element.setAttribute("width", "10%")
        element.setAttribute("padding-bottom", "70%")
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
})
}

let adElements = document.getElementsByClassName("inads");

if(adElements.length == 0){
    var insertbanner = '<div style="margin-top: 5%; position: sticky; right: 0; top: 0; z-index: 1;"><img class="inads" name=inadsbanner src="" alt="" style="">';
    var insertad = '<img class="inads" name=inadstandard src="" alt="" style="margin-left: 12.5%;">';
    document.body.insertAdjacentHTML("beforeEnd", insertad);
    document.body.insertAdjacentHTML("afterbegin", insertbanner);
    document.body.insertAdjacentHTML("afterbegin", insertad);
    adElements = document.getElementsByClassName("inads");
}

for(var i = 0; i < adElements.length; i++) {
  createAds(adElements[i], i)
}

function clickad(index){
    document.location = "https://inads.herokuapp.com/adclick/" + index
}
