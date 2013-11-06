qx.Class.define('qxcm.Store', {
    extend : qx.data.controller.List,

    construct : function() {
        var single = '/contacts/{_id}',
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
        };
        this.restResource = new qx.io.rest.Resource(description),
        this.restStore    = new qx.data.store.Rest(this.restResource, 'list', {manipulateData : this.__convertToStrings});

        this.restResource.addListener('listSuccess', this.__listListener, this);
        this.restResource.addListener('listError',   this.__listListener, this);

        this.restResource.list();

        this.restStore.bind('model', this, 'model');          // When data comes in, it will be populated here
        this          .bind('model', this.restStore, 'model');  // When the data is changed, it will propagate back
        this.base(arguments);
    },

    events : {
        'listfail' : 'qx.event.type.Event'
    },

    members : {
        // Converts all-number fields to strings for safe handling
        // Normalizes the entries which have string-only names
        __convertToStrings : function(data) {
            return 'map' in data ? data.map(function(value, index, array) {
                var output = value;

                if (qx.lang.Type.isString(value.name)) {
                    output.name = { first : value.name, last : '' };
                }

                output.phone        = {
                    home   : value.phone && value.phone.home   ? qx.data.Conversion.toString(value.phone.home)   : '',
                    mobile : value.phone && value.phone.mobile ? qx.data.Conversion.toString(value.phone.mobile) : ''
                };
                output.address      = value.address || {};
                output.address.zip  = output.address ? qx.data.Conversion.toString( value.address.zip ) : '';

                return output;
            }) : 
            [];
        },

        save : function(selection) {
            this.__call('update', selection);
            this.getTarget().refresh();
        },

        add : function(contact) {
            this.getModel().push(contact);
            this.__call('create', contact);
            this.getTarget().refresh();
        },

        remove : function(contact) {
            this.getModel().remove(contact);
            this.__call('remove', contact);
            this.getTarget().refresh();
        },

        __call : function(method, data) {
            this.restResource.configureRequest(function(request) {
                request.setRequestHeader('Content-Type', 'application/json');
            });
            if (qx.lang.Type.isArray(data)) {
                data.forEach(function(contact) {
                    this.__invokeRest(method, contact);
                }, this);
            } else {
                this.__invokeRest(method, data);
            }
        },

        __invokeRest : function(method, data) {
            if ('get_id' in data) {
                this.restResource[method]({_id : data.get_id()}, qx.util.Serializer.toNativeObject(data));
            } else {
                this.restResource[method](null, qx.util.Serializer.toNativeObject(data));
            }
        },

        __listListener : function(event) {
            var result = event.getData();
            if (result && result.success == false) {
                this.fireEvent('listfail');
            }
        }
    }
});
