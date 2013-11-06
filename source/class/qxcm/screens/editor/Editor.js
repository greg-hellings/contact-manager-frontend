qx.Class.define('qxcm.screens.editor.Editor', {
    extend    : qx.ui.form.Form

    ,include   : [
        qx.locale.MTranslation
    ]

    ,construct : function(model) {
        var firstName = new qx.ui.form.TextField(),
            save      = new qx.ui.form.Button(this.tr('Save')),
            cancel    = new qx.ui.form.Button(this.tr('Cancel'));

        firstName.setWidth(250);
        this.base(arguments);

        this.add(firstName,                  this.tr('First Name'), null, 'name.first');
        this.add(new qx.ui.form.TextField(), this.tr('Last Name'),  null, 'name.last');
        this.add(new qx.ui.form.TextField(), this.tr('Email'),      null, 'email');
        this.add(new qx.ui.form.TextField(), this.tr('Mobile'),     null, 'phone.mobile');
        this.add(new qx.ui.form.TextField(), this.tr('Home'),       null, 'phone.home');
        this.add(new qx.ui.form.TextField(), this.tr('Street'),     null, 'address.street');
        this.add(new qx.ui.form.TextField(), this.tr('City'),       null, 'address.city');
        this.add(new qx.ui.form.TextField(), this.tr('State'),      null, 'address.state');
        this.add(new qx.ui.form.TextField(), this.tr('Zip Code'),   null, 'address.zip');

        this.addButton(save);
        this.addButton(cancel);

        cancel.addListener('click', this.cancel, this);
        save.addListener  ('click', this.save,   this);
    }

    ,events : {
        'cancel' : 'qx.event.type.Event'
        ,'save'  : 'qx.event.type.Event'
    }

    ,members : {
        cancel : function() {
            this.fireEvent('cancel');
        },

        save   : function() {
            this.fireEvent('save');
        }
    }
});
