qx.Class.define('qxcm.screens.List', {
    extend : qx.ui.container.Composite

    ,construct : function() {
        var list,
            create,
            remove,
            refresh,
            listController;
        // Create the UI
        list = new qx.ui.form.List();
        list.setWidth(270);
        list.setHeight(200);
        create = new qx.ui.form.Button(this.tr('Create'));
        create.setWidth(75);
        remove = new qx.ui.form.Button(this.tr('Remove'));
        remove.setWidth(75);
        refresh= new qx.ui.form.Button(this.tr('Refresh'));
        refresh.setWidth(75);

        this.base(arguments, new qx.ui.layout.Canvas());

        this.add(list, {left: 0, top: 0});
        this.add(create, {left: 0, top: 205});
        this.add(remove, {left: 80, top: 205});
        this.add(refresh, {left: 160, top: 205});

        this.__listController = new qxcm.screens.list.ListController(list);

        this.__listBlocker    = new qx.ui.core.Blocker(list);
        this.__listBlocker.setOpacity(0.25);
        this.__listBlocker.setColor('black');

        // Listeners
        refresh.addListener('execute', this.__refreshList, this);
        remove .addListener('execute', this.__removeItem,  this);
        create .addListener('execute', this.__create,      this);
        list   .addListener('execute', this.__edit,        this);
        this.__listController.addListener('listloaded', this.unblock, this);
    }

    ,events : {
        'create' : 'qx.event.type.Event'
        ,'edit'  : 'qx.event.type.Data'
    }

    ,members : {
        __listController : null

        ,unblock : function() {
            this.__listBlocker.unblock();
        }

        ,__refreshList : function() {
            this.__listBlocker.block();
            this.__listController.refresh();
        }

        ,__removeItem : function() {
            this.__listBlocker.block();
            dialog.Dialog.confirm(this.tr('Are you sure you wish to delete this contact?'), function(confirmed) {
                if (confirmed) {
                    this.__listController.removeSelection();
                }
            }, this);
        }

        ,__create : function() {
            this.fireEvent('create');
        }

        ,__edit : function() {
            this.fireDataEvent('edit', this.__listController.getSelection().getItem(0));
        }
    }
});
