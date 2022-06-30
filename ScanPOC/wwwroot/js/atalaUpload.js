// JavaScript include for web-based scanning.
// Copyright 2011-2015 by Atalasoft, a Kofax Company.
// All rights reserved.

(function ($) {

    Atalasoft.Controls.Capture.Uploader = function (url, callbackFunction, params) {
        // this makes sure that you always call this function via new as intended
        if (!(this instanceof arguments.callee))
            throw new Error('Constructor called as a function');

        var that = this;
        var urlCall = url;

        this.callback = callbackFunction || function () { };
        this.updating = false;

        // Use the caller-supplied timeout (in seconds), default to 50s:
        // (timeout is in ms)
        this.timeout = (Number(params.serverTimeout) || 50) * 1000;

        this.abort = function () {
            if (that.updating) {
                that.updating = false;
                that.xhr.abort();
                if (that._serverTimeoutToken) {
                    clearTimeout(that._serverTimeoutToken);
                    delete that._serverTimeoutToken;
                }
                that.xhr = null;
            }
        };

        this.__onTimeout = function () {
            // abort the upload
            that.abort();
            if (that.onTimeout) {
                that.onTimeout();
            }
        };

        this.send = function (postData) {
            if (that.updating) {
                return false;
            }
            that.xhr = null;
            if (window.XMLHttpRequest) {
                that.xhr = new XMLHttpRequest();
            } else {
                that.xhr = new ActiveXObject('Microsoft.XMLHTTP');
            }
            if (that.xhr === null) {
                Atalasoft.Controls.Capture.Errors.report(params.onUploadError, Atalasoft.Controls.Capture.Errors.ajax);
                return false;
            } else {
                that.xhr.onreadystatechange = function () {
                    if (that.xhr.readyState == 4) {
                        that.updating = false;
                        if (that._serverTimeoutToken) {
                            // cancel timeout timer
                            clearTimeout(that._serverTimeoutToken);
                            delete that._serverTimeoutToken;
                        }
                        try {
                            that.callback(that.xhr.responseText, that.xhr.status, that.xhr.responseXML);
                        } catch (e) {
                            // If an XMLHttpRequest is aborted, none of the properties (except readyState)
                            // can be read. Attempting to read them generates Script error c00c023f
                        }
                        that.xhr = null;
                    }
                };
                that.updating = new Date();
                var uri = urlCall + '?' + that.updating.getTime();
                that.xhr.open('POST', uri, true);
                that.xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + that.boundaryString);
                // 2015.01.21 spike - commented out, just generates a quiet console error from Chrome.
                //that.xhr.setRequestHeader('Content-Length', postData.length);
                if (that.onTimeout) {
                    // Caller requested a timeout callback.
                    that._serverTimeoutToken = setTimeout(that.__onTimeout, that.timeout);
                }
                that.xhr.send(postData);
                return true;
            }
        };
    };

    Atalasoft.Controls.Capture.UploadToCaptureServer = {

        _params: {},

        // 2017.13.04 DLegashov - removed '=' symbol since it causing internal error in the ASP.NET Core parser
        // and it can't properly handle upload request.
        boundaryString: 'AaBbCc_X30',
        dash_boundary: '--AaBbCc_X30',
        
        initialize: function (params) {
            this._params = params;
            this.__bindEvents(true);
        },

        isInitialized: function () {
            return this._params && this._params.handlerUrl;
        },

        dispose: function() {
            this.__bindEvents(false);
            this._params = {};
        },

        /**
         * Binds events to callbacks provided by client.
         * @param isBind attaches event handlers if true; otherwise detaches.
         */
        __bindEvents: function (isBind) {
            var evtObj = this._params.eventBindObject,
                fn = isBind ? evtObj.bind : evtObj.unbind;
            if (this._params.onUploadStarted) {
                fn.call(evtObj, 'onUploadStarted', isBind ? {} : this._params.onUploadStarted, this._params.onUploadStarted);
            }
            if (this._params.onUploadCompleted) {
                fn.call(evtObj, 'onUploadCompleted', isBind ? {} : this._params.onUploadCompleted, this._params.onUploadCompleted);
            }
        },

        getUploadCallback: function () {
            return function (data, options) {
                Atalasoft.Controls.Capture.UploadToCaptureServer.uploadToServer(data, options);
            };
        },

        __extensionFromBase64String: function (data) {
            switch (data.substr(0, 5)) {        // check leading 4 bytes
                case 'JVBER': return 'pdf';    //  % P D F
                case '/9j/4': return 'jpg';    // FF D8 Ff E0
                case 'R0lGO': return 'gif';    // G I F 8
                case 'iVBOR': return 'png';    // 89 50 4E 47
                case 'TU0AK': return 'tif';    // 4d 4d 00 2a (MM.*)
                case 'SUkqA': return 'tif';    // 49 49 2a 00 (II*.)
                default: break;
            }
            if (data.substr(0, 2) == "Qk") {
                return 'bmp';                   // B  M  
            }
            return 'bin';                       // some unknown, presumably binary format
        },


        uploadToServer: function (data, options) {
            this._params.eventBindObject.trigger('onUploadStarted', {});
            var ext = this.__extensionFromBase64String(data);
            var mimeType = {
                bmp: 'image/bmp',
                gif: 'image/gif',
                jpg: 'image/jpeg',
                pdf: 'application/pdf',
                png: 'image/png',
                tif: 'image/tiff',
                bin: 'application/octet-stream'
            }[ext];

            var delimiter = '\r\n' + this.dash_boundary + '\r\n';
            if (!options) {
                options = this._params.uploadOptions || {};
            }
            var extra_parts = '';
            // Adding this for the sharepoint control. 
            if (typeof this._params.uploadLocation === 'string' && this._params.uploadLocation.length !== 0) {
                extra_parts += delimiter +
                'Content-Disposition: form-data; name="uploadLocation"\r\n\r\n' +
                this._params.uploadLocation;
            }
            // Append any key-value pairs provided by client app
            if (options.formData) {
                for (var key in options.formData) {
                    if (options.formData.hasOwnProperty(key)) {
                        extra_parts += delimiter +
                        'Content-Disposition: form-data; name="' + key + '"\r\n\r\n' +
                        this.__encodePartValue(options.formData[key]);
                    }
                }
            }
            // Append any extra MIME parts provided by client app
            if (options.extraParts) {
                var parts = options.extraParts;
                var i;
                for (i = 0; i < parts.length; i++) {
                    extra_parts += delimiter + parts[i];
                }
            }

            // Create a customized XmlHttp object
            // We provide the target URL, and our internal completion-handler
            var me = this;
            var uploader = new Atalasoft.Controls.Capture.Uploader(
            this._params.handlerUrl,
            function (txt, stat, xml) { me.__onPostCompleted(txt, stat); },
            this._params
            );

            uploader.boundary = this.dash_boundary;
            uploader.boundaryString = this.boundaryString;

            // Synthesize the content of the upload, a multipart form body.
            // see http://en.wikipedia.org/wiki/MIME
            // RFC 2388 http://www.rfc-editor.org/rfc/rfc2388.txt
            // RFC 2046 (MIME Part 2) http://tools.ietf.org/html/rfc2046
            // RFC 2047 (MIME Part 3) http://tools.ietf.org/html/rfc2047
            //
            var postContent = delimiter.concat(
            // contentDescription part
          'Content-Disposition: form-data; name="contentDescription"\r\n' +
            // Note: default Content-Type is text/plain
            // For plain/text the default charset=us-ascii
            // The default Content-transfer-encoding is null, equivalently '7bit', '8bit', or 'binary'.
            // If the content is not known to be 7-bit us-ascii, it should be encoded quoted-printable or base64.
          '\r\n' +
          'uploaded-document' +
          extra_parts +
          delimiter +
            // uploaded data part
          'Content-Disposition: form-data; name="file"; filename="document.' + ext + '"\r\n' +
          'Content-Type: ' + mimeType + '\r\n' +
          'Content-transfer-encoding: base64\r\n' +
          '\r\n',
          data,
          '\r\n' + this.dash_boundary + '--\r\n');

            // Set a watchdog timer
            uploader.onTimeout = function () {
                Atalasoft.Controls.Capture.Errors.report(
        me._params.onUploadError,
        Atalasoft.Controls.Capture.Errors.serverNotResponding,
            { handlerUrl: me._params.handlerUrl, timeout: uploader.timeout }
        );
                me._params.eventBindObject.trigger('onUploadCompleted', {
                    success: false,
                    responseStatus: 598, response: Atalasoft.Controls.Capture.Errors.serverNotResponding
                });
            };

            // Start the upload:
            uploader.send(postContent);
            // Note: returns false if unable to start upload, but we ignore.
        },

        // called while constructing an upload multipart/form, to convert the value of a
        // key=value part into a string
        __encodePartValue: function (val) {
            if (typeof val === 'string' || typeof val === 'number') {
                return val;
            } else {
                return JSON.stringify(val);
            }
        },

        // This function is called by the ajaxUploader when we have received
        // the response from the server-side.
        __onPostCompleted: function (responseTextMsg, responseStatusMsg) {

            var responseObject;
            try {
                responseObject = $.parseJSON(responseTextMsg);
            } catch (ex) {
                responseObject = "parseJSON: " + ex.message;
            }

            if (responseStatusMsg == 200) {
                this._params.eventBindObject.trigger('onUploadCompleted', {
                    success: true,
                    documentFilename: responseObject.filename, response: responseObject
                });
            } else {
                Atalasoft.Controls.Capture.Errors.report(
                this._params.onUploadError,
                Atalasoft.Controls.Capture.Errors.uploadError,
                { responseStatus: responseStatusMsg, response: responseObject, handlerUrl: this._params.handlerUrl }
            );
                this._params.eventBindObject.trigger('onUploadCompleted', {
                    success: false,
                    responseStatus: responseStatusMsg, response: responseObject
                });
            }
        }
    };

}(jQuery));
