    $( "#myframe" ).load(function(){

        var full = false;
        var framD3 = d3.select("#myframe");
        var fram = document.getElementById("myframe");
        var myDiv = document.getElementsByClassName("col-md-5")[0];
        var navBar = document.getElementsByClassName("navbar");
        console.log(navBar[0]);
        fram.contentDocument.getElementById("fullscreen").addEventListener("click", function() {
            if(full){
               myDiv.style.display = "inline";
                navBar[0].style.display = "inline";
               framD3.classed("col-md-12",false).classed("col-md-7",true);
               full = false;
            }else{
                myDiv.style.display = "none";
                navBar[0].style.display = "none";
                framD3.classed("col-md-7",false).classed("odd-section",true);
                full = true;}
        }, false);
    });
