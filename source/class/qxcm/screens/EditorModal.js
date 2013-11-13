qx.Class.define('qxcm.screens.EditorModal', {
    extend : qx.ui.window.Window

    ,include : [
        qx.locale.MTranslation
    ]

    ,statics : {
        windows : new qx.type.Array()
    }

    ,construct : function(title, model) {
        var form;
        this.base(arguments, title);

        this.setLayout(new qx.ui.layout.HBox());
        this.setWidth(400);
        this.setAllowClose(true);
        this.setModal(true);

        form = new qxcm.screens.editor.Editor();
        this.__formController = new qx.data.controller.Form(model || null, form);
        if (!model) {
            this.__formController.createModel();
        }
        this.add(new qx.ui.form.renderer.Single(form));

        form.addListener('cancel', this.close,  this);
        form.addListener('save',   this.__save, this);

        this.open();

        this.__blocker = new qx.ui.core.Blocker(this);
        this.__blocker.setOpacity(0.25);
        this.__blocker.setColor('black');

        this.self(arguments).windows.push(this);
    }

    ,destruct : function() {
        this.self(arguments).windows.remove(this);
    }

    ,members : {
        __listeners : []

        ,__save : function() {
            var contact = this.__formController.getModel(),
                store   = qxcm.data.ContactsStore.getInstance();
            this.__blocker.block();
            store.save(contact);
            this.__listeners.push(store.addListener('createSuccess', this.__saveComplete, this));
            this.__listeners.push(store.addListener('createError',   this.__saveComplete, this));
            this.__listeners.push(store.addListener('updateSuccess', this.__saveComplete, this));
            this.__listeners.push(store.addListener('updateError',   this.__saveComplete, this));
        }

        ,__saveComplete : function(success) {
            var store = qxcm.data.ContactsStore.getInstance();
            if (success) {
                dialog.Dialog.alert(this.tr('Contact Saved'));
                this.close();
                qxcm.data.ContactsStore.getInstance().refresh();
            } else {
                dialog.Dialog.alert(this.tr('Error saving contact'));
                this.__blocker.unblock();
            }
            this.__listeners.forEach(function(listener) {
                store.removeListenerById(listener);
            });
        }
    }
});
