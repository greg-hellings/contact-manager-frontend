qx.Class.define('qxcm.Store', {
    extend : qx.data.controller.List,

    construct : function() {
        var single = '/contacts/{id}',
        description = {
            'list' : {
                method : 'GET',
                url    : '/contacts/'
            },
            'get' : {
                method : 'GET',
                url    : single
            },
            'create' : {
                method : 'POST',
                url    : '/contacts/'
            },
            'update' : {
                method : 'PUT',
                url    : single
            },
            'remove' : {
                method : 'DELETE',
                url    : single
            }
        },
        restResource = new qx.io.rest.Resource(description),
        restStore    = new qx.data.store.Rest(restResource, 'list');

        restResource.list();

        restStore.bind('model', this, 'model');          // When data comes in, it will be populated here
        this     .bind('model', restStore, 'model');  // When the data is changed, it will propagate back
        this.base(arguments);
    }
});
