import {Router, Route, Layout} from '../../core/core.js'
import router from '../../routes/router.js'

Object.setStyle = function(style, contents){
    let content = new DOMParser().parseFromString(contents, 'text/html').body;
    Object.keys(style).forEach(name=>{
        content.querySelectorAll(name).forEach(el=>{
            el.style.cssText = style[name];
        });
    });
    return content.innerHTML;
}

Object.filter = function(obj, predicate){
    const tmp = {};
    Object.keys(obj).filter(predicate).map(x=>{
        tmp[x] = obj[x];
        return tmp;
    });
    return tmp;
}

Route.init({
    el: '#app',
    Layout,
    router,
});

