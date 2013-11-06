qx.Class.define('qxcm.screens.list.ListController', {
    extend : qx.data.controller.List

    ,include : [
        qx.locale.MTranslation
    ]

    ,construct : function(list) {
        this.base(arguments, null, list);

        //this.list = list;
        this.setLabelOptions({converter : this.converter});
        this.__store = new qxcm.data.ContactsStore();
        this.__store.bind('model', this, 'model');
        //this.bind('model', list, 'model');

        this.__store.addListener('removeSuccess', this.__removeSuccess, this);
        this.__store.addListener('removeError', this.__removeError, this);
        this.__store.addListener('listSuccess', this.__listSuccess, this);
        this.__store.addListener('listError', this.__listError, this);
    }
    
    ,events : {
        'listloaded' : 'qx.event.type.Event'
    }

    ,members : {
        refresh : function() {
            this.__store.refresh();
        }

        ,converter : function(value, model) {
            var name = value.get('name');
            return name.get('last') + ', ' + name.get('first');
        }

        ,removeSelection : function() {
            this.getSelection().forEach(function(contact) {
                this.__store.remove(contact);
            }, this);
            this.__store.refresh();
        }

        ,__removeSuccess : function() {
            dialog.Dialog.alert(this.tr('Successfully removed'));
            this.refresh();
        }

        ,__removeError : function() {
            dialog.Dialog.alert(this.tr('Error while removing contact'));
            this.refresh();
        }

        ,__listSuccess : function() {
            this.fireEvent('listloaded');
        }

        ,__listError : function() {
            dialog.Dialog.alert(this.tr('There was an error while loading the list'));
            this.__listSuccess();
        }
    }
});
