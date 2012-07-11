
$(".activate3d").click( function(){
    console.log("yes");
    Application;
});

ThreeDit = (function(win, doc){
    
    var app = {
        zDepth: 100,
        maxElems: 100,
        perspective: 500,
        initialized: false
    }
    
    var _items = [];
    var _win = win;
    var _doc = doc;
    var _body;
    var _prefix;
    var _originPrefix;
    var _transformPrefix;
    
    var _docStyle;
    var _docElem;
    var _getComputedStyle;
    
    var _mx;
    var _my;
    var _tmx;
    var _tmy;
    var _halfW;
    var _halfH;
    var _pScrollX;
    var _pScrollY;
    var _centerX;
    var _centerY;
    
    var _centerOffsetX;
    var _centerOffsetY;
    
    
    function init(doc){
        _doc = doc;
        _body = _doc.body;
        _prefix = "webkitTransform" in _body.style ? "webkit" : "MozTransform" in _body.style ? "Moz" : null;
        _originPrefix = _prefix + "TransformOrigin";
        _transformPrefix = _prefix + "Transform";
        _docElem = _doc.documentElement;
        _docStyle = _docElem.style;
        _getComputedStyle = _win.getComputedStyle;
        
        _pScrollX = _body.scrollLeft;
        _pScrollY = _body.scrollTop;
        
        _docStyle[_prefix+"Perspective"] = app.perspective + "px";
        _docStyle.backgroundImage = _getComputedStyle(_body).getPropertyValue("background-image");
        _docStyle.backgroundColor = _getComputedStyle(_body).getPropertyValue("background-color");
        
        recollectElems();
        
        
        if(!app.initialized){
            _onResize();
            _mx = _tmx;
            _my = _tmy;
            _win.addEventListener("resize", _onResize);
            _win.addEventListener("scroll", _onScroll);
            _doc.addEventListener("mousemove", _onMouseMove);
            setInterval(render, 1000 / 60);
        }
        app.initialized = true;
    }
    
    function _setNode(node, depth, skip){
        if(_items.length>=app.maxElems-1) return;
        if(!skip && node.tagName == "DIV" && node.childNodes.length > 0) {
            _items.push({node: node, z: depth});
        }
        for(var i=0;i<node.childNodes.length;i++){
            _setNode(node.childNodes[i], depth+1, node.childNodes.length<2);
        }
    }
    
    function changePerspective(val){
        app.perspective = val;
        _docStyle[_prefix+"Perspective"] = app.perspective + "px";
    }
    
    function recollectElems(){
        var item;
        for(var i=0;i<_items.length;i++){
            _items[i].node.style[_transformPrefix] = "none";
        }
        delete _items;
        _items = [];
        
        _setNode(_body, 0);
        _items.push({node: _body, z: 0});
        _items.sort(function sortFunc(a, b){
            return a.z - b.z;
        })
        var depth=0;
        var zList = [depth];
        _items[0].z = depth;
        for(var i=1;i<_items.length;i++){
            zList.push(depth = _items[i].z == _items[i-1].z ? depth : depth+1); 
        }
        var max = zList[zList.length-1];
        for(var i=0;i<_items.length;i++){
            _items[i].z=zList[i]/max;
        }
    }
    
    function render(){
        _mx += (_tmx - _mx) * .05;
        _my += (_tmy - _my) * .05;
        var rotateX = (_mx - _centerX) / _halfW *5;
        var rotateY = -(_my - _centerY)  / _halfH *5;
        for(var i=0;i<_items.length;i++){
            var node = _items[i].node;
            var tmp = node;
            var x = 0;
            var y = 0;
            var z = _items[i].z;
            node.style[_originPrefix] = (_centerOffsetX - x) + "px " + (_centerOffsetY - y) + "px";
            node.style[_transformPrefix] = "rotateY(" + rotateX + "deg) rotateX(" + rotateY + "deg)translate3d(0px,0px, " + (z * app.zDepth) + "px)";
         }
    }
    
    function _onResize(){
        _halfW = _win.innerWidth/2;
        _halfH = _win.innerHeight/2;
        _tmx = _centerX = _body.scrollLeft + _halfW ;
        _tmy = _centerY = _body.scrollTop + _halfH ;
        _centerOffsetX = _centerX + _docElem.clientLeft - _win.pageXOffset;
        _centerOffsetY = _centerY + _docElem.clientTop - _win.pageYOffset;
    }
    
    function _onScroll(){
        var diffSX = _body.scrollLeft - _pScrollX;
        var diffSY = _body.scrollTop - _pScrollY;
        _tmx = _centerX = _body.scrollLeft + _halfW ;
        _tmy = _centerY = _body.scrollTop + _halfH ;
        _mx += diffSX;
        _my += diffSY;
        _centerOffsetX = _centerX + _docElem.clientLeft - _win.pageXOffset;
        _centerOffsetY = _centerY + _docElem.clientTop - _win.pageYOffset;
        
        _pScrollX = _body.scrollLeft;
        _pScrollY = _body.scrollTop;
    }
    function _onMouseMove(e){
        _tmx = e.clientX+_body.scrollLeft;
        _tmy = e.clientY+_body.scrollTop;
    }
    
    
    app.init = init;
    app.recollectElems = recollectElems;
   app.render = render;
   
    app.changePerspective = changePerspective;
    
    return app;
    
}(window, document));






