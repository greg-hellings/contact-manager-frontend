qx.Class.define('qxcm.Editor', {
    extend    : qx.ui.form.Form,

    construct : function(model) {
        var firstName = new qx.ui.form.TextField(),
            save      = new qx.ui.form.Button('Save'),
            cancel    = new qx.ui.form.Button('Cancel');

        firstName.setWidth(250);
        this.base(arguments);

        this.add(firstName,                  'First Name', null, 'name.first');
        this.add(new qx.ui.form.TextField(), 'Last Name',  null, 'name.last');
        this.add(new qx.ui.form.TextField(), 'Email',      null, 'email');
        this.add(new qx.ui.form.TextField(), 'Mobile',     null, 'phone.mobile');
        this.add(new qx.ui.form.TextField(), 'Home',       null, 'phone.home');
        this.add(new qx.ui.form.TextField(), 'Street',     null, 'address.street');
        this.add(new qx.ui.form.TextField(), 'City',       null, 'address.city');
        this.add(new qx.ui.form.TextField(), 'State',      null, 'address.state');
        this.add(new qx.ui.form.TextField(), 'Zip Code',   null, 'address.zip');

        this.addButton(save);
        this.addButton(cancel);

        cancel.addListener('click', this.cancel, this);
        save.addListener  ('click', this.save,   this);
    },

    members : {
        cancel : function() {
            this.fireEvent('cancel');
        },

        save   : function() {
            this.fireEvent('save');
        }
    }
});
