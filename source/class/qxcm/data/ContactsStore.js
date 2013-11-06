qx.Class.define('qxcm.data.ContactsStore', {
    extend : qx.data.store.Rest
    ,type  : 'singleton'

    ,construct : function() {
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
        this.restResource = new qx.io.rest.Resource(description);

        this.restResource.addListener('listSuccess', this.__listener, this);
        this.restResource.addListener('listError',   this.__listener, this);
        this.restResource.addListener('removeSuccess', this.__listener, this);
        this.restResource.addListener('removeError',   this.__listener, this);
        this.restResource.addListener('updateSuccess', this.__listener, this);
        this.restResource.addListener('updateError',   this.__listener, this);
        this.restResource.addListener('createSuccess', this.__listener, this);
        this.restResource.addListener('createError',   this.__listener, this);

        this.restResource.list();

        this.base(arguments, this.restResource, 'list', {manipulateData : this.__convertToStrings});
    }

    ,events : {
         'listError'    : 'qx.event.type.Event'
        ,'listSuccess'  : 'qx.event.type.Event'
        ,'removeError'  : 'qx.event.type.Event'
        ,'removeSuccess': 'qx.event.type.Event'
        ,'updateError'  : 'qx.event.type.Event'
        ,'updateSuccess': 'qx.event.type.Event'
        ,'createError'  : 'qx.event.type.Event'
        ,'createSuccess': 'qx.event.type.Event'
    }

    ,members : {
        refresh : function() {
            this.restResource.list();
        }
        
        ,remove : function(data) {
            this.__call('remove', data);
        }

        ,save : function(model) {
            var isCreate = this.getModel().indexOf(model) < 0;
            if (isCreate) {
                this.__call('create', model);
            } else {
                this.__call('update', model);
            }
        }

        ,__call : function(method, data) {
            this.restResource.configureRequest(function(request) {
                request.setRequestHeader('Content-Type', 'application/json');
            });
            if (qx.lang.Type.isArray(data)) {
                data.forEach(function(contact) {
                    this.getModel().remove(contact);
                    this.__invokeRest(method, contact);
                }, this);
            } else {
                this.getModel().remove(data);
                this.__invokeRest(method, data);
            }
        }

        ,__invokeRest : function(method, data) {
            if ('get_id' in data) {
                this.restResource[method]({_id : data.get_id()}, qx.util.Serializer.toNativeObject(data));
            } else {
                this.restResource[method](null, qx.util.Serializer.toNativeObject(data));
            }
        }

        // Converts all-number fields to strings for safe handling
        // Normalizes the entries which have string-only names
        ,__convertToStrings : function(data) {
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
        }

        ,__listener : function(event) {
            var result = event.getData();
            if (!result || result.success == false) {
                this.fireEvent(event.getAction() + 'Error');
            } else {
                this.fireEvent(event.getAction() + 'Success');
            }
        }
    }
});
