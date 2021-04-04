let urlfinal = ""
let adname = ""
let apiKey = ""
let textcontent = ""

function adGroupCreate(element){
    var insertadgrouper = '<img class="inads" name=inadstandard src="" alt="" style="margin-left: 12.5%; float: left; width: 50%; margin-right: 12.5%">';
    element.insertAdjacentHTML("afterbegin", insertadgrouper + insertadgrouper + insertadgrouper + insertadgrouper)
}

function createAds(element, index){
  fetch("https://inads.herokuapp.com/view/" + element.getAttribute("name") + "/" + document.title)
  .then(res=>{adname = res.url.substring(res.url.lastIndexOf("/") + 1); element.setAttribute('onclick', "inadsclick(" + adname + ")"); return res.text()})
  .then(blob=>{

    console.log(blob)

    if(!(blob.includes("http"))){
        element.hidden = true;
        return "Nothing"
    }

    var img = blob;
    element.setAttribute('src', img);
    element.insertAdjacentHTML("beforebegin", '<a href="http://www.inadsglobal.com" style="text-decoration: none; color:yellow; float: ' + window.getComputedStyle(element).float + '"><small style="font-size: 6px; margin-left: ' + window.getComputedStyle(element).marginLeft + '; margin-right: ' + window.getComputedStyle(element).marginRight + '">Ads by <span style="color: black;">InAds</small></span></a><br>')

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
        element.setAttribute("width", "100%")
        element.setAttribute("padding-bottom", "70%")
        element.insertAdjacentHTML("beforeend", "<small> Ads by InAds </small>")
    }
    if(element.getAttribute("name") == "inadsquare"){
        element.style.removeProperty("width")
        element.style.removeProperty("height")
        element.className = "";
        element.removeAttribute("class")
        element.removeAttribute("name")
        element.setAttribute("width", "100%")
        element.setAttribute("padding-bottom", "100%")
    }
})
}

let adGroups = document.getElementsByClassName("inadsgroup");

for(var i = 0; i < adGroups.length; i++){
    adGroupCreate(adGroups[i]);
}

let adElements = document.getElementsByClassName("inads");

if(adElements.length == 0){
    var insertbanner = '<div id=autoplacedb style="width: 10%; position: sticky; position: -webkit-sticky; right: 0; top: 0; z-index: 1;"><img class="inads" name=inadsbanner src="" alt="" style="float: left">';
    var insertad = '<img class="inads" name=inadstandard src="" alt="" style="margin-left: 12.5%;">';
    document.body.insertAdjacentHTML("beforeEnd", insertad);
    // document.body.insertAdjacentHTML("afterbegin", insertbanner);
    document.body.insertAdjacentHTML("afterbegin", insertad);
    adElements = document.getElementsByClassName("inads");
}

for(var i = 0; i < adElements.length; i++) {
  createAds(adElements[i], i)
}

function inadsclick(index){
    document.location = "https://inads.herokuapp.com/adclick/" + index
}
