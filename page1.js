function headerEL1() {
    elementI = document.querySelector('.el1 svg path:nth-child(1)');
}
headerEL1()


/* mouse pointer */
gsap.set('.cursor',{
    xPercent: -50,
    yPercent: -50
})
let cursor = document.querySelector('.cursor');
let mouseX;
let mouseY;
window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(cursor, 0.5, {
        x: mouseX,
        y: mouseY
    })
})

window.addEventListener('mousemove', e => {
    document.querySelector('.cursor').style.display = "block";
})

function outlineRajesh() {
    const myName = new SplitType(".name");
    gsap.to('.name .char', {
        y: 0,
        stagger: 0.05,
        delay: 0.2,
        duration: 0.1
    })
    let nameTL = gsap.timeline({
        repeat: -1
    })
    nameTL.to('.name .char:nth-child(1)', {
        rotateY: 180,
        duration: 0.8,
        delay: 2,
    })
    .to('.name .char:nth-child(1)', {
        rotateY: 360,
        duration: 0.8,
        delay: 2,
    })
    
}


