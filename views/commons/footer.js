export default {
    menu: [
        {
            name: 'box',
            type: 'box',
        },
        {
            name: 'circle',
            type: 'circle',
        }
    ],
    list(){
        return this.menu.map(x=>
        `<div
        tool-shape=${x.type}
        >${x.name}</div>`).join('');
    },
    template: function() {
        return `
        <footer
        tool-picker
        class="footer bg-light tool-bottom-bar">
            <div class="w-flex justify-content-start py-2 gx-3">
                ${this.list()}
            </div>
            <hr class="w-100 my-1">
            <span class="text-white fw-bold">
                <a href="index.html">Penli</a>
            </span>
        </footer>
        `
    }
}