//carousel behavior
const carousel = document.querySelector("#carousel-items")
const caroItems = document.querySelectorAll(".caro-item")
const caroBtns = document.querySelectorAll(".caro-btns")
const projectDescription = document.querySelectorAll(".project-description")
const caroContainer = document.getElementById("carousel")
const carouselNodes = caroContainer.children
const maxCaroIndex = caroItems.length - 1;
const caroIndicators = document.querySelector("#caroIndicators")
/* Note, setInterval must be defined as variable (lets clearInterval work)
variable containing setInterval should also be defined within 
a variable. This is due to scope, else if this doesnt happen 
it causes the creation of multiple timers, breaking the carousel */
const timerSpeed = 12000;
let caroTimerInterval;
let allCaroIndicators
let prevCaroIndex = 0;
let currCaroIndex = 1;
let caroClickDisabled = false;

function caroClassBehavior(){
    caroItems[prevCaroIndex].classList.add("hidden");
    caroItems[prevCaroIndex].classList.remove("show");
    caroItems[currCaroIndex].classList.remove("hidden");
    caroItems[currCaroIndex].classList.add("show");
    caroItems[currCaroIndex].classList.remove("no-width");
    caroItems[prevCaroIndex].classList.add("no-width");
}

const caroIndicatorBehavior = (e) => {
    //find current indicator value
    const currIndicator = e.target.closest("button")
    const currIndicatorIndex = Object.keys(allCaroIndicators).find(key => allCaroIndicators[key] === currIndicator)
    //we dont want to shift caro positions if its the same button 
    if(parseInt(currIndicatorIndex) === currCaroIndex) return 

    //we shift accroding to how different the clicked value is from the current one. 
    const translateX = (currCaroIndex - currIndicatorIndex) * 100
    prevCaroIndex = currCaroIndex;
    currCaroIndex = parseInt(currIndicatorIndex);
    //correct animation direction
    for(let index=0; index<=maxCaroIndex; index++){
        const currX = caroItems[index].style.transform.replace(/[^-?\d.]/g, '');
        if(index === currCaroIndex) caroItems[index].style.transform = `translate(0vw)`
        else caroItems[index].style.transform = `translate(${(index - currCaroIndex)*100}vw)`
    }
 
    setTimeout(()=>{
        checkOverflow();
    }, 400)

    caroClassBehavior()

    //selects appropriate indicator
    currIndicator.firstChild.classList.add("active")
    allCaroIndicators[prevCaroIndex].firstChild.classList.remove("active")
}

const createIndicatorListeners = () =>{
    allCaroIndicators[currCaroIndex].firstChild.classList.add("active")
    for (let i in Object.keys(allCaroIndicators)){
        allCaroIndicators[i].addEventListener("click", caroIndicatorBehavior)
    }
}

const createCaroIndicators = () =>{
    for (let i=0; i<=maxCaroIndex; i++){
        //Carousel Indicator Creation 
        let node = document.createElement("button")
        let indicator = document.createElement("span")
        indicator.classList.add("dot")
        node.classList.add("caroIndicators")
        node.append(indicator)
        caroIndicators.append(node)
    
        //generate initial translate properties for all items in carousel
        if(i===prevCaroIndex) caroItems[i].style.transform = `translate(-100vw)`
        else caroItems[i].style.transform = `translate(${(i-1)*100}vw)`

        //attach event listeners to each caro indicator
    }
    //assign variable since they have been created
    allCaroIndicators = caroIndicators.querySelectorAll(".caroIndicators")

    //clear auto moving
    clearInterval(caroTimerInterval);
    //attach event listeners
    createIndicatorListeners();
}

