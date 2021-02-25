const doms = document.querySelectorAll('div[data-server-rendered=true');
console.log(doms)
// import '~/src/lib/css/reset.scss';
import '~/lib/css/index.scss';


doms.forEach(dom => {
    console.log(dom.getAttribute('class'))
})


// window.hydrid = function(componentName) {

// }