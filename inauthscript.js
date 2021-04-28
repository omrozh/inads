function login(){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://www.inadsglobal.com/inauth", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send(JSON.stringify({
        "username": document.getElementById("username").value,
        "password":document.getElementById("password").value
    }))
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
        let response = JSON.parse(xhr.responseText);
          if(response.status == "Logged In"){
              localStorage.setItem("username", document.getElementById("username").value)
              localStorage.setItem("password", document.getElementById("password").value)
              alert("Logged In")
              document.location = "/"
          }
        }
      }
}

function checkLogin(redloc){
    if(!localStorage.getItem("username")){
        document.location = redloc
        return false;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://www.inadsglobal.com/inauth", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send(JSON.stringify({
        "username":localStorage.getItem("username"),
        "password":localStorage.getItem("password")
    }))

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText);
            var logged = false;
            if(response.status != "Logged In"){
                document.location = redloc
                throw 401;
            }
        }
    }
}

function formCreator(){
    var formcreate = document.getElementById("InAuthForm")
    formcreate.insertAdjacentHTML("beforebegin", '<link rel="stylesheet" href="https://www.inadsglobal.com/authstyles">')

    formcreate.insertAdjacentHTML("afterbegin", "<input type='button' value='Login' onclick='login()' id=loginbutton>")
    formcreate.insertAdjacentHTML("afterbegin", "<input type='password' id='password' placeholder='password'>")
    formcreate.insertAdjacentHTML("afterbegin", "<input type='username' id='username' placeholder='username'>")
    formcreate.insertAdjacentHTML("afterbegin", "<a href='https://www.inadsglobal.com' style='text-decoration: none; color: black; font-family: Arial, Helvetica, sans-serif; margin-right: 1%'>InAds Login</a>")
}

if(document.getElementById("InAuthForm")){
    formCreator()
}
