qx.Class.define('qxcm.data.ContactsStore', {
    extend : qx.data.store.Rest

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

        this.restResource.addListener('listSuccess', this.__listListener, this);
        this.restResource.addListener('listError',   this.__listListener, this);
        this.restResource.addListener('removeSuccess', this.__removeListener, this);
        this.restResource.addListener('removeError',   this.__removeListener, this);

        this.restResource.list();

        this.base(arguments, this.restResource, 'list', {manipulateData : this.__convertToStrings});
    }

    ,events : {
         'listError'    : 'qx.event.type.Event'
        ,'listSuccess'  : 'qx.event.type.Event'
        ,'removeError'  : 'qx.event.type.Event'
        ,'removeSuccess': 'qx.event.type.Event'
    }

    ,members : {
        refresh : function() {
            this.restResource.list();
        }
        
        ,remove : function(data) {
            this.__call('remove', data);
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

        ,__listListener : function(event) {
            var result = event.getData();
            if (!result || result.success == false) {
                this.fireEvent('listError');
            } else {
                this.fireEvent('listSuccess');
            }
        }

        ,__removeListener : function(event) {
            var result = event.getData();
            if (!result || result.success == false) {
                this.fireEvent('removeError');
            } else {
                this.fireEvent('removeSuccess');
            }
        }
    }
});
