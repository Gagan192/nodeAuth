
function openNav() {
    document.getElementById("mySidenav").style.width = "70%";
    document.getElementById("main").style.marginLeft = "70%";
    $("#openImp").hide();
    $("#closeImp").show();
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    $("#openImp").show();
    $("#closeImp").hide();
}
