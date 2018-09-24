
function openNav() {
    document.getElementById("mySidenav").style.width = "40%";
    document.getElementById("main").style.marginLeft = "40%";
    $("#openImp").hide();
    $("#closeImp").show();
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    $("#openImp").show();
    $("#closeImp").hide();
}
