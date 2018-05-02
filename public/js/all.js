function addUser(){

	window.location.href = '/customers/add';
}
function cancelAdd(){

    window.location.href = '/customers';
}

function allblocks(){

    window.location.href = '/allblocks';
}

var t1 = true;
var test1 = 0;
function openNav() {

    if (t1) {
        document.getElementById("datatable").style.marginLeft = "170px";
        document.getElementById("mySidenav").style.width = "170px";
        document.getElementById("header").style.marginLeft = "169px";
        document.getElementById("header").style.width = "89%";
        document.getElementById("datatable").style.marginLeft = "170px";
      //  document.getElementById("logo").style.paddingRight = "200px";
        t1 = false;
    }
    else
    {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("header").style.marginLeft = "0";
        document.getElementById("datatable").style.marginLeft = "0";
        document.getElementById("logo").style.paddingRight= "5px";
        document.getElementById("header").style.width = "99%";
        t1 = true;
    }
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("header").style.marginLeft = "0";
    document.getElementById("datatable").style.marginLeft = "0";
    document.getElementById("logo").style.paddingRight= "0";
}

jQuery(document).ready(function($) {
    $(".clickable-row").click(function() {
        window.location = $(this).data("href");
    });
});

