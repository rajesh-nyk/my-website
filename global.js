//Loader Welcome
const minLoadTime = 1500;
const startTime = new Date().getTime();
var loader = document.getElementById('loader');
window.addEventListener("load", function() {
    setTimeout(() => {
        window.scrollTo(0,0);
    },0)
    window.location.href= "http://127.0.0.1:5500/global.html#loader";
    const loadTime = new Date().getTime() - startTime;
    const remainingTime = minLoadTime - startTime;
    console.log(remainingTime)
    setTimeout(function() {
        window.scrollTo(0,0);
        loader.style.display = "none";
        outlineRajesh()
    }, remainingTime > minLoadTime ? 0 : minLoadTime)
});


/*Smooth Scroll*/

const lenis = new Lenis()

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)