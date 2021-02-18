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
// document.body.insertAdjacentHTML("beforebegin", "<small> Ads by InAds </small>")

if(adElements.length == 0){
    var insertbanner = '<img class="inads" name=inadsbanner src="" alt="" style="float: right;">';
    var insertad = '<img class="inads" name=inadstandard src="" alt="" style="margin-left: 12.5%"><br><small style="margin-left: 12.5%"> <a href="http://inads.herokuapp.com" style="text-decoration: none; color:yellow;">Ads by <div style="color: black; float: left;">&nbsp;InAds</div> </a></small>';
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
