export default {
    title: 'home', // Router 객체에 지정한 이름과 동일
    module: {}, // 페이지에 모듈을 지정할 때
    watch(){
        if(document.querySelector('.main')){
            let gnb = document.querySelector('.gnb')?.clientHeight;
            let footer = document.querySelector('footer')?.clientHeight;
            if(gnb && footer){
                document.querySelector('.main').style.height = window.innerHeight - (parseInt(gnb) + parseInt(footer)) + 'px';
            }
        }
    },
    created(){
        window.addEventListener('resize', ()=>{
            this.watch();
        })
        window.addEventListener('load', ()=>{
            this.watch();
        })
    },
    template: function() {
        return `
        <div tool-window class="h-100">
            
        </div>
        `
    }
}