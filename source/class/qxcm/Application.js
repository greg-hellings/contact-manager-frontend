/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

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

      // Create the list
      this.store = new qxcm.Store();
      this.list = new qx.ui.list.List();
      this.list.setWidth(270);
      this.list.setLabelOptions({
        converter : function(value, model) {
            var name = value.get('name');
            if (qx.lang.Type.isString(name)) {
                return name;
            } else {
                return name.get('last') + ', ' + name.get('first');
            }
        }            
      });

      this.store.bind('model', this.list, 'model');

      // Document is the application root
      var doc = this.getRoot();

      // Add button to document at fixed coordinates
      doc.add(this.list, {left: 100, top: 50});

      this.list.addListener('dblclick', this.__onSelectionClick, this);
    }

    ,__onSelectionClick : function() {
        debugger;
    }
  }
});
