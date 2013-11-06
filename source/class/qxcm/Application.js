/* ************************************************************************

   Copyright: (c) 2013 Greg Hellings

   License: Public Domain

   Authors: Greg Hellings (greg.hellings@gmail.com)

************************************************************************ */

/*
 * TODO:
 * - Confirmation message after successful network event
 * - Mobile UI
 * - Factor out backend communications into helper classes for later use
 * - Proper scrolling after delete when at bottom of list
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

      // Insert the UI
      var doc  = this.getRoot(),
          list = new qxcm.screens.List();

      doc.add(list, {left : 100, top: 50});

      // Behavior
      list.addListener('edit',   this.__edit,   this);
      list.addListener('create', this.__create, this);
    }

    ,__edit : function(event) {
        var modal  = new qxcm.screens.EditorModal(this.tr('Edit Contact'), event.getData());
    },

    __create : function() {
        var modal = new qxcm.screens.EditorModal(this.tr('Create new contact'));
    }
  }
});
