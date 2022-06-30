// JavaScript include for web-based scanning.
// Copyright 2011-2015 by Atalasoft, a Kofax Company.
// All rights reserved.

Atalasoft.Controls.Capture.WebTwain.LocalFileApi = (function ($) {
    'use strict';

    // dependencies
    var logger = Atalasoft.Logger,
        service = Atalasoft.Controls.Capture.WebTwain.Service,
    // private fields
        fileUrl,
        splitFileUrl,
        filesCollectionUrl;

    // define ctor
    function ctor(session) {
        fileUrl = session.file;
        filesCollectionUrl = session.files;
        splitFileUrl = session.splitFile;
    }

    // private methods
    function createGenericErrorHandler(deferredResult) {
        return function (jqXhr, textStatus, errorThrown) {
            deferredResult.reject();
            logger.warn("Status: %s, Error: %s", textStatus, errorThrown);
        };
    }

    function asBase64String(fid, fmt, opt, async) {
        var result = $.Deferred();
        logger.scope('LocalFile.asBase64String(' + fid + ',' + fmt + ',' + opt + ')', function body() {
            if (fileUrl && fid) {
                var parameters = {
                    format: fmt,
                    jpegCompression: opt ? opt.jpegCompression : undefined,
                    quality: opt ? opt.quality : undefined
                };

                service.get(fileUrl + '/' + fid, parameters, async)
                    .done(function (response) { result.resolve(response); })
                    .fail(createGenericErrorHandler(result));
            } else {
                result.reject();
            }
        });
        return result;
    }

    function fromBase64String(base64, async) {
        var result = $.Deferred();
        logger.scope('LocalFile.fromBase64String()', function body() {
            logger.debug('Base64 string: %s', base64);
            if (filesCollectionUrl && base64) {
                service.post(filesCollectionUrl, { base64: base64 }, async)
                    .done(function (response) { result.resolve(response.id); })
                    .fail(createGenericErrorHandler(result));
            } else {
                result.reject();
            }
        });
        return result;
    }

    function splitToFiles(fid, parameters) {
        var result = $.Deferred();
        logger.scope('LocalFile.splitToChunkFiles(' + fid + ')', function () {
            if (splitFileUrl && fid) {
                parameters = parameters || {};

                service.post(splitFileUrl + '/' + fid, parameters, true)
                    .done(function (response) { result.resolve(response); })
                    .fail(createGenericErrorHandler(result));
            } else {
                result.reject();
            }
        });

        return result;
    }

    function list(async) {
        var result = $.Deferred();
        logger.scope('LocalFile.list()', function body() {
            if (filesCollectionUrl) {
                service.get(filesCollectionUrl, {}, async)
                    .done(function (response) { result.resolve(response); })
                    .fail(createGenericErrorHandler(result));
            } else {
                result.reject();
            }
        });
        return result;
    }

    function remove(fid, async) {
        var result = $.Deferred();
        logger.scope('LocalFile.remove(' + fid + ')', function body() {
            if (fileUrl && fid) {
                service.del(fileUrl + '/' + fid, {}, async)
                    .done(function () { result.resolve(true); })
                    .fail(createGenericErrorHandler(result));
            } else {
                result.reject();
            }
        });
        return result;
    }

    function removeAll(async) {
        var result = $.Deferred();
        logger.scope('LocalFile.removeAll()', function body() {
            if (filesCollectionUrl) {
                service.del(filesCollectionUrl, {}, async)
                    .done(function () { result.resolve(true); })
                    .fail(createGenericErrorHandler(result));

            } else {
                result.reject();
            }
        });
        return result;
    }

    function globalPurgeByAge(hours, async) {
        var result = $.Deferred();
        logger.scope('LocalFile.globalPurgeByAge(' + hours + ')', function body() {
            if (filesCollectionUrl) {
                service.del(filesCollectionUrl+'?age=' + hours, { }, async)
                    .done(function () { result.resolve(true); })
                    .fail(createGenericErrorHandler(result));
            } else {
                result.reject();
            }
        });

        return result;
    }

    function genericSyncFunction(deferredAction, defaultValue) {
        var result = defaultValue === undefined ? undefined : defaultValue;
        deferredAction.done(function (data) { result = data; });
        return result;
    }

    function genericAsyncFunction(deferredAction, callback, defaultValue) {
        deferredAction
            .done(function (result) { callback(result); })
            .fail(function () { callback(defaultValue); });
    }

    // Synchronous APIs - supported only in IE > 9, Chrome and Firefox
    var syncApi = {
        asBase64String: function (fid, fmt, opt) {
            return genericSyncFunction(asBase64String(fid, fmt, opt, false), '');
        },

        fromBase64String: function (base64) {
            return genericSyncFunction(fromBase64String(base64, false));
        },

        list: function () {
            return genericSyncFunction(list(false));
        },

        remove: function (fid) {
            return genericSyncFunction(remove(fid, false), false);
        },

        removeAll: function () {
            return genericSyncFunction(removeAll(false), false);
        },

        globalPurgeByAge: function (hours) {
            return genericSyncFunction(globalPurgeByAge(hours, false), false);
        }
    };

    // Asynchronous APIs - supported in all browsers
    var asyncApi = {
        asBase64StringAsync: function (callback, fid, fmt, opt) {
            genericAsyncFunction(asBase64String(fid, fmt, opt, true), callback, '');
        },

        fromBase64StringAsync: function (base64, callback) {
            genericAsyncFunction(fromBase64String(base64, true), callback);
        },

        listAsync: function (callback) {
            genericAsyncFunction(list(true), callback);
        },

        removeAsync: function (fid, callback) {
            genericAsyncFunction(remove(fid, true), callback, false);
        },

        removeAllAsync: function (callback) {
            genericAsyncFunction(removeAll(true), callback, false);
        },

        globalPurgeByAgeAsync: function (hours, callback) {
            genericAsyncFunction(globalPurgeByAge(hours, true), callback, false);
        },

        splitToFiles: function (callback, fid, parameters) {
            genericAsyncFunction(splitToFiles(fid, parameters), callback);
        } 
    };

    // public Local File API
    ctor.prototype = $.extend({}, syncApi, asyncApi);
    return ctor;
}(jQuery));