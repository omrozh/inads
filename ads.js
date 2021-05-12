let urlfinal = ""
let adname = ""
let apiKey = ""
let textcontent = ""

function adFeedCreate(element){
    var insertfeed = '<center> <span style="float: left">Discover by InAds Global</span>   <hr style="clear:both; color: black;">  <div class="inadsgroupsquare"></div>         <br style="clear: both">         <div style="margin-top: 5%; clear: both" class="inadsgroupsquare"></div>         <br style="clear: both">         <div style="margin-top: 5%; clear: both"><img style="margin-left: 12.5%; width: 75%" class=inads name=inadstandard></div><br style="clear: both">         <div style="margin-top: 5%; clear: both"><img style="margin-left: 12.5%; width: 75%" class=inads name=inadstandard></div> <br style="clear: both"> <div class="inadsgroupsquare"></div>         <br style="clear: both">         <div style="margin-top: 5%; clear: both" class="inadsgroupsquare"></div> </center><br style="clear:both">'
    element.insertAdjacentHTML("afterbegin", insertfeed)
}

function adGroupCreate(element){
    var insertadgrouper = '<img class="inads" name=inadstandard src="" alt="" style="float: left; width: 50%;">';
    element.insertAdjacentHTML("afterbegin", insertadgrouper + insertadgrouper + insertadgrouper + insertadgrouper)
}

function adGroupCreateSquare(element){
    var insertadgroupersquare = '<img class="inads" name=inadsquare src="" alt="" style="float: left; width: 20%; margin-left: 2%">';
    element.insertAdjacentHTML("afterbegin", insertadgroupersquare + insertadgroupersquare + insertadgroupersquare + insertadgroupersquare)
}

function createAds(element, index){
  fetch("https://inads.herokuapp.com/view/" + element.getAttribute("name") + "/" + document.title)
  .then(res=>{adname = res.url.substring(res.url.lastIndexOf("/") + 1); element.setAttribute('onclick', "inadsclick(" + adname + ", this)"); return res.text()})
  .then(blob=>{

    console.log(blob)

    if(!(blob.includes("data"))){
        element.hidden = true;
        if(!(element.parentNode.className == "inadsgroup" || element.parentNode.className == "inadsgroupsquare"))
            element.insertAdjacentHTML("afterend", "<a href='https://www.inadsglobal.com' style='color: red; clear: both; text-decoration: none  position: absolute; bottom: 8px; left: 16px;'> <small>Advertise Here!</small> </a>")
        return "Nothing"
    }

    var img = blob;
    element.setAttribute('src', img);

    if(element.getAttribute("name") == "inadsvideo"){
        var store = element.onclick;
        element.setAttribute("onclick", "")
        element.ondblclick = store
        element.muted = false
        element.volume = 0.4
        element.setAttribute("controls","controls");
        element.setAttribute("width", "360")
        element.setAttribute("height", "210")
    }

    if(!(element.parentNode.className == "inadsgroup" || element.parentNode.className == "inadsgroupsquare")){
        element.insertAdjacentHTML("beforebegin", '<a href="http://www.inadsglobal.com" style="text-decoration: none; color:yellow; float: ' + window.getComputedStyle(element).float + '"><small style="font-size: 6px; margin-left: ' + window.getComputedStyle(element).marginLeft + '; margin-right: ' + window.getComputedStyle(element).marginRight + '">Ads by <span style="color: black;">InAds</small></span></a>')
    }

    if(element.getAttribute("name") != "inadsvideo"){
        element.setAttribute("ondblclick", "document.location='https://www.inadsglobal.com/report/" + adname + "'")
    }
    else{
        element.setAttribute("oncontextmenu", "document.location='https://www.inadsglobal.com/report/" + adname + "'")
    }

    if(element.getAttribute("name") == "inadstandard"){
        element.className = "";
        element.removeAttribute("class")
        element.removeAttribute("name")
        element.setAttribute("padding-bottom", "9.25%")
    }
    if(element.getAttribute("name") == "inadsbanner"){
        element.className = "";
        element.removeAttribute("class")
        element.removeAttribute("name")
        element.setAttribute("padding-bottom", "70%")
    }
    if(element.getAttribute("name") == "inadsquare"){
        element.className = "";
        element.removeAttribute("class")
        element.removeAttribute("name")
        element.setAttribute("padding-bottom", "100%")
    }
})
}

let adFeed = document.getElementsByClassName("inadsfeed")

for(var i = 0; i < adFeed.length; i++){
    adFeedCreate(adFeed[i]);
}

let adGroups = document.getElementsByClassName("inadsgroup");
let adGroupsSquare = document.getElementsByClassName("inadsgroupsquare");

for(var i = 0; i < adGroups.length; i++){
    adGroupCreate(adGroups[i]);
}

for(var i = 0; i < adGroupsSquare.length; i++){
    adGroupCreateSquare(adGroupsSquare[i]);
}

let adElements = document.getElementsByClassName("inads");

if(adElements.length == 0){
    var insertbanner = '<div id=autoplacedb style="width: 10%; position: sticky; position: -webkit-sticky; right: 0; top: 0; z-index: 1;"><img class="inads" name=inadsbanner src="" alt="" style="float: left">';
    var insertad = '<img class="inads" name=inadstandard src="" alt="" style="margin-left: 12.5%; width: 50%">';
    document.body.insertAdjacentHTML("beforeEnd", insertad);
    // document.body.insertAdjacentHTML("afterbegin", insertbanner);
    document.body.insertAdjacentHTML("afterbegin", insertad);
    adElements = document.getElementsByClassName("inads");
}

for(var i = 0; i < adElements.length; i++) {
  createAds(adElements[i], i);
}

function inadsclick(index, elemnt){
    window.open("https://inads.herokuapp.com/adclick/" + index)
    elemnt.setAttribute("onclick", "window.open('https://www.inadsglobal.com/adclick/" + index + "/secondclick')")
}

setTimeout(function(){
    const ads = document.getElementsByClassName("inads")
    alert(ads.length)
    for(var i = 0; i < ads.length; i++){
        createAds(ads[i], i)
    }
}, 2000)
