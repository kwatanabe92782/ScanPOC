// JavaScript include for web-based scanning.
// Copyright 2011-2014 by Atalasoft, a Kofax Company.
// All rights reserved.

Atalasoft.Controls.Capture.WebTwain.Thumb = (function () {
    'use strict';

    // private fields
    var imageClass = Atalasoft.Controls.Capture.WebTwain.Image.prototype;

    // define ctor
    var ctor = function (imgId, data) {
        this.id = imgId;
        data = data || {};

        udateFields.call(this, data);
        
        // URL templates
        this.selfUrl = data.thumb;
        this.thumbUrl = data.thumb;
    };

    var udateFields = function (data) {
        imageClass.updateData.call(this, data);
        
        this.base64 = data.base64;

        // for precomputed thumb ror in case if already generated
        this.format = data.format;
        this.jpegCompression = data.jpegCompression;
        this.quality = data.quality;
        this.requestedWidth = data.requestedWidth;
        this.requestedHeight = data.requestedHeight;
    };

    ctor.prototype = {
        updateData: function(image) {
            udateFields.call(this, image);
        },

        //documented functions
        asBase64String: function asBase64String(fmt, opts) {
            var args = Array.prototype.slice.call(arguments),
               callback = args.slice(-1).pop();

            if (typeof callback !== 'function')
                callback = undefined;

            if (this.base64 && this.format === fmt && (!opts || this.jpegCompression === opts.jpegCompression && this.quality == opts.quality)) {
                if (callback)
                    return callback(this.base64);
                else
                    return this.base64;
            }

            return imageClass.asBase64String.apply(this, arguments);
        },

        saveEncryptedLocal: function saveEncryptedLocal() {
            return imageClass.saveEncryptedLocal.apply(this, arguments);
        },

        thumbnail: imageClass.thumbnail,

        clear: function () {
            this.id = null;
            this.selfUrl = null;
            this.thumbUrl = null;
            this.base64 = null;
        }
    };

    return ctor;
}());