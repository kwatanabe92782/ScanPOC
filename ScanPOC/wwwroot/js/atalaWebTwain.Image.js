// JavaScript include for web-based scanning.
// Copyright 2011-2014 by Atalasoft, a Kofax Company.
// All rights reserved.

Atalasoft.Controls.Capture.WebTwain.Image = (function ($) {
    'use strict';

    // dependencies
    var logger = Atalasoft.Logger,
        service = Atalasoft.Controls.Capture.WebTwain.Service;
        
    var updateFields = function (data) {             
        // PatchCode
        this.patchCode = data.patchCode || '';
        /* obsolete */ this.PatchCode = this.patchCode;

        // Barcodes
        this.barcodes = data.barcodes || [];
        /* obsolete */ this.Barcodes = this.barcodes;

        // ImprintedText
        this.imprintedText = data.imprintedText || '';
        /* obsolete */ this.ImprintedText = this.imprintedText;

        /* obsolete */ this.Filename = data.filename;
      
        this.localFile = data.localFile || '';
        this.localFileChunks = data.localFileChunks;

        this.originalImage = data.originalImage;
        this.discard = false;

        // false for images, true for PDFs and other eDocs
        this.eDoc = data.eDoc;
        this.path = data.path;
        
        if (!data.eDoc) {
            this.bitsPerPixel = data.bitsPerPixel || -1;
            /* obsolete */ this.BitsPerPixel = this.bitsPerPixel;

            this.pixelType = data.pixelType || -1;
            /* obsolete */ this.PixelType = this.pixelType;

            this.width = data.width || 0;
            /* obsolete */ this.Width = this.width;

            this.height = data.height || 0;
            /* obsolete */ this.Height = this.height;

            this.xdpi = data.xdpi || -1;
            /* obsolete */ this.XResolution = this.xdpi;

            this.ydpi = data.ydpi || -1;
            /* obsolete */ this.YResolution = this.ydpi;

            this.dpi = [this.xdpi, this.ydpi];

            /* obsolete */ this.PageSide = data.pageSide;
            if ('front' in data) {
                this.front = data.front;
            }
            
            /* obsolete */ this.SheetNo = data.sheetNo;
            if ('sheetNo' in data) {
                this.sheetNo = data.sheetNo;
            }
            
            if ('newSheet' in data) {
                this.newSheet = data.newSheet;
            }
        }
        else {
            // [obsolete] migrated from old code - if filename exist, we deal with image backed with pdf file.
            this.filename = this.Filename = data.filename;
        }
    };

    function createGenericErrorHandler(deferredResult) {
        return function (jqXhr, textStatus, errorThrown) {
            deferredResult.reject();
            logger.warn('Status:', textStatus, 'Error:', errorThrown);
        };
    }

    function asBase64StringImpl(fmt, opts, async) {
        var result = $.Deferred();
        /*jshint validthis:true */
        var that = this;
        logger.scope('Image.asBase64String', fmt, function () {
            logger.info('Options:').object(opts);

            if (that.id && that.selfUrl) {
                var parameters = {
                    jpegCompression: opts ? opts.jpegCompression : undefined,
                    quality: opts ? opts.quality : undefined,
                    format: fmt,
                    width: that.width,
                    height: that.height
                };

                service.get(that.selfUrl, parameters, async)
                    .done(function (responseImage) {
                        that.updateData(responseImage);
                        result.resolve(responseImage.base64);
                    })
                    .fail(createGenericErrorHandler(result));
            } else {
                logger.warn('attempting to call asBase64String on empty object.');
                result.reject();
            }
        });

        return result;
    }

    function saveEncryptedLocalImpl(fmt, opts, async) {
        var result = $.Deferred();
        /*jshint validthis:true */
        var that = this;
        logger.scope('Image.saveEncryptedLocal', fmt, function () {
            logger.info('Options:').object(opts);

            if (that.id && that.selfUrl) {
                var parameters = {
                    format: fmt,
                    jpegCompression: opts ? opts.jpegCompression : undefined,
                    quality: opts ? opts.quality : undefined,
                    width: that.width,
                    height: that.height
                };

                service.put(that.selfUrl, parameters, async)
                    .done(function (response) {
                        that.localFile = response.id;
                        result.resolve(response.id);
                    })
                    .fail(createGenericErrorHandler(result));
            } else {
                logger.warn('attempting to call saveEncryptedLocal on empty object.');
                result.reject();
            }
        });

        return result;
    }

    // TODO: remove copy-paste! 
    function genericSyncFunction(deferredAction, defaultValue) {
        var result = defaultValue || null;
        deferredAction.done(function (data) { result = data; });
        return result;
    }

    function genericAsyncFunction(deferredAction, callback) {
        /*jshint validthis:true */
        var that = this;
        deferredAction
            .done(function (result) { callback.call(that, result); })
            .fail(function () { callback.call(that); });
    }

    // Synchronous APIs - supported only in IE > 9, Chrome and Firefox
    var syncApi = {
        asBase64String: function (fmt, opts) {
            return genericSyncFunction.call(this, asBase64StringImpl.call(this, fmt, opts, false));
        },

        saveEncryptedLocal: function (fmt, opts) {
            return genericSyncFunction.call(this, saveEncryptedLocalImpl.call(this, fmt, opts, false));
        }
    };

    // Asynchronous APIs - supported in all browsers
    var asyncApi = {
        asBase64String: function (callback, fmt, opts) {
            genericAsyncFunction.call(this, asBase64StringImpl.call(this, fmt, opts, true), callback);
        },

        saveEncryptedLocal: function (callback, fmt, opts) {
            genericAsyncFunction.call(this, saveEncryptedLocalImpl.call(this, fmt, opts, true), callback);
        }
    };

    // define ctor
    var ctor = function (session, imgId, data) {
        this.id = imgId;
        data = data || {};

        updateFields.call(this, data);
        this.thumbnailData = new Atalasoft.Controls.Capture.WebTwain.Thumb(this.id, $.extend(true, data.thumbnailData, { thumb: data.thumb }));

        // URL templates
        this.selfUrl = data.self;
        this.alternatives = data.alternatives;
        this.thumbUrl = data.thumb;
    };

    ctor.prototype = {
        updateData: function (imageData) {
            updateFields.call(this, imageData);
        },

        //documented functions
        asBase64String: function asBase64String() {
            var args = Array.prototype.slice.call(arguments),
                callback = args.slice(-1).pop();

            if (typeof callback === 'function') {
                args.unshift(args.pop());
                asyncApi.asBase64String.apply(this, args);
            } else {
                return syncApi.asBase64String.apply(this, args);
            }
        },
        
        saveEncryptedLocal: function saveEncryptedLocal() {
            var args = Array.prototype.slice.call(arguments),
                callback = args.slice(-1).pop();

            if (typeof callback === 'function') {
                args.unshift(args.pop());
                asyncApi.saveEncryptedLocal.apply(this, args);
            } else {
                return syncApi.saveEncryptedLocal.apply(this, args);
            }
        },

        // returning precomputed thumbnail or local proxy here.
        thumbnail: function (w, h) {
            if (!this.thumbnailData || this.thumbnailData.requestedWidth !== w || this.thumbnailData.requestedHeight !== h) {
                this.thumbnailData = new Atalasoft.Controls.Capture.WebTwain.Thumb(this.id, {
                    thumb: this.thumbUrl,
                    width: w,
                    height: h,
                    requestedWidth: w,
                    requestedHeight: h
                });
            }
            
            return this.thumbnailData;
        },

        // TODO: need to retry on failure?
        clear: function clear() {
            if (this.id && this.selfUrl) {
                return service.del(this.selfUrl, {}, true)
                    .done(function () {
                        this.selfUrl = null;
                        this.alternativesUrl = null;
                        this.id = null;
                    });
            }
        },

        // obsolete methods (should be there for backward compatibility)
        AsBase64String: function AsBase64String() {
            logger.deprecate('AsBase64String', 'asBase64String');
            return this.asBase64String.apply(this, arguments);
        },

        SaveEncryptedLocalFile: function SaveEncryptedLocalFile() {
            logger.deprecate('SaveEncryptedLocalFile', 'saveEncryptedLocal');
            return this.saveEncryptedLocal.apply(this, arguments);
        },

        Thumbnail: function Thumbnail() {
            logger.deprecate('Thumbnail', 'thumbnail');
            return this.thumbnail.apply(this, arguments);
        }
    };

    return ctor;
}(jQuery));