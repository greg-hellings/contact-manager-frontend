/* ************************************************************************

   Copyright: (c) 2013 Greg Hellings

   License: Public Domain

   Authors: Greg Hellings (greg.hellings@gmail.com)

************************************************************************ */

/*
 * TODO:
 * - Confirmation message on delete
 * - Confirmation message after successful network event
 * - Masking UI while doing transport
 * - Mobile UI
 * - Factor out backend communications into helper classes for later use
 * - Proper scrolling after delete when at bottom of list
 * - Refresh button
 */

/**
 * This is the main application class of your custom application "app"
 *
 * @asset(qxcm/*)
 */
qx.Class.define("qxcm.Application",
{
  extend : qx.application.Standalone,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     * 
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */

      // Create the UI
      this.store = new qxcm.Store();
      this.list = new qx.ui.list.List();
      this.list.setWidth(270);
      this.list.setHeight(200);
      this.create = new qx.ui.form.Button(this.tr('Create'));
      this.create.setWidth(75);
      this.remove = new qx.ui.form.Button(this.tr('Remove'));
      this.remove.setWidth(75);
      this.refresh= new qx.ui.form.Button(this.tr('Refresh'));
      this.refresh.setWidth(75);

      // Insert the UI
      var doc = this.getRoot();
      doc.add(this.list, {left: 100, top: 50});
      doc.add(this.create, {left: 100, top: 255});
      doc.add(this.remove, {left: 180, top: 255});
      doc.add(this.refresh, {left: 260, top: 255});

      // Loading mask
      this.listBlocker = new qx.ui.core.Blocker(this.list);
      this.listBlocker.setOpacity(.25);
      this.listBlocker.setColor('black');
      this.listBlocker.block();

      // Behavior
      this.list.addListener('dblclick', this.__onSelectionClick, this);
      this.create.addListener('execute', this.__create, this);
      this.remove.addListener('execute', this.__remove, this);
      this.store.addListener('listfail', this.__listFail, this);
      this.refresh.addListener('execute', this.__refresh, this);

      // Data handling
      this.list.setLabelOptions({
        converter : function(value, model) {
            var name = value.get('name');
            return name.get('last') + ', ' + name.get('first');
        }            
      });
      this.store.bind('model', this.list, 'model');
      this.store.addListener('changeModel', this.__unblock, this);

    }

    ,__refresh : function() {
        this.listBlocker.block();
        this.store.restResource.list();
    }

    ,__unblock : function() {
        this.listBlocker.unblock();
    }

    ,__onSelectionClick : function() {
        var form   = new qxcm.Editor(),
            formController = new qx.data.controller.Form(this.list.getSelection().getItem(0), form);

        this.modal = new qxcm.EditorWindow(this.tr('Edit Contact'), form);

        form.addListener('save',   this.save,       this);
    },

    save : function(modal) {
        this.store.save(this.list.getSelection());
        this.modal.close();
    },

    __create : function() {
        var form = new qxcm.Editor(),
            formController = new qx.data.controller.Form(null, form),
            modal = new qxcm.EditorWindow(this.tr('Create new contact'), form);

        formController.createModel();
        form.addListener('save', function() {
            var contact = formController.getModel();
            this.store.add(contact);
            modal.close();
        }, this);
    },

    __remove : function() {
        dialog.Dialog.confirm(this.tr('Confirm'), this.tr('Are you sure you wish to delete this contact?'), function() {
            console.log(arguments);
            /*this.list.getSelection().forEach(function(selected) {
                this.store.remove(selected);
            }, this);*/
        }, this);
    },

    __listFail : function() {
        dialog.Dialog.alert(this.tr('There was an error fetching results from the server.'));
    }
  }
});