//not to be confused with caroContainer
//this means the containers next to the images (.ie overview, limitations, etc)
const containerBehavior = (e) => {
    const btn = e.target.closest("button")
    const icon = btn.querySelector("i")
    if(btn.parentNode.parentNode.classList.contains("hide")) {
        btn.parentNode.parentNode.classList.remove("hide")
        setTimeout(()=>{
            icon.classList.remove("fa-angle-down") 
            icon.classList.add("fa-angle-up")
        },300)
    }
    else {
        
        setTimeout(()=>{
            icon.classList.remove("fa-angle-up") 
            if(!icon.classList.contains("fa-angle-down")) icon.classList.add("fa-angle-down")
        },300)
        btn.parentNode.parentNode.classList.add("hide")
        
    }
}
//expand text in cards
const createExpandBtns=(container)=>{
    //dont create additional buttons when called multiple times, and btn exists
    if(container.querySelector(".expand-container-btn")) return

    let expandBtn = document.createElement("button")
    let btnIcon = document.createElement("i")
    expandBtn.setAttribute("data-label", "expand")
    expandBtn.ariaLabel = "expand"
    expandBtn.classList.add("expand-container-btn")
    btnIcon.classList.add("fa", "fa-angle-down")
    btnIcon.ariaHidden="true"
    expandBtn.append(btnIcon)
    container.append(expandBtn)
    expandBtn.addEventListener("click", containerBehavior)

    container.classList.add("expand")
}
//cleanup listeners
const removeExpandBtns=(container)=>{
    //dont remove btns when there are none
    if(!container.querySelector(".expand-container-btn")) return

    const btn = container.querySelector("button")
    container.parentNode.classList.remove("hide")
    btn.removeEventListener("click", containerBehavior)
    btn.remove()

    container.classList.remove("expand")
}
//condition to give container expansion
const checkOverflow = () =>{
    const descriptContainers = projectDescription[currCaroIndex].querySelectorAll(".text-container")
    for(let container of descriptContainers){
        if(container.scrollHeight > container.clientHeight) createExpandBtns(container)
        else if (container.clientHeight > 225) createExpandBtns(container)
        else removeExpandBtns(container)
    }
}
/* wrote the following to restart timer after a click.
    however, determined this would not be good because it may not give user
    time to focus on content. Opted for restarting timer when user left div
    const resetCaroTimer = () => {
    clearInterval(caroTimerInterval);
    caroTimer();
}*/
const autoStartCarousel = () =>{
    caroTimerInterval = setInterval(() => {
        caroMoveRight()
    }, timerSpeed);
}
function caroMoveRight(e=0){
    if (caroClickDisabled == false){
        caroClickDisabled = true;
        if(e!=0) e.preventDefault();
        prevCaroIndex = currCaroIndex;
        currCaroIndex =  currCaroIndex >=  maxCaroIndex ? 0 :currCaroIndex + 1;
        //correct animation direction
        for(let index=0; index<=maxCaroIndex; index++){
            const translateX = caroItems[index].style.transform.replace(/[^-?\d.]/g, '');
            if(index === currCaroIndex) caroItems[index].style.transform = `translate(0vw)`
            else caroItems[index].style.transform = `translate(${translateX-100}vw)`
        }
        caroClassBehavior();

        //append next element to end, and adjust translate value accordingly
        const isMax = currCaroIndex+1 > maxCaroIndex
        caroItems[isMax ? 0: currCaroIndex+1].style.transform = `translate(100vw)`
        setTimeout(()=>{
            carousel.insertBefore(caroItems[isMax ? 0: currCaroIndex+1], caroItems[currCaroIndex].nextElementSibling)
        }, 250)
        //check in container needs to expand
        setTimeout(()=>{
            checkOverflow()
        }, 400)
        //disable clicks until animation completes
        setTimeout(function(){caroClickDisabled = false;}, 550)
        //update indicators
        allCaroIndicators[currCaroIndex].firstChild.classList.add("active")
        allCaroIndicators[prevCaroIndex].firstChild.classList.remove("active")
    }
}

function caroMoveLeft(e=0){
    if (caroClickDisabled == false){
        caroClickDisabled = true;
        if(e!=0) e.preventDefault();
        prevCaroIndex = currCaroIndex;
        currCaroIndex = currCaroIndex<= 0? maxCaroIndex : currCaroIndex - 1;
        //correct animation direction
        for(let index=0; index<=maxCaroIndex; index++){
            const translateX = caroItems[index].style.transform.replace(/[^-?\d.]/g, '');
            if(index === currCaroIndex) caroItems[index].style.transform = `translate(0vw)`
            else caroItems[index].style.transform = `translate(${parseInt(translateX) + 100}vw)`
        }
        caroClassBehavior()

        //append next element to start, and adjust translate value accordingly
        //only works when current is not the very first node in the tree 
        //(i.e when user has click right first, then left)
        //cannot hold 2 items. Must hold 1 or more.
        const isStart = currCaroIndex-1 < 0
        caroItems[isStart ? maxCaroIndex: currCaroIndex-1].style.transform = `translate(-100vw)`
        setTimeout(()=>{
            carousel.insertBefore(caroItems[isStart ? maxCaroIndex: currCaroIndex-1], caroItems[prevCaroIndex-1])
        }, 250)
        //check in container needs to expand
        setTimeout(()=>{
            checkOverflow()
        }, 400)
        //disable clicks until animation completes
        setTimeout(function(){caroClickDisabled = false;}, 550) 
        allCaroIndicators[currCaroIndex].firstChild.classList.add("active")
        allCaroIndicators[prevCaroIndex].firstChild.classList.remove("active")
    }
}
const carouselObserver = new IntersectionObserver(function(entries) {
    if(entries[0].isIntersecting){
        autoStartCarousel()
    } else {
        clearInterval(caroTimerInterval);
    }
}, { threshold: [0.4] });

//makes indicators reappear
caroContainer.addEventListener("mouseenter", () => {
    caroBtns[0].classList.remove("hidden")
    caroBtns[1].classList.remove("hidden")

    clearInterval(caroTimerInterval);
})


caroContainer.addEventListener("mouseleave", ()=>{
    caroBtns[0].classList.add("hidden")
    caroBtns[1].classList.add("hidden")
})

//on phones, carousel is made more static, for UX purposes
caroContainer.addEventListener("touchstart", () => {
    caroBtns[0].classList.remove("hidden")
    caroBtns[1].classList.remove("hidden")

    clearInterval(caroTimerInterval);
})

caroContainer.addEventListener("touchmove", () => {
    caroBtns[0].classList.remove("hidden")
    caroBtns[1].classList.remove("hidden")

    clearInterval(caroTimerInterval);
})
//stops movement when mouse enters
for (let i in Object.keys(carouselNodes)){
    carouselNodes[i].addEventListener("mouseenter", () => {
        clearInterval(caroTimerInterval);
    })
    carouselNodes[i].addEventListener("touchstart", () => {
        clearInterval(caroTimerInterval);
    })
    carouselNodes[i].addEventListener("touchend", () => {
        clearInterval(caroTimerInterval);
    })
}

//Carousel Behavior when arrows are clicked
caroBtns[0].addEventListener("click", function(e){
    caroMoveLeft(e)
})

caroBtns[1].addEventListener("click", function(e){
    caroMoveRight(e)
})

carouselObserver.observe(carousel);

export {
    checkOverflow as checkOverflow,
    createCaroIndicators as createCaroIndicators,
    removeExpandBtns as removeExpandBtns,
    autoStartCarousel as autoStartCarousel,
}