export default {
    style: {
        'li': ``
    },
    template(){
        const contents = `
        <aside id="rsb"
        style="width: 20rem;"
        class="side-bar hide" data-side-bar="right">
            <div
            style="overflow: auto;
            height: 100%;"
            class="p-5 border flex-basis-100">
                <div class="position-static position-sticky-sm" style="top: 12.375px;">
                    <div
                    tool-settings
                    class="menu-title text-uppercase mb-5 text-muted">
                        settings
                    </div>
                    <ul class="list-group">
                        <li
                        tool-info-type
                        class="list-item fw-bold text-primary">box info</li>
                    </ul>
                </div>
            </div>
        </aside>
        `;
        return Object.setStyle(this.style, contents);
    }
}