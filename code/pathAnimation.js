/**
 * draw path animation
 * @param path: <path /> d property
 * @param container: parent SVG
 * @param speed: transition speed(ms)
 * @param attrs: path attributes
 * @returns {Promise}
 * Basic pattern: pathAnimation().then(function(){ return pathAnimation() })
 */
function pathAnimation(path,container,speed,attrs ){
    const SVG = 'http://www.w3.org/2000/svg';
    const elm=document.createElementNS(SVG,"path");
    elm.setAttribute("d", path);
    elm.setAttribute("stroke","black");
    elm.setAttribute("fill","none");
    if(attrs && typeof attrs==="object"){
        for(const key in attrs){
            if(key in elm.attributes){
                elm.setAttribute(key,attrs[key])
            }
        }
    }
    const len=elm.getTotalLength();
    elm.setAttribute("stroke-dasharray",len);
    elm.setAttribute("stroke-dashoffset",len);
    elm.setAttribute("stroke-width",2);
    elm.style.transition=speed?speed:len/200+"s";
    elm.style["transition-timing-function"]="linear";
    return new Promise(function(resolve, reject){
        elm.addEventListener("transitionend",function(){
            resolve()
        });
        setTimeout(function(){
            elm.setAttribute("stroke-dashoffset",0);
        },100);
        container.appendChild(elm);
    });
}
/**
 * dependency: pathAnimation
 * draw multi-path animation
 * @param pathArr: [path1, path2, ...]
 * @param container: parent SVG
 * @param speed: transition speed
 * @param attrsArr: [{stroke:"red"},{stroke:"blue"}, ...]
 */
function multiPathAnimation(pathArr,container,speed,attrsArr){
    const iter=pathArr[Symbol.iterator]();
    let counter=0;
    (function step(){
        const result=iter.next();
        if(result.value){
            pathAnimation(result.value,container,speed,attrsArr[counter++]).then(function(){
                step()
            });
        }
    })();
}