//extra

Application = (function(){
    
    var app = {
        
    }
    
    var _dragLink;
    var _source;
    var _data;
    
    function init(data){
        _dragLink = $("#drag-link");
         _data = data;
        $("#iframe").load(function(){
            ThreeDit.zDepth = _data.zDepth;
            ThreeDit.maxElems = _data.maxElems;
            ThreeDit.perspective = _data.perspective;
            ThreeDit.init($("#iframe")[0].contentDocument);
            updateSource();
            
            StageReference.addRenderFunc(Setting.refresh);
        });
    }
    
    function changeZDepth(val){
        if(!ThreeDit.initialized) {
            _data.zDepth = val;
        }else{
            ThreeDit.zDepth = val;
            updateSource();
        }
    }
    function changeMaxElems(val){
        if(!ThreeDit.initialized) {
            _data.maxElems = val;
        }else{
            ThreeDit.maxElems = val;
            ThreeDit.recollectElems();
            updateSource();
        }
    }
    function changePerspective(val){
        if(!ThreeDit.initialized) {
            _data.perspective = val;
        }else{
            ThreeDit.changePerspective(val);
            updateSource();
        }
    }
    
    function updateSource(){
        _source = 'javascript:if(!window.ThreeDit){ThreeDit=function(a,b){function G(a){p=a.clientX+g.scrollLeft;q=a.clientY+g.scrollTop}function F(){var a=g.scrollLeft-t;var b=g.scrollTop-u;p=v=g.scrollLeft+r;q=w=g.scrollTop+s;n+=a;o+=b;x=v+l.clientLeft-e.pageXOffset;y=w+l.clientTop-e.pageYOffset;t=g.scrollLeft;u=g.scrollTop}function E(){r=e.innerWidth/2;s=e.innerHeight/2;p=v=g.scrollLeft+r;q=w=g.scrollTop+s;x=v+l.clientLeft-e.pageXOffset;y=w+l.clientTop-e.pageYOffset}function D(){n+=(p-n)*.05;o+=(q-o)*.05;var a=(n-v)/r*5;var b=-(o-w)/s*5;for(var e=0;e<d.length;e++){var f=d[e].node;var g=f;var h=0;var k=0;var l=d[e].z;f.style[i]=x-h+"px "+(y-k)+"px";f.style[j]="rotateY("+a+"deg) rotateX("+b+"deg)translate3d(0px,0px, "+l*c.zDepth+"px)"}}function C(){var a;for(var b=0;b<d.length;b++){d[b].node.style[j]="none"}delete d;d=[];A(g,0);d.push({node:g,z:0});d.sort(function h(a,b){return a.z-b.z});var c=0;var e=[c];d[0].z=c;for(var b=1;b<d.length;b++){e.push(c=d[b].z==d[b-1].z?c:c+1)}var f=e[e.length-1];for(var b=0;b<d.length;b++){d[b].z=e[b]/f}}function B(a){c.perspective=a;k[h+"Perspective"]=c.perspective+"px"}function A(a,b,e){if(d.length>=c.maxElems-1)return;if(!e&&a.tagName=="DIV"&&a.childNodes.length>0){d.push({node:a,z:b})}for(var f=0;f<a.childNodes.length;f++){A(a.childNodes[f],b+1,a.childNodes.length<2)}}function z(a){f=a;g=f.body;h="webkitTransform"in g.style?"webkit":"MozTransform"in g.style?"Moz":null;i=h+"TransformOrigin";j=h+"Transform";l=f.documentElement;k=l.style;m=e.getComputedStyle;t=g.scrollLeft;u=g.scrollTop;k[h+"Perspective"]=c.perspective+"px";k.backgroundImage=m(g).getPropertyValue("background-image");k.backgroundColor=m(g).getPropertyValue("background-color");C();if(!c.initialized){E();n=p;o=q;e.addEventListener("resize",E);e.addEventListener("scroll",F);f.addEventListener("mousemove",G);setInterval(D,1e3/60)}c.initialized=true}var c={zDepth:'+
        ThreeDit.zDepth+',maxElems:'+ThreeDit.maxElems+',perspective:'+ThreeDit.perspective+',initialized:false};var d=[];var e=a;var f=b;var g;var h;var i;var j;var k;var l;var m;var n;var o;var p;var q;var r;var s;var t;var u;var v;var w;var x;var y;c.init=z;c.recollectElems=C;c.render=D;c.changePerspective=B;return c}(window,document);ThreeDit.init(document);}else{ThreeDit.recollectElems();}';
        _dragLink.attr("href", _source);
    }
    
    function show(){
    }
    
    app.init = init;
    app.show = show;
    app.changeZDepth = changeZDepth;
    app.changeMaxElems = changeMaxElems;
    app.changePerspective = changePerspective;
    
    return app;
    
}());






