// JavaScript include for web-based scanning.
// Copyright 2011-2015 by Atalasoft, a Kofax Company.
// All rights reserved.

Atalasoft.Controls.Capture.WebTwain.Service = (function ($) {
    'use strict';

    var limited = false,
        deferredCallbacks = {},
        logger = Atalasoft.Logger;

    function createUuid() {
        var d = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
    }

    function logRequest(verb, url, data) {
        logger.scope(verb, url, function () {
            logger.log('Body: ').object(data);
        });
    }

    function setLimitedMode(limitedMode) {
        logger.log('Setting limited mode: ', limitedMode);
        limited = limitedMode === undefined ? false : limitedMode;
    }

    function isLimitedMode() {
        return limited;
    }
        
    function get(url, data, async) {
        logRequest('GET', url, data);
        return $.ajax({
            url: url,
            cache: false,
            data: data,
            type: 'GET',
            async: (async === undefined ? true : async) || limited,
            global: false
        });
    }

    function post(url, data, async) {
        logRequest('POST', url, data);
        return $.ajax({
            url: url,
            cache: false,
            data: JSON.stringify(data || {}),
            contentType: 'application/json',
            dataType: 'json',
            type: 'POST',
            async: (async === undefined ? true : async) || limited,
            global: false
        });
    }

    function put(url, data, async) {
        var verb = limited ? 'POST' : 'PUT',
            requestUrl = limited ? url + '?debugMethod=PUT' : url;

        logRequest(verb, requestUrl, data);
        return $.ajax({
            url: requestUrl,
            cache: false,
            data: JSON.stringify(data || {}),
            contentType: 'application/json',
            dataType: 'json',
            type: verb,
            async: (async === undefined ? true : async) || limited,
            global: false
        });
    }

    function del(url, data, async) {
        var verb = limited ? 'POST' : 'DELETE',
            requestUrl = limited ? url + '?debugMethod=DELETE' : url;

        logRequest(verb, requestUrl, data);
        return $.ajax({
            url: requestUrl,
            cache: false,
            data: JSON.stringify(data || {}),
            type: verb,
            async: async || limited,
            global: false
        });
    }

    function poll(url, success, error) {
        /*jshint validthis:true */
        var me = this;
        $.ajax({
            url: url,
            type: 'POST',
            cache: false,
            dataType: "text",
            timeout: 30000,
            global: false,
            success: function (response) {
                response = response ? JSON.parse(response) : {};
                if (success(response)) {
                    me.poll(url, success, error);
                }
            },
            error: function (response) {
                if (error(response)) {
                    setTimeout(function () { me.poll(url, success, error); }, 1000);
                }
            }
        });
    }

    function callDeferred(requestFunction, url, data, callback) {
        var id = createUuid();
        data = data || {};
        data.callbackId = id;
        return requestFunction(url, data)
            .done(function () {
                deferredCallbacks[id] = callback;
            });
    }

    function executeDeferredCallback(id) {
        /*jshint validthis:true */
        if (deferredCallbacks[id]) {
            var args = Array.prototype.slice.call(arguments, 1);
            deferredCallbacks[id].apply(this, args);
            delete deferredCallbacks[id];
        }
    }

    function releaseDeffered() {
        deferredCallbacks = {};
    }

    function beacon (url, data) {
        var result = $.Deferred();
        if (navigator.sendBeacon(url, data)){
            result.resolve();
        } else {
            result.reject();
        }
        return result;
    }

    return {
        get: get,
        post: post,
        put: put,
        del: del,
        poll: poll,
        callDeferred: callDeferred,
        executeDeferredCallback: executeDeferredCallback,
        releaseDeffered: releaseDeffered,
        setLimitedMode: setLimitedMode,
        isLimitedMode: isLimitedMode,
        beacon: beacon
    };
}(jQuery));