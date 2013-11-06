qx.Class.define('qxcm.screens.EditorModal', {
    extend : qx.ui.window.Window,

    construct : function(title, form) {
        this.base(arguments, title);

        this.setLayout(new qx.ui.layout.HBox());
        this.setWidth(400);
        this.add(new qx.ui.form.renderer.Single(form));
        this.setAllowClose(true);
        this.setModal(true);
        this.open();

        form.addListener('cancel', this.close, this);
    }
});
