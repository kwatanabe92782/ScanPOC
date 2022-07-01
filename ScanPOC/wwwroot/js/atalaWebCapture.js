var Atalasoft =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
﻿/**
 * Logger Module
 * @module Atalasoft/Logger
 * @private
 */



// TODO: support TraceEnabled.

    function createLogger(level, enabled, required) {
        var con = window.console;           
        return function () {
            if (required || enabled) {
                // Note the last condition - IE8 logging is not supported
                // since console.log is internal object there which does 
                // not provide 'apply' method
                if (con && con[level] && (typeof con[level] === 'function')) {
                    con[level].apply(con, arguments);
                }
            }                           
            return module.exports;
        };
    }

    var deprecatedApi = {},
        group = createLogger('group', true),
        groupEnd = createLogger('groupEnd', true),
        time = createLogger('time', true),
        timeEnd = createLogger('timeEnd', true),
        createTimeSequence = (function () {
            var timerId = 0;
            return function () {
                timerId += 1;
                return 'Time Sequence ' + timerId;
            };
        }());

/** Creates a logger object. */
var logger = function CreateLogger() {
    this.TraceEnabled = false;
    var that = this;
    return {
        // we should always report errors and warnings

        /** Write error message. 
          * @function
          * @param message {string} Message to put on the console.
          */
        error: createLogger('error', that.TraceEnabled, true),

        /** Write warning message. 
          * @function
          * @param message {string} Message to put on the console.
          */
        warn: createLogger('warn', that.TraceEnabled, true),

        /** Write generic log message. 
          * @function
          * @param message {string} Message to put on the console.
          */
        log: createLogger('log', that.TraceEnabled),

        /** Write info message. 
          * @function
          * @param message {string} Message to put on the console.
          */
        info: createLogger('info', that.TraceEnabled),

        /** Write object on console. 
          * @function
          * @param message {string} Message to put on the console.
          */
        object: createLogger('dir', that.TraceEnabled),

        /** Write debug message. 
          * @function
          * @param message {string} Message to put on the console.
          */
        debug: createLogger('debug', that.TraceEnabled),

        /** Write deprecation message.
          * @param oldApi {string} Name of deprecated API.
          * @param newApi {string} Name of new API that should be used instead.
          */
        deprecate: function(oldApi, newApi) {
            // Notify about deprecated method only once (no need to torture poor developers)
            if (!deprecatedApi[oldApi]) {
                deprecatedApi[oldApi] = newApi;
                this.warn("'%s' is deprecated. Please use '%s' instead.", oldApi, newApi);
            }
        },

        /** Creates a scope around specified function.
          * @param {function} callback Function to execute within the scope.
          * @param {...number} args Callback arguments.
          */
        scope: function() {
            var args = Array.prototype.slice.call(arguments),
                body = args.pop();

            if (!that.TraceEnabled) {
                body();
            } else {
                var timeSequence = createTimeSequence();

                group.apply(this, args);
                time(timeSequence);
                try {
                    body();
                } finally {
                    timeEnd(timeSequence);
                    groupEnd();
                }
            }
        },

        /**
         * Enables the JavaScript console logging.
         * @memberof Atalasoft.Logger
         */
        enable: function () {
            that.TraceEnabled = true;
        }
    };
};

module.exports = new logger();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
﻿

var $ = __webpack_require__(0);

//Web Capture Client side errors.
//Atalasoft.Controls.Capture.Errors

/** 
 * Web Capture Client side errors.
 * @enum {string}
 * @memberof Atalasoft.Controls.Capture
 */
var Errors = {
    report: function(errorFunction, errorMsg, params) {
        if (errorFunction) {
            errorFunction(errorMsg, params);
        } else {
            $.error(errorMsg);
        }
    },

    /**
     * Upload failed with XMLHttpRequest initialization error.
     */
    ajax: 'Could not create an XMLHttpRequest object needed for uploading.',
    /**
     * The browser is not supported. see {@tutorial 3-handling-errors}
     */
    badBrowser: 'Scanning requires Chrome, FireFox, or Edge running on Windows, or Safari running on macOS',

    /**
     * VRS license is missing or invalid.
     */
    badVrsLicense: 'VRS license is missing or invalid.',

    /**
     * Scanning service license is invalid or expired or  WebCaptureHandler license request failed.
     */
    licensingError: 'The server did not return valid licensing information.',

    /**
     * VRS command string contains error.
     */
    vrsBadCommand: 'eVRS command string is invalid.',

    /**
     * Batch field validation failed. see {@tutorial 2-3-connect-to-ui} for batch fields validation details.
     */
    batchFieldValidationError: 'Batch field validation failed.',

    /**
     * IndexField validation failed.
     */
    indexFieldValidationError: 'IndexField validation failed.',

    /**
     * Batch, or index field validation failed.
     */
    fieldValidationError: 'Batch, or index field validation failed.',

    /**
     * The server could not retrieve the batch fields for the selected batch class.
     */
    batchFieldsError: 'The server could not retrieve the batch fields for the selected batch class.',

    /**
     * The server could not retrieve content types.
     */
    contentTypesError: 'The server could not retrieve content types.',

    /**
     * The server could not retrieve the content description.
     */
    contentDescError: 'The server could not retrieve the content description.',

    /**
     * The server could not retrieve the index fields for the document class.
     */
    docClassIndexFieldError: 'The server could not retrieve the index fields for the document class.',

    /**
     * Scanner reports cover open.
     */
    doorOpen: 'Scanner reports cover open.',

    /**
     * Scanner reports a double-feed.
     */
    doubleFeed: 'Scanner reports a double-feed.',

    /**
     * Fatal exception in scanner driver.
     */
    driverCrash: 'Fatal exception in scanner driver.',

    /**
     * Failure in TWAIN Manager.
     */
    dsmFail: 'Failure in TWAIN Manager.',

    /**
     * Failed to open scanner.
     */
    dsOpen: 'Failed to open scanner.',

    /**
     * File not found or cannot be written or cannot be read.
     *
     * Also could indicate corrupted file content.
     */
    fileFail: 'File not found or cannot be written or cannot be read.',

    /**
     * File was locked by other application.
     */
    fileLocked: 'File locked by other application.',

    /**
     * Failed to load scanning service helper DLL.
     *
     * Could be fired in case of broken installation.
     */
    helperDll: 'Failed to load scanning service helper DLL.',

    /**
     * Captured document import failed in {@link Atalasoft.Controls.Capture.CaptureService}
     */
    importError: 'The server could not import the document.',

    /**
     * Generic Capture Service error.
     *
     * This error reported for unexpected service errors.
     */
    internalError: 'Unexpected internal error.',

    /**
     * The scanning service needs to be installed or started.
     */
    noPlugin: 'The scanning service needs to be installed. If it is installed it may need to be enabled.',

    /**
     * Twain feature needs to be installed(enabled in Windows features) on machine. see {@tutorial 3-handling-errors}.
     */
    noTwain: 'The TWAIN Manager needs to be installed.',

    /**
     * The scanning service needs to be updated to a newer version. see {@tutorial 3-handling-errors}.
     */
    oldPlugin: 'The scanning service needs to be updated to a newer version.',

    /**
     * The scanning service which runs as windows service needs to be updated to a newer version. see {@tutorial 3-handling-errors}.
     */
    oldWindowsService: 'The scanning service needs to be updated to a newer version. Contact your administrator for assistance.',

    /**
     * Insufficient memory to complete an operation. Restarting the Scanning Service may help.
     */
    outOfMemory: 'Insufficient memory to complete an operation. Restarting the Scanning Service may help.',

    /**
     * Scanner reports a paper jam.
     */
    paperJam: 'Scanner reports a paper jam.',

    /**
     * Scan start failed.
     */
    scanFail: 'Unable to start scan.',

    /**
     * Web server requests failed with timeout. Most likely fired on scanned images automatic upload. see {@tutorial 4-automatic-upload}
     */
    serverNotResponding: 'The server is not responding.',

    /**
     * Too many images for Scanning service to handle.
     *
     * Error could occur on big batch scans if all scanned images are kept in memory.
     * For big batches it's suggested to {@link BaseImage#discard|discard} every image and use {@link Atalasoft.Controls.Capture.WebScanning.ScanningOptions.deliverables|deliverables} settings to save each scanned image to encrypted local file.
     */
    tooManyImages: 'Too many images for Scanning service to handle.',

    /**
     * Requested file format is not supported.
     */
    unsupportedFormatWarning: 'Warning: Only the following image file types are supported for import: BMP, GIF, JPG/JPEG, PDF, TIFF. All other file types will be ignored and will not be imported.',

    /**
     * The server reported an error while uploading.
     */
    uploadError: 'The server reported an error while uploading.',

    /**
     * User cancelled the operation.
     *
     * Typically fired when scan is aborted by user using progress dialog. In this case scan is considered failed with this error.
     */
    userCancel: '',

    /**
     * Image DPI is too low or couldn't be correctly read from image.
     *
     * Note, when processing mobile camera images using VRS, usually DPI is not set correctly or don't have enough sense for Image Processing.
     * In this case it's suggested to add _**_DeviceType_2_ **_ command to {@link Atalasoft.Controls.Capture.WebScanning.ScanningOptions.evrsSettings|evrsSettings}. This will instruct VRS to apply algorithms which is specific to mobile images.
     */
    vrsBadDpiWarning: 'Warning: One or more images were skipped - Image Enhancement requires image DPI > 25',

    /**
     * Image transfer failed.
     */
    xferFail: 'Image transfer from scanner failed.',

    /**
     * Clarification message for `noPlugin` error.
     */
    webServiceMissed: 'Web Capture local service is not running.',

    /**
     * Browser process runs with restricted privileges which is not enough to correctly initialize Web Capture Service running as windows service.
     *
     * Typically this could happen in IE when visiting internet site with an untrusted certificate, or enable enhanced security mode is enabled.
     */
    lowIntegrityAccessDenied: 'Access to the Web Capture Service is denied because the current user has insufficient rights. This can have happened if you have visited site with the untrusted certificate or connect to the Web Capture Service from internet. Contact your administrator for assistance.',

    /**
     * Connection to Web Capture Service is broken for some unknown reason. 
     *
     * This could happen in rare circumstances of unrecoverable errors on Web Capture Service side. Page refresh typically resolves the problem.
     */
    brokenConnection: 'Connection to the scanning service is broken. You may need to refresh the page to restore it.',

    /**
     * Document feeder is empty.
     */
    feederEmpty: 'Document feeder is empty.'
};

module.exports = Errors;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

﻿/**
 * Atalasoft Web Capture Module.
 * @module Atalasoft/WebCapture/Service
 * @private
 */

var logger = __webpack_require__(1),
    $ = __webpack_require__(0),
    limited = false,
    deferredCallbacks = {};

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

/** Sends GET request.
  * @param url {string} URL to use.
  * @param data {object} Data to use as a body of request.
  * @param async {boolean} Whether to execute request asynchronously or not.
  */
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

/** Sends POST request.
  * @param url {string} URL to use.
  * @param data {object} Data to use as a body of request.
  * @param async {boolean} Whether to execute request asynchronously or not.
  */
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

/** Sends PUT request.
  * @param url {string} URL to use.
  * @param data {object} Data to use as a body of request.
  * @param async {boolean} Whether to execute request asynchronously or not.
  */
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

/** Sends DELETE request.
  * @param url {string} URL to use.
  * @param data {object} Data to use as a body of request.
  * @param async {boolean} Whether to execute request asynchronously or not.
  */
function del(url, data, async) {
    var verb = limited ? 'POST' : 'DELETE',
        requestUrl = limited ? url + '?debugMethod=DELETE' : url;

    logRequest(verb, requestUrl, data);
    return $.ajax({
        url: requestUrl,
        cache: false,
        data: JSON.stringify(data || {}),
        type: verb,
        async: (async === undefined ? true : async) || limited,
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

module.exports = {
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

/***/ }),
/* 4 */
/***/ (function(module, exports) {

﻿
// Versioning logic - minimum version of native code required
module.exports = [11,2,0,0];



/***/ }),
/* 5 */
/***/ (function(module, exports) {

// JavaScript include for web-based scanning.
// Copyright 2011-2014 by Atalasoft, a Kofax Company.
// All rights reserved.

// sniff browser & version
function detectBrowser () {
    var browser = { name: '' };
    var ua = navigator.userAgent || '';

    function getFirstMatch(regex) {
        var match = ua.match(regex);
        return (match && match.length > 1 && match[1]) || '';
    }

    if (/Opera\W|\sOPR\W/.test(ua)) {
        // Opera (new or old) - can actually run the plugin if it's already installed.
        // The new Bing-based Opera (version 20) can even install a Chrome .crx plugin!
        // But it doesn't matter, because officially we don't support Opera.
        browser = {
            name: 'Opera',
            opera: true,
            version: parseFloat(getFirstMatch(/(?:.*Version\W|Opera\W|\sOPR\W)(\d+\.\d+)/))
        };
    } else if (/msie|trident/i.test(ua)) {
        browser = {
            name: 'Internet Explorer',
            msie: true,
            version: parseFloat(getFirstMatch(/(?:msie |rv:)(\d+\.\d+)/i))
        };
    } else if (/chrome/i.test(ua)) {
        browser = {
            name: 'Chrome',
            chrome: true,
            version: parseFloat(getFirstMatch(/(?:chrome|crios|crmo)\/(\d+\.\d+)/i))
        };
    } else if (/firefox|iceweasel/i.test(ua)) {
        browser = {
            name: 'Firefox',
            firefox: true,
            version: parseFloat(getFirstMatch(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i))
        };
    } else if (/safari/i.test(ua)) {
        // Note: Safari actually works, if plugin is already installed.
        browser = {
            name: 'Safari',
            safari: true,
            version: parseFloat(getFirstMatch(/Version\W(\d+\.\d+)/i))
        };
    }

    if(navigator.platform === 'MacIntel'){
        browser.system = "MacOS";
    } else {
        browser.system = "Win32";
    }

    browser.supportsBeaconApi = !(browser.msie || (browser.safari & browser.version < 11.1));

    return browser;
}

module.exports = detectBrowser();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
﻿

// dependencies
var logger = __webpack_require__(1),
    service = __webpack_require__(3),
    $ = __webpack_require__(0);

/** @this BaseImage
  * @private 
  */
var updateFields = function (data) {
    /** 
     * '0', '1', '2', '3', '4', '6', or 'T'. The '0' value means 'no patch code detected'.
     * 
     * Note that the values are 1-character strings, but of course this is JavaScript so you can write 
     * either image.patchCode == '2' or image.patchCode == 2, as you wish.
     *
     * When patch code detection is not enabled, the patchCode of each acquired image is '0'.
     *
     * ```javascript
     * Atalasoft.Controls.Capture.WebScanning.scanningOptions = { onImageAcquired: _onImageAcquired, patchCodes: true }
     * // ...
     * function _onImageAcquired(eventName, image) {
     *   // Check patch code:
     *   if (image.patchCode == 'T') {
     *     // 'T' patch-code detected
     *   }
     * }
     * ```
     * @type {string}
     */
    this.patchCode = data.patchCode || '';
    /** @deprecated Use {@link BaseImage#patchCode|patchCode} instead. */ 
    this.PatchCode = this.patchCode;

    /** Barcodes found on the image. */
    this.barcodes = data.barcodes || [];
    /** @deprecated Use {@link BaseImage#barcodes|barcodes} instead. */ 
    this.Barcodes = this.barcodes;

    /** Imprinted text. 
     * @type {string}
     */
    this.imprintedText = data.imprintedText || '';
    /** @deprecated Use {@link BaseImage#imprintedText|imprintedText} instead. */ 
    this.ImprintedText = this.imprintedText;

    /** @deprecated  Use {@link BaseImage#eDoc|eDoc} and {@link BaseImage#path|path} instead. */
    this.Filename = data.filename;

    /** Encrypted local file identifier. 
     * @type {string}
     */
    this.localFile = data.localFile || '';

    /**
     * Array of Encrypted local file identifiers of the image chunks, if the image split was requested using {@link DeliverablesConfig|deliverables.localFile.split} or {@link DeliverablesConfig|deliverables.originalImageFile.split} for corresponding image object.
     * {@link BaseImage#localFile|localFile} will be set only if whole data is fit within single chunk.
     * @type {string[]}
     */
    this.localFileChunks = data.localFileChunks;

    /** Original image object metadata and local data storage identifiers.
     *
     * Original image is stored to the local storage and removed from memory right after scan. Only image metadata(like width, height, pixelType, etc) and {@link ImageBase#localFileChunks}, {@link ImageBase#localFile} properties are valid.
     * @type {ImageBase}
     */
    this.originalImage = data.originalImage;

    /** 
     * This property is initialized to false. If set to true by the {@link Atalasoft.Controls.Capture.WebScanning#event:onImageAcquired|onImageAcquired} handler, 
     * the image is discarded (deleted from the control's memory) when the handler returns.
     *
     * _**Note**_, that this property is processed synchronously in {@link Atalasoft.Controls.Capture.WebScanning#event:onImageAcquired|onImageAcquired} handler, i.e. if set in asynchronous operation callback, the change won't be reflected.
     * @type {boolean}
     */
    this.discard = false;

    /**
     * Flag indicating whether or not image is PDF or other eDoc.
     * @type {boolean}
     */
    this.eDoc = data.eDoc;

    /**
     * File path of the imported file.
     * @type {string}
     */
    this.path = data.path;
        
    if (!data.eDoc) {    
        /** Number of bits used to represent a pixel (typically 1,8, or 24). 
         * @type {number}
         */
        this.bitsPerPixel = data.bitsPerPixel || -1;
        /** @deprecated Use {@link BaseImage#bitsPerPixel|bitsPerPixel} instead. */
        this.BitsPerPixel = this.bitsPerPixel;

        /** Pixel type of the image. 
         * @type {Atalasoft.Controls.Capture.PixelType}
         */
        this.pixelType = data.pixelType || -1;
        /** @deprecated Use {@link BaseImage#pixelType|pixelType} instead. */
        this.PixelType = this.pixelType;

        /** Width of the image in pixels. 
         * @type {number}
         */
        this.width = data.width || 0;
        /** @deprecated Use {@link BaseImage#width|width} instead. */
        this.Width = this.width;

        /** Height of the image in pixels. 
         * @type {number}       
         */                        
        this.height = data.height || 0;
        /** @deprecated Use {@link BaseImage#height|height} instead. */
        this.Height = this.height;

        /** X DPI the image. 
         * @type {number}
         */
        this.xdpi = data.xdpi || -1;
        /** @deprecated Use {@link BaseImage#xdpi|xdpi} instead. */
        this.XResolution = this.xdpi;

        /** Y DPI the image. 
         * @type {number}
         */
        this.ydpi = data.ydpi || -1;
        /** @deprecated Use {@link BaseImage#ydpi|ydpi} instead. */
        this.YResolution = this.ydpi;

        /** The resolution of the image, in DPI (Dots Per Inch), in an array of [horizontal dpi, vertical dpi ]. 
         * @type {number[]}
         */
        this.dpi = [this.xdpi, this.ydpi];

        /* obsolete */ this.PageSide = data.pageSide;
        if ('front' in data) {
            /** 
             * If present, true when the image came from the front (top) side of a physical sheet, 
             * false for the back/bottom side.
             * 
             * If omitted, this information could not be confidently determined e.g. the scan is from 
             * a device that does not feed sheets.
             *
             * @type {boolean}
             */
            this.front = data.front;
        }
        
        /** @deprecated Use {@link BaseImage#sheetNo|sheetNo} instead. */
	this.SheetNo = data.sheetNo;
        if ('sheetNo' in data) {
            /** 
             * If present, the index of the physical sheet within the scan job of which this is an image (front or back side).
             *
             * The first sheet scanned is index 0.
             *
             * If not present, this information could not be confidently determined e.g. the scan is from 
             * a device that does not feed sheets.
             *
             * @type {number}
             */
            this.sheetNo = data.sheetNo;
        }

        if ('newSheet' in data) {
            /** 
             * If present, this is true when this image came from a different physical sheet than the preceding image if any.
             * 
             * It is false if this image is the flip (back, bottom) side of the same sheet as the preceding image.
             * 
             * If omitted, it means this information could not be confidently determined.
             *
             * @type {boolean}
             */
            this.newSheet = data.newSheet;
        }
    } else {
        /** File path of the imported PDF file.
         *
         * This property having value indicates that image proxy represents file format that is imported "As Is", i.e. PDF or eDoc. In this case image-specific properties are not present on such object and format change is not supported for it when requesting image data.
         * @type {string}
         * @deprecated  Use {@link BaseImage#eDoc|eDoc} and {@link BaseImage#path|path} instead.
         */
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
                format: fmt || (opts ? opts.format : undefined),
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
                format: fmt || (opts ? opts.format : undefined),
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

/** Image implementation.
 * @class
 * @alias BaseImage
 */
var ImageBase = function (session, imgId, data) {
    this.id = imgId;
    data = data || {};

    updateFields.call(this, data);

    // URL templates
    this.selfUrl = data.self;
    this.alternatives = data.alternatives;
    this.thumbUrl = data.thumb;
};

ImageBase.prototype = {
    updateData: function (imageData) {
        updateFields.call(this, imageData);
    },

    /**
     *  Gets an image as base64 string in the specified format.
     *  @param {string} format - Image encoding format. see {@link DeliverablesConfig| DeliverablesConfig.format} for supported formats.
     *  @param {DeliverablesConfig} [options] encoding options.
     *  @param {imageDataCallback} [callback] - Completion callback function. If not passed, method is executed synchronously.
     *  @return {string|undefined} base64 image data if executed synchronously; `undefined` otherwise
     */
    asBase64String: function asBase64String(format, options) {
        var args = Array.prototype.slice.call(arguments),
            callback = args.slice(-1).pop();

        if (typeof callback === 'function') {
            args.unshift(args.pop());
            asyncApi.asBase64String.apply(this, args);
        } else {
            logger.warn(
                "Parameter 'callback' is not specified. The method 'asBase64String' will be run synchronously.");
            return syncApi.asBase64String.apply(this, args);
        }
    },

    /**
     *  Saves an image as encrypted local file.
     * @param {string} [format] - File format to save image.
     * @param {DeliverablesConfig} [options] - Additional file options.
     * @param {saveLocalFileCallback} [callback] - Completion callback function. If not passed, method is executed synchronously.
     * @return {string|undefined} created local file identifier if executed synchronously; "undefined" otherwise.
     */
    saveEncryptedLocal: function saveEncryptedLocal(format, options, callback) {
        var args = Array.prototype.slice.call(arguments);
        callback = args.slice(-1).pop();

        if (typeof callback === 'function') {
            args.unshift(args.pop());
            asyncApi.saveEncryptedLocal.apply(this, args);
        } else {
            logger.warn(
                "Parameter 'callback' is not specified. The method 'saveEncryptedLocal' will be run synchronously.");
            return syncApi.saveEncryptedLocal.apply(this, args);
        }
    },

    /** 
     * Resets the image object to an empty state, releasing any (possibly large) internal memory being 
     * used to store pixel data. This is as close to a 'destroy' or 'dispose' method as we can get with a javascript object.
     */
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

    /** @deprecated Use {@link BaseImage#asBase64String|asBase64String} instead. */
    AsBase64String: function AsBase64String() {
        logger.deprecate('AsBase64String', 'asBase64String');
        return this.asBase64String.apply(this, arguments);
    },

    /** @deprecated Use {@link BaseImage#saveEncryptedLocal|saveEncryptedLocal} instead. */
    SaveEncryptedLocalFile: function SaveEncryptedLocalFile() {
        logger.deprecate('SaveEncryptedLocalFile', 'saveEncryptedLocal');
        return this.saveEncryptedLocal.apply(this, arguments);
    }
};

module.exports = ImageBase;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** Scan modes enumeration.
 * @readonly
 * @enum {number}
 * @memberof Atalasoft.Controls.Capture
 */
var ScanMode = {
    /** Simplex (front side only) */
    Simplex: 0,

    /** Duplex (both sides) */
    Duplex: 1,

    /** Leave current scanner settings*/
    Any: -1
};

/** Feeder types enumeration.
 * @readonly
 * @enum {number}
 * @memberof Atalasoft.Controls.Capture
 */
var FeederType = {
    /** Scan from platen (AKA platen/glass) */
    Flatbed: 0,

    /** Scan from ADF (Automatic Document Feeder)*/
    Feeder: 1,

    /** Scan from ADF (Automatic Document Feeder), if ADF is empty, scan from flatbed. If the scanner does not support the feature, leave unchanged. */
    AutoSelect: 2,

    /** Leave current scanner settings*/
    Any: -1
};

/** Scan orientation enumeration.
 * @readonly
 * @enum {number}
 * @memberof Atalasoft.Controls.Capture
 */
var Orientation = {
    /** Paper is scanned 'upright' (short edge feed) */
    Portrait: 0,

    /** Paper is scanned 'sideways' (long edge feed) */
    Landscape: 1,

    /** Leave current scanner settings*/
    Any: -1
};

/** Scanner measurement units enumeration.
 * 
 * @readonly
 * @enum {number}
 * @memberof Atalasoft.Controls.Capture
 */
var MeasurementUnit = {
    /** Measure in inches, 1 inch = 2.54 cm */
    Inches: 0,

    /** Measure in centimeters, 1 cm = 1.00 cm or 1/2.54 inches */
    Centimeters: 1,

    /** Measure in picas, 1 pica = .42333333 cm or 1/6 inches */
    Picas: 2,

    /** Measure in points, 1 point = .0352777775 cm or 1/72 inches */
    Points: 3,

    /** Measure in twips, 1 twip = .0001763888 cm or 1/1440 inches */
    Twips: 4,

    /** Measure in pixels */
    Pixels: 5,

    /** Measure in millimeters, 1 mm = 0.1 cm or 1/25.4 inches */
    Millimeters: 6
};

/** Imprinter font style enumeration.
 * 
 * @readonly
 * @enum {number}
 * @memberof Atalasoft.Controls.Capture
 */
var PrinterFontStyle = {
    /** None (not configured). In this case current values are used. */
    None: 0,

    /** Normal font */
    Normal: 1,

    /** Bold font */
    Bold: 2,

    /** Italic font */
    Italic: 4,

    /** Large size font */
    LargeSize: 8,

    /** SmallSize */
    SmallSize: 16
};

/** Scan paper size enumeration.
 *
 * Values corresponds to most popular paper sizes are presented. This enum could be extended to accept any valid paper size numeric value.
 * @readonly
 * @enum {number}
 * @memberof Atalasoft.Controls.Capture
 */
var PaperSize = {
    /** Indicates 'no preference' */
    Any: -1,

    /** While TWAIN defines meaning of value 0 as 'maximum scan area', many scanners and Image Capture on macOS will treat this
     * as 'default' or 'last size selected by the user.'*/
    None: 0,

    /** 210mm x 297mm (ISO A4) */
    A4: 1,

    /** 182mm x 257mm (Same as JIS B5) */
    JISB5: 2,

    /** 8.5" x 11.0" (US Letter) */
    USLetter: 3,

    /** 8.5" x 14.0" (US Legal) */
    USLegal: 4,

    /** 148mm x 210mm (ISO A5) */
    A5: 5,

    /** 250mm x 353mm (ISO B4)  */
    ISOB4: 6,

    /** 125mm x 176mm (ISO B6) */
    ISOB6: 7,

    /** 11.0" x 17.0" (US Ledger) */
    USLedget: 9,

    /** 10.5" x 7.25" (US Executive) */
    USExecutive: 10,

    /** 297mm x 420mm (ISO A3) */
    A3: 11,

    /** 353mm x 500mm (ISO B3) */
    ISOB3: 12,

    /** 105mm x 148mm (ISO A6) */
    A6: 13,

    /** 229mm x 324mm (ISO C4) */
    C4: 14,

    /** 162mm x 229mm (ISO C5) */
    C5: 15,

    /** 114mm x 162mm (ISO C6) */
    C6: 16,

    /** 1682mm x 2378mm (4A0) */
    FourA0: 17,

    /** 1189mm x 1682mm (2A0) */
    TwoA0: 18,

    /** 841mm x 1189mm (A0) */
    A0: 19,

    /** 594mm x 841mm (A1) */
    A1: 20,

    /** 420mm x 594mm (A2) */
    A2: 21,

    /** 74mm x 105mm (A7) */
    A7: 22,

    /** 52mm x 74mm (A8) */
    A8: 23,

    /** 37mm x 52mm (A9) */
    A9: 24,

    /** 26mm x 37mm (A10) */
    A10: 25,

    /** 1000mm x1414mm (ISO B0) */
    ISOB0: 26,

    /** 707mm x1000mm (ISO B1) */
    ISOB1: 27,

    /** 500mm x 707mm (ISO B2) */
    ISOB2: 28,

    /** 176mm x 250mm (ISO B5) */
    ISOB5: 29,

    /** 88mm x 125mm (ISO B7) */
    ISOB7: 30,

    /** 62mm x 88mm (ISO B8) */
    ISOB8: 31,

    /** 44mm x 62mm (ISO B9) */
    ISOB9: 32,

    /** 31mm x 44mm (ISO B10) */
    ISOB10: 33,

    /** 1030mm x1456mm (JIS B0) */
    JISB0: 34,

    /** 728mm x1030mm (JIS B1) */
    JISB1: 35,

    /** 515mm x 728mm (JIS B2) */
    JISB2: 36,

    /** 364mm x 515mm (JIS B3) */
    JISB3: 37,

    /** 257mm x 364mm (JIS B4) */
    JISB4: 38,

    /** 128mm x 182mm (JIS B6) */
    JISB6: 39,

    /** 91mm x 128mm (JIS B7) */
    JISB7: 40,

    /** 64mm x 91mm (JIS B8) */
    JISB8: 41,

    /** 45mm x 64mm (JIS B9) */
    JISB9: 42,

    /** 32mm x 45mm (JIS B10) */
    JISB10: 43,

    /** 917mm x1297mm (C0) */
    C0: 44,

    /** 648mm x 917mm (C1) */
    C1: 45,

    /** 458mm x 648mm (C2) */
    C2: 46,

    /** 324mm x 458mm (C3) */
    C3: 47,

    /** 81mm x 114mm (C7) */
    C7: 48,

    /** 57mm x 81mm (C8) */
    C8: 49,

    /** 40mm x 57mm (C9) */
    C9: 50,

    /** 28mm x 40mm (C10) */
    C10: 51,

    /** 5.5" x 8.5" (140mm x 216mm) (US Statement) */
    USStatement: 52,

    /** 3.5" x 2" Business Card */
    Businesscard: 53
};

/** Imprinter types enumeration.
 *
 * Values corresponds to TWAIN specification.
 * @readonly
 * @enum {string}
 * @memberof Atalasoft.Controls.Capture
 */
var ImprinterTypes = {
    /** Imprinter before value. */
    ImprinterBefore: "ImprinterBefore",

    /** Imprinter after value. */
    ImprinterAfter: "ImprinterAfter",

    /** Imprinter bottom before value. */
    ImprinterBottomBefore: "ImprinterBottomBefore",

    /** Imprinter bottom after value. */
    ImprinterBottomAfter: "ImprinterBottomAfter",

    /** Endorser before value. */
    EndorserBefore: "EndorserBefore",

    /** Endorser after value. */
    EndorserAfter: "EndorserAfter",

    /** Endorser bottom before value. */
    EndorserBottomBefore: "EndorserBottomBefore",

    /** Endorser bottom after value. */
    EndorserBottomAfter: "EndorserBottomAfter"
};

/** Scan compression modes enumeration.
 * @readonly
 * @enum {number}
 * @memberof Atalasoft.Controls.Capture
 */
var ScanCompression = {
    /** Disable compression for scanned images */
    Disable: 0,

    /** Enabled compression for scanned images */
    Enable: 1,

    /** WebCapture Service enables or disables cpompression automatically */
    Auto: -1
};

module.exports = {
    ScanMode: ScanMode,
    FeederType: FeederType,
    Orientation: Orientation,
    PaperSize: PaperSize,
    ImprinterTypes: ImprinterTypes,
    ScanCompression: ScanCompression
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
﻿

/** Pixel type enumeration.
 * @readonly
 * @enum {number}
 * @memberof Atalasoft.Controls.Capture
 */
var PixelType = {
    Auto: -2,
    /** Don't care */
    Any: -1,
    /** B&W - bitonal */
    BW: 0,
    /** Grayscale (8-bit linear) */
    Grayscale: 1,
    /** RGB Color (24-bit) */
    Color: 2,
    /** Indexed color (8-bit)
     *  @constant
     *  @default
     */
    Indexed: 3
};

module.exports = PixelType;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
﻿// JavaScript include for web-based scanning.
// Copyright 2011-2015 by Atalasoft, a Kofax Company.
// All rights reserved.


var $ = __webpack_require__(0),
    errorsManager = __webpack_require__(2);

var Uploader = function (url, callbackFunction, params) {
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
        }
        if (that.xhr === null) {
            errorsManager.report(params.onUploadError, errorsManager.ajax);
            return false;
        } else {
            that.xhr.onreadystatechange = function () {
                if (that.xhr.readyState === 4) {
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


//Atalasoft.Controls.Capture.UploadToCaptureServer
/** Creates an uploader object. 
 * @constructor
 * @private
 */
var UploadService = function () {

    /**
     * Fired when scanned document upload started.
     * @event Atalasoft.Controls.Capture.UploadToCaptureServer#onUploadStarted
     * @type {onUploadStartedCallback}
     */

    /**
     * Callback signature for {@link Atalasoft.Controls.Capture.UploadToCaptureServer#event:onUploadStarted|onUploadStarted} event.
     * @callback onUploadStartedCallback
     */

    /**
     * Fired when scanned document upload completed.
     * @event Atalasoft.Controls.Capture.UploadToCaptureServer#onUploadCompleted
     * @type {onUploadCompletedCallback}
     */

    /**
     * Callback signature for {@link Atalasoft.Controls.Capture.UploadToCaptureServer#event:onUploadCompleted|onUploadCompleted}
     * @callback onUploadCompletedCallback
     * @param {boolean} success indicates whether upload was successful
     * @param {string} documentFilename uploaded file name received from server
     * @param {Object} response arbitrary json object received from server
     * @param {int} [responseStatus=undefined] HTTP response status code if upload failed
     */

    /**
     * Fired when scanned document upload completed with error.
     * @event Atalasoft.Controls.Capture.UploadToCaptureServer#onUploadError
     * @type {onUploadErrorCallback}
     */

    /**
     * Callback signature for {@link Atalasoft.Controls.Capture.UploadToCaptureServer#event:onUploadError|onUploadError}
     * @callback onUploadErrorCallback
     * @param {string} errorMsg error message from {@link Atalasoft.Controls.Capture.Errors}
     * @param {Object} params additional error metadata
     * @param {string} params.handlerUrl url of the upload handler
     * @param {int} [params.responseStatusMsg = undefined] HTTP response status code if response finished without timeout
     * @param {Object} [params.responseObject] server response object if response finished without timeout
     * @param {int} [params.timeout] ajax timeout value for this upload in milliseconds in case if response finished timeout error
     */

    /**
     *  Additional data for upload HTTP requests
     *  @typedef {Object} Atalasoft.Controls.Capture.UploadToCaptureServer.UploadOptions
     *  @property {Object} [formData=null] arbitrary plain object containing additional data that should be passed to server. See {@tutorial 4-automatic-upload}
     *  @property {string[]} [extraParts=undefined] a list of additional parts to be inserted in the multipart body of each upload. See {@tutorial 4-automatic-upload}
     */

    /**
     * Upload service initialization parameters
     * @typedef {Object} Atalasoft.Controls.Capture.UploadToCaptureServer.UploadParams
     * @class
     * @static
     * @alias UploadParams
     * @property {string} handlerUrl url to web capture handler to upload images data to
     * @property {Object} [eventBindObject] events bind object to trigger events. By default it's empty jquery object
     * @property {function} eventBindObject.bind attach a handler to an event
     * @property {function} eventBindObject.unbind detach a handler from an event
     * @property {function} eventBindObject.trigger execute all handlers and behaviors attached to the matched elements for the given event type
     *
     * @property {UploadOptions} [uploadOptions] additional data for upload HTTP requests
     * @property {string} [uploadLocation] - optional value for 'uploadLocation' form data part of the upload HTTP request.
     *
     * @property {onUploadStartedCallback} onUploadStarted handler for {@link Atalasoft.Controls.Capture.UploadToCaptureServer#event:onUploadStarted|onUploadStarted}
     * @property {onUploadCompletedCallback} onUploadCompleted handler for {@link Atalasoft.Controls.Capture.UploadToCaptureServer#event:onUploadCompleted|onUploadCompleted}
     * @property {onUploadErrorCallback} onUploadError handler for {@link Atalasoft.Controls.Capture.UploadToCaptureServer#event:onUploadError|onUploadError}
     */
    var _uploadParams = {};
    var _self = this;

    // 2017.29.03 DLegashov - removed '=' symbol since it causing internal error in the ASP.NET Core parser
    // and it can't properly handle upload request.
    this.boundaryString = 'AaBbCc_X30';
    this.dash_boundary = '--AaBbCc_X30';
    this.initialize = initialize;
    this.isInitialized = isInitialized;
    this.dispose = dispose;
    this.getUploadCallback = getUploadCallback;

    this.uploadToServer = uploadToServer;

    /**
     * Initializes upload service
     * @param {Atalasoft.Controls.Capture.UploadToCaptureServer.UploadParams} params initialization parameters
     * @memberOf Atalasoft.Controls.Capture.UploadToCaptureServer
     * @static
     */
    function initialize(params) {
        _uploadParams = params || {};
        if (!_uploadParams.eventBindObject) {
            _uploadParams.eventBindObject = $({});
        }
        __bindEvents(true);
    }

    /**
     * Determines whether {@link Atalasoft.Controls.Capture.UploadToCaptureServer|UploadToCaptureServer} service is initialized
     * @returns {boolean} valued indicating whether {@link Atalasoft.Controls.Capture.UploadToCaptureServer| UploadToCaptureServer} service is initialized.
     */
    function isInitialized() {
        return _uploadParams && _uploadParams.handlerUrl;
    }

    /**
     * Disposes the {@link Atalasoft.Controls.Capture.UploadToCaptureServer|UploadToCaptureServer} service
     * @memberOf Atalasoft.Controls.Capture.UploadToCaptureServer
     * @static
     */
    function dispose() {
        __bindEvents(false);
        _uploadParams = {};
    }

    /**
         * Binds events to callbacks provided by client.
         * @param isBind attaches event handlers if true; otherwise detaches.
         */
    function __bindEvents(isBind) {
        var evtObj = _uploadParams.eventBindObject,
            fn = isBind ? evtObj.bind : evtObj.unbind;
        if (_uploadParams.onUploadStarted) {
            fn.call(evtObj, 'onUploadStarted', isBind ? {} : _uploadParams.onUploadStarted, _uploadParams.onUploadStarted);
        }
        if (_uploadParams.onUploadCompleted) {
            fn.call(evtObj, 'onUploadCompleted', isBind ? {} : _uploadParams.onUploadCompleted, _uploadParams.onUploadCompleted);
        }
    }

    /**
     * Upload handler factory
     * @memberOf Atalasoft.Controls.Capture.UploadToCaptureServer
     * @static
     * @returns {function}
     * @tutorial {4-automatic-upload}
     */
    function getUploadCallback() {
        return function (data, options) {
            uploadToServer(data, options);
        };
    }

    function __extensionFromBase64String(data) {
        switch (data.substr(0, 5)) { // check leading 4 bytes
            case 'JVBER':
                return 'pdf'; //  % P D F
            case '/9j/4':
                return 'jpg'; // FF D8 Ff E0
            case 'R0lGO':
                return 'gif'; // G I F 8
            case 'iVBOR':
                return 'png'; // 89 50 4E 47
            case 'TU0AK':
                return 'tif'; // 4d 4d 00 2a (MM.*)
            case 'SUkqA':
                return 'tif'; // 49 49 2a 00 (II*.)
            default:
                break;
        }
        if (data.substr(0, 2) == "Qk") {
            return 'bmp'; // B  M  
        }
        return 'bin'; // some unknown, presumably binary format
    }


    /** Starts upload operation. 
     * @function
     * @static
     * @param data {string} base64 encoded data to upload.
     * @param options {Atalasoft.Controls.Capture.UploadToCaptureServer.UploadOptions} the upload options
     * @memberOf Atalasoft.Controls.Capture.UploadToCaptureServer
     */
    function uploadToServer(data, options) {
        _uploadParams.eventBindObject.trigger('onUploadStarted', {});
        var ext = __extensionFromBase64String(data);
        var mimeType = {
            bmp: 'image/bmp',
            gif: 'image/gif',
            jpg: 'image/jpeg',
            pdf: 'application/pdf',
            png: 'image/png',
            tif: 'image/tiff',
            bin: 'application/octet-stream'
        }[ext];

        var delimiter = '\r\n' + _self.dash_boundary + '\r\n';
        if (!options) {
            options = _uploadParams.uploadOptions || {};
        }
        var extraParts = '';
        // Adding this for the sharepoint control. 
        if (typeof _uploadParams.uploadLocation === 'string' && _uploadParams.uploadLocation.length !== 0) {
            extraParts += delimiter +
                'Content-Disposition: form-data; name="uploadLocation"\r\n\r\n' +
                _uploadParams.uploadLocation;
        }
        // Append any key-value pairs provided by client app
        if (options.formData) {
            for (var key in options.formData) {
                if (options.formData.hasOwnProperty(key)) {
                    extraParts += delimiter +
                        'Content-Disposition: form-data; name="' + key + '"\r\n\r\n' +
                        __encodePartValue(options.formData[key]);
                }
            }
        }
        // Append any extra MIME parts provided by client app
        if (options.extraParts) {
            var parts = options.extraParts;
            var i;
            for (i = 0; i < parts.length; i++) {
                extraParts += delimiter + parts[i];
            }
        }

        // Create a customized XmlHttp object
        // We provide the target URL, and our internal completion-handler
        var uploader = new Uploader(
            _uploadParams.handlerUrl,
            function (txt, stat, xml) { __onPostCompleted(txt, stat); },
            _uploadParams
        );

        uploader.boundary = _self.dash_boundary;
        uploader.boundaryString = _self.boundaryString;

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
            extraParts +
            delimiter +
            // uploaded data part
            'Content-Disposition: form-data; name="file"; filename="document.' + ext + '"\r\n' +
            'Content-Type: ' + mimeType + '\r\n' +
            'Content-transfer-encoding: base64\r\n' +
            '\r\n',
            data,
            '\r\n' + _self.dash_boundary + '--\r\n');

        // Set a watchdog timer
        uploader.onTimeout = function () {
            errorsManager.report(_uploadParams.onUploadError, errorsManager.serverNotResponding,
                { handlerUrl: _uploadParams.handlerUrl, timeout: uploader.timeout }
            );
            _uploadParams.eventBindObject.trigger('onUploadCompleted', {
                success: false,
                responseStatus: 598,
                response: errorsManager.serverNotResponding
            });
        };

        // Start the upload:
        uploader.send(postContent);
        // Note: returns false if unable to start upload, but we ignore.
    }

    // called while constructing an upload multipart/form, to convert the value of a
    // key=value part into a string
    function __encodePartValue(val) {
        if (typeof val === 'string' || typeof val === 'number') {
            return val;
        } else {
            return JSON.stringify(val);
        }
    }

    // This function is called by the ajaxUploader when we have received
    // the response from the server-side.
    function __onPostCompleted(responseTextMsg, responseStatusMsg) {
        var responseObject;
        try {
            responseObject = JSON.parse(responseTextMsg);
        } catch (ex) {
            responseObject = "JSON.parse: " + ex.message;
        }

        if (responseStatusMsg === 200) {
            if (_uploadParams.eventBindObject) {
                _uploadParams.eventBindObject.trigger('onUploadCompleted', {
                    success: true,
                    documentFilename: responseObject.filename,
                    response: responseObject
                });
            }
        } else {
            errorsManager.report(_uploadParams.onUploadError, errorsManager.uploadError,
                { responseStatus: responseStatusMsg, response: responseObject, handlerUrl: _uploadParams.handlerUrl }
            );

            if (_uploadParams.eventBindObject) {
                _uploadParams.eventBindObject.trigger('onUploadCompleted', {
                    success: false,
                    responseStatus: responseStatusMsg,
                    response: responseObject
                });
            }
        }
    }
};

module.exports = new UploadService();


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
﻿
// Public API polyfill for compatibility with applications that are not using module-based dependency manager.
// For main entry module see Atalasoft.WebCapture.js



var version = __webpack_require__(4),
    webCapture = __webpack_require__(11),
    documentService = __webpack_require__(19),
    errorsManager = __webpack_require__(2),
    pixelTypeEnum = __webpack_require__(8),
    logger = __webpack_require__(1),
    uploadService = __webpack_require__(9),
    enums = __webpack_require__(7);

function isAtalasoftGlobalExist() {
    return !!self.Atalasoft;
}

/** @namespace Atalasoft */
/** @namespace Atalasoft.Logger */
/** @namespace Atalasoft.Controls */
/** @namespace Atalasoft.Controls.Capture */
/** @namespace Atalasoft.Controls.Capture.WebScanning */
/** @namespace Atalasoft.Controls.Capture.UploadToCaptureServer  */

/** 
 * Local files are stored in this folder: 
 * - On Windows: <code>%LOCALAPPDATA%\Kofax\WebCapture\Persistent</code>
 * - On macOS: <code>/Users/&lt;current user&gt;/Library/WebCapture</code>
 * 
 * The file names follow this pattern: 
 * <pre><code>(T|U)<sessionid>-<filenumber>.elf</pre></code>
 * 
 * **T** indicates a *trusted* file – WebCapture generated the contents.
 * 
 * **U** indicates an *untrusted* file – contents came from outside the plugin e.g. via LocalFile.fromBase64String
 * 
 * The **session-id** is generated each time the plugin is instantiated, and should be unique on any given computer for ~13 years.
 * 
 * The **filenumber** is generated sequentially within each session, starting from 1.
 * 
 * **.elf** stands for Encrypted Local File.
 *
 * @namespace Atalasoft.Controls.Capture.WebScanning.LocalFile 
 */

var controls = isAtalasoftGlobalExist() ? self.Atalasoft.Controls : {};

// Re-export WDV namespaces if presented
var utils = isAtalasoftGlobalExist() ? self.Atalasoft.Utils : {};
var annotations = isAtalasoftGlobalExist() ? self.Atalasoft.Annotations : {};

controls.Capture = {
    Errors: errorsManager,
    PixelType: pixelTypeEnum,
    FeederType: enums.FeederType,
    ScanMode: enums.ScanMode,
    Orientation: enums.Orientation,
    PaperSize: enums.PaperSize,
    ImprinterTypes: enums.ImprinterTypes,
    minVersion: version,
    WebScanning: webCapture,
    UploadToCaptureServer: uploadService,
    CaptureService: documentService
};

module.exports = isAtalasoftGlobalExist()
    ? {
        Annotations: annotations,
        Controls: controls,
        Logger: logger,
        Utils: utils,
    }
    : {
        Controls: controls,
        Logger: logger
    };

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



/**
 * Notification callback signature. The callback function that is called without parameters.
 * @callback notificationCallback
 */

var $ = __webpack_require__(0),
    browser = __webpack_require__(5),
    eztwainScannerFactory = __webpack_require__(12),
    uploadService = __webpack_require__(9),
    errorsManager = __webpack_require__(2),
    logger = __webpack_require__(1),
    jsVersion = __webpack_require__(4),
    ie9CorsTransportPatch = __webpack_require__(18);

// some external code was caught on setting scanningOptions directly. so we need to support such scenario too.

var api = {
    _scanClient: null,
    // strange things with this particular cache of scan options is that it's applied only when calling scan/import/rest.. api without parameters.

    /**
     * This property holds the current scanning options. These options are used when the user clicks the scan button,
     * or if {@link Atalasoft.Controls.Capture.WebScanning.scan|scan} is called.
     *
     * Initially this holds the scanningOptions object passed to {@link Atalasoft.Controls.Capture.WebScanning.initialize|initialize}, but your code can
     * dynamically edit this object to change the settings for a subsequent scan.
     * @type {ScanningOptions}
     */
    scanningOptions: {},
    uploadOptions: {},
    LocalFile: null,
    isSupportedBrowser: false
};

/// Web Scanning
var _params = {};

/**
 * Gets version of JavaScript components of WingScan as an array of numbers.
 * @memberof Atalasoft.Controls.Capture.WebScanning
 * @returns {number[]} version of JavaScript components of WingScan.
 */
function getJSVersion() {
    return jsVersion;
}

/** 
 * This method must be called to initialize the WebScanning component. The init object must contain a *handlerUrl* property, all other properties -
 * listed below - are optional. Initialization is *asynchronous*! When this method returns, WebCapture is not yet initialized, and may never be.

 * When initialization is complete (licensing has been verified, a scanner list has been constructed and it is possible to initiate scan or import
 * operations) WebScanning calls the onScanClientReady call-back from the init object.
 *
 * Asynchronously, initialize attempts to install or start the WebCapture plugin or service, verify licensing, and then to initialize scanning on
 * the client, and to collect a list of available scanners. If it is successful, it will populate a scanner-list control and enable a scan button
 * and/or import button, if they exist with the appropriate classes:
 *  * If there is a listbox (*select* element) with class atala-scanner-list, it is loaded with the list of available scanners and the default scanner is selected.
 *  * Any controls with class atala-scan-button are given a click-handler that calls {@link Atalasoft.Controls.Capture.WebScanning.scan|scan}
 *  * Any controls with class atala-local-file-import-button are given a click-handler that calls {@link Atalasoft.Controls.Capture.WebScanning.importFiles|importFiles}
 * 
 * @memberof Atalasoft.Controls.Capture.WebScanning
 * @param {Object} params - WebScanning initialization parameters.
 * @param {string} params.handlerUrl - The URL of the web request handler. This is normally a relative URL, for example: 'TestCaptureHandler.ashx'.
 *
 *  **Default value**: no default. 
 * 
 * @param {onImageAcquiredCallback} params.onImageAcquired - See {@link Atalasoft.Controls.Capture.WebScanning#event:onImageAcquired|onImageAcquired} event.
 *
 * @param {function=} params.onImageDiscarded - This handler is called when Web Capture Service discards image.
 * 
 * @param {function=} params.onScanClientReady - This handler is called when scanning initialization is complete, no matter whether it was successful or not.
 *    Note that the scanner list could still be empty if no scanners were detected.
 * 
 *   **Important**: This handler may never be called! Some possible causes:
 *    * The user declines to install/approve the WebCapture plugin
 *    * Plugin installation fails.
 *    * The browser or OS is unsupported.
 *
 * @param {function=} params.onShutdown - This optional handler is called when the web page is unloaded or reloaded, 
 *   prior to any internal WingScan cleanup or shutdown. 
 * 
 *   **Note**: any scan or import that is in progress is aborted before this handler is called. 
 *   If {@link Atalasoft.Controls.Capture.WebScanning.initialize|initialize} did not succeed, it is possible this handler will not be called. 
 *   And if you are somehow using WingScan in the Opera browser, this handler will never be called because Opera famously does not support the page-unload event.
 *
 * @param {onScanErrorCallback=} params.onScanError - This handler is called to report any errors detected by WingScan/WebCapture.
 *   Note that it can be called during a call to any WingScan method, or asynchronously by background operations such as importFiles.
 *
 * @param {function=} params.onScanStarted - This handler is called when a {@link Atalasoft.Controls.Capture.WebScanning.scan|scan}
 *   or {@link Atalasoft.Controls.Capture.WebScanning.importFiles|importFiles} is started.
 *  
 * @param {onScanCompletedCallback=} params.onScanCompleted - This handler is called when a {@link Atalasoft.Controls.Capture.WebScanning.scan|scan}
 *   or {@link Atalasoft.Controls.Capture.WebScanning.importFiles|importFiles} ends - successfully or not.
 *
 * @param {onUploadStartedCallback=} params.onUploadStarted - This handler is called when a document upload is starting.
 *
 * @param {onUploadCompletedCallback=} params.onUploadCompleted - This handler is called when a document upload has completed.
 *
 * @param {onUploadErrorCallback=} params.onUploadError - This handler is called when an error occurs during uploading.
 * 
 * @param {number=} params.serverTimeout - This is the number of seconds to wait for the server response after starting an upload. 
 *   After this number of seconds, the upload is considered to
 *   have failed, it is canceled, and an error is signaled by calling the {@link Atalasoft.Controls.Capture.WebScanning#event:onUploadError|onUploadError} handler.
 *   
 *   **Default value**: 50 (seconds)
 * 
 * @param {Atalasoft.Controls.Capture.WebScanning.ScanningOptions} [params.scanningOptions] - This property must be an object containing scanner settings to be used for scanning.
 * @param {Atalasoft.Controls.Capture.UploadToCaptureServer.UploadOptions} [params.uploadOptions] - This property must be an object, which contains (additional) upload settings.
 *
 * @param {Atalasoft.Controls.Capture.Errors=} params.localization - This object provides a translation table for all potentially user-visible strings used by Atalasoft DotImage.
 *   See {@link Atalasoft.Controls.Capture.Errors} for all possible strings.
 *
 *   **Default value**: {} - which selects the default American English localization.
 *
 * @param {boolean} [params.backwardCompatibilityMode] - This flag indicates whether to run in backward compatibility mode.
 *   If set to true, WebCapture Service allows to use JavaScript and client application of different version and does not request WCS application to be updated.
 *
 *   **Default value**: false.
 *
 * @returns {undefined}
 */
function initialize(params) {
    logger.log("Atalasoft.Controls.Capture.WebScanning.initialize(...)");
    _params = params;
    // If a scanningOptions object is provided...
    if (params.scanningOptions !== undefined) {
        // ...share that object as our options object.
        api.scanningOptions = params.scanningOptions;
    }
    if (params.uploadOptions !== undefined) {
        api.uploadOptions = params.uploadOptions;
    }
    // Replace any of our string translations with those passed in:
    __localizeErrors(errorsManager, params.localization);
    if (!__getScanClient()) {
        // Get the possibly browser- or platform-specific scanning object
        __setScanClient(eztwainScannerFactory.getScanClient());
        __getScanClient().initialize({
            /**
              * Callback signature for {@link Atalasoft.Controls.Capture.WebScanning#event:onScanError|onScanError} event. See {@tutorial 3-handling-errors}
              * @callback onScanErrorCallback
              * @param {string} error - Error identifier, one of {@link Atalasoft.Controls.Capture.Errors}.
              * @param {object} params - additional error metadata. Object structure depends on particular error type.
              */

            /** Called when scan or file import completed with error.
              * @event Atalasoft.Controls.Capture.WebScanning#onScanError
              * @type {onScanErrorCallback}
              */
            onScanError: params.onScanError,

            /**
             * Called when scanning starts.
             * @event Atalasoft.Controls.Capture.WebScanning#onScanStarted
             * @type {notificationCallback}
             */
            onScanStarted: params.onScanStarted,

            /**
             * Callback signature for {@link Atalasoft.Controls.Capture.WebScanning#event:onScanCompleted|onScanCompleted} event.
             * @param {object} params - Completion info.
             * @param {boolean} params.success - Indicates whether scan was completed successfully.
             * @param {object} params.error - Error details if completion was unsuccessful.
             * @param {string} params.error.message - Error identifier, one of {@link Atalasoft.Controls.Capture.Errors}.
             * @param {string} params.error.details - Additional technical error information.
             * @callback onScanCompletedCallback
             */

            /**
             * Called when scan or import completed. See {@tutorial 3-handling-errors} for details.
             * @event Atalasoft.Controls.Capture.WebScanning#onScanCompleted
             * @type {onScanCompletedCallback}
             */
            onScanCompleted: params.onScanCompleted,

            /**
              * Callback signature for {@link Atalasoft.Controls.Capture.WebScanning#event:onImageAcquired|onImageAcquired} event.
              * @callback onImageAcquiredCallback
              * @param {number} index - Image index.
              * @param {Image} image - Acquired image object.
              */
            /**
              * The onImageAcquired handler is called during scanning, once for each image received from the scanner, with a single parameter which is an
              * image object - that is, an object that represents the received image held by WingScan. The image object provides a rich set of properties and a
              * small set of methods for exporting the image data in various ways.
              *
              * The onImageAcquired handler is also called by the {@link Atalasoft.Controls.Capture.WebScanning.importFiles|importFiles} method, 
              * once for each imported image, and once for each imported PDF file.
              *
              * Imported PDF files are handled somewhat specially: they are represented by an image object with the distinguishing property filename - which
              * is the full path of the imported file. When the {@link Image#filename|filename} property is present, the usual image properties are absent. The image object that
              * represents an imported PDF still supports the methods {@link Image#asBase64String|asBase64String}, {@link Image#clear|clear}, 
              * {@link Image#saveEncryptedLocal|saveEncryptedLocal}, and {@link Image#thumbnail|thumbnail}.
              *
              * @event Atalasoft.Controls.Capture.WebScanning#onImageAcquired
              * @type {onImageAcquiredCallback}
              */
            onImageAcquired: params.onImageAcquired,

            /**
             * Called when Web Capture Services discards image. This can happen, when flag {@link Atalasoft.Controls.Capture.WebScanning.ScanningOptions.discardBlankPages|discardBlankPages} is set.
             * @event Atalasoft.Controls.Capture.WebScanning#onImageDiscarded
             * @type {notificationCallback}
             */
            onImageDiscarded: params.onImageDiscarded,

            /**
             * This handler is called when scanning initialization is complete.
             * Normally in case of failure the {@link Atalasoft.Controls.Capture.WebScanning#event:onScanError|onScanError} handler will have been called.
             * @event Atalasoft.Controls.Capture.WebScanning#onScanClientReady
             * @type {notificationCallback}
             */
            onScanClientReady: function () { __onScanClientReady(); },
            eventBindObject: __eventBindObject(),
            localization: errorsManager,
            scanningOptions: api.scanningOptions,

            /**
             * This flag indicates whether to run in backward compatibility mode.
             * If set to true, WebCapture Service allows to use JavaScript and client application of different version and does not request WCS application to be updated.
             * **Default value**: false.
             * @type {boolean}
             */
            backwardCompatibilityMode: params.backwardCompatibilityMode
        });

        $(window)
            .bind('beforeunload', __unload)
            .bind('unload', __unload);
    }

    uploadService.initialize({
        handlerUrl: params.handlerUrl,
        serverTimeout: params.serverTimeout,

       /**
        * Fired when scanned document upload completed with error.
        * @event Atalasoft.Controls.Capture.WebScanning#onUploadError
        * @type {onUploadErrorCallback}
        */
        onUploadError: params.onUploadError,

       /**
        * Fired when scanned document upload started.
        * @event Atalasoft.Controls.Capture.WebScanning#onUploadStarted
        * @type {onUploadStartedCallback}
        */
        onUploadStarted: params.onUploadStarted,

       /**
        * Fired when scanned document upload completed.
        * @event Atalasoft.Controls.Capture.WebScanning#onUploadCompleted
        * @type {onUploadCompletedCallback}
        */
        onUploadCompleted: params.onUploadCompleted,

        uploadLocation: params.uploadLocation,
        eventBindObject: __eventBindObject(),
        uploadOptions: api.uploadOptions
    });
}
     
/** 
 * This method should be called to shutdown all Web Capture services gracefully and free all acquired resources
 * (for example, correctly close scanners that web application worked with).
 *
 * Disposed  Web Capture Service could be reinitialized by calling {Atalasoft.Controls.Capture.WebScanning.initialize|initialize}.
 * @memberof Atalasoft.Controls.Capture.WebScanning
 * @param {function=} success - Callback to be called in case of successful completion of the operation.
 * @param {function=} error - Callback to be called in case of any errors during dispose.
 * @returns {undefined}
 */
function dispose(success, error) {
    if (!this.isInitialized()) {

        if (success) {
            success();
        }

        return;
    }

    uploadService.dispose();
    if (__getScanClient()) {
        __getScanClient().__shutdown(function () {
            __setScanClient(null);
            api.LocalFile = null;
            $(window)
            .unbind('beforeunload', __unload)
            .unbind('unload', __unload);
            __disconnectUI();

            if (success) {
                success();
            }
        }, function () {
            __disconnectUI();
            if (error && typeof error === "function") {
                error.apply(null, arguments);
            }
        }, browser.supportsBeaconApi);
    }
}

/** 
 * Checks if Web Scanning control is initialized or not.
 * @memberof Atalasoft.Controls.Capture.WebScanning
 * @returns {boolean} True if Web Scanning control is initialized; false otherwise.
 */
function isInitialized() {
    return !!__getScanClient();
}

/** 
 * Reloads the internal array of the available scanners and optionally passes it to provided callback.
 * @param {function} callback - Callback accepting array of available scanners. If not passed, method is executed synchronously.
 * @memberof Atalasoft.Controls.Capture.WebScanning
 */
function enumerateScanners(callback) {
    return __getScanClient().enumerateScanners.apply(__getScanClient(), arguments);
}

/**
 * Gets the name of WebCapture Service installer.
 * @memberof Atalasoft.Controls.Capture.WebScanning
 * @returns {string} Path to installer file.
 */
function getInstallerFileName() {
    var scanClient = __getScanClient();
    return scanClient ? scanClient.getInstallerFileName() : null;
}

/**
 * Gets WingScan client current session id as an string.
 * @returns {string} session identifier if scan client initialized, otherwise empty string.
 * @memberof Atalasoft.Controls.Capture.WebScanning
 */
function getSessionId() {
    var scanClient = __getScanClient();
    return scanClient ? scanClient.getSessionId() : "";
}

/**
 * Gets WingScan path to persistent storage.
 * @returns {string} path to persistent storage without session id. It presents expaned form of the following path:
 * - on Windows %LOCALAPPDATA%\Kofax\WebCapture\Persistent.
 * - on macOS /Users/&lt;current user&gt;/Library/WebCapture.
 * @memberof Atalasoft.Controls.Capture.WebScanning
 */
function getStoragePath() {
    var scanClient = __getScanClient();
    return scanClient ? scanClient.getPersistentPath() : "";
}

/** 
 * Initiates a scan, as a background process, with the specified scanning options (see _Scanning Options_#scanningOptions). If you pass in nothing,
 * null or undefined, it uses the scanning options stored in Atalasoft.Controls.Capture.WebScanning.scanningOptions.
 * 
 * This method is called (with no parameters) when the user clicks the designated scan button.
 * 
 * Use {@link Atalasoft.Controls.Capture.WebScanning.abortScan|abortScan} to abort a running scan.
 * 
 * When a scan is started it calls the {@link Atalasoft.Controls.Capture.WebScanning#event:onScanStarted|onScanStarted} handler, 
 * and when it ends, normally or not, it always calls the {@link Atalasoft.Controls.Capture.WebScanning#event:onScanCompleted|onScanCompleted} handler.
 * @memberof Atalasoft.Controls.Capture.WebScanning
 * @param {Atalasoft.Controls.Capture.WebScanning.ScanningOptions} options - Scanning options.
 * @returns {undefined}
 */
function scan(options) {
    // If parameter omitted, use default options:
    if (options === undefined) {
        options = api.scanningOptions;
    }
    __getScanClient().scan(options, uploadService.getUploadCallback());
}

/** 
 * Aborts the current background operation in progress, if any. If there is no current background operation, it does nothing.
 * 
 * Background Operations:
 * 
 *  * Scanning (started by {@link Atalasoft.Controls.Capture.WebScanning.scan|scan})
 *  * Importing files (started by {@link Atalasoft.Controls.Capture.WebScanning.importFiles|importFiles})
 *  * Querying supported values (started by {@link Atalasoft.Controls.Capture.WebScanning.getSupportedValues|getSupportedValues})
 *  * Displaying the scanner settings dialog (started by {@link Atalasoft.Controls.Capture.WebScanning.showSettingsDialog|showSettingsDialog})
 *
 * @memberof Atalasoft.Controls.Capture.WebScanning
 * @returns {undefined}
 */
function abortScan() {
    __getScanClient().abortScan();
}

/** 
 * Begin a background process to import files with the specified options. The options object has the same valid properties as the scanningOptions
 * parameter to the scan method above, however, this method ignores options that control the scanner. If options is omitted, *null* or *undefined*,
 * importFiles uses the scanning options stored in {@link Atalasoft.Controls.Capture.WebScanning.scanningOptions|scanningOptions}.
 * 
 * The user is prompted to select one or more files on the local machine, with a standard multi-select File Open dialog. The supported file formats
 * are those listed in File Formats and File Options above, *plus PDF*. If the user cancels the File-Open dialog, this is treated as an import of zero (0)
 * files.
 *
 * The title of the dialog is a localizable string named importFilesPrompt.
 * 
 * The selected files are read image-by-image and processed as if they were being scanned - post-processing options are applied to each image -
 * except for PDF files, which are passed through 'verbatim'.
 * 
 * Files are processed in an order determined by Windows, and *not* necessarily in the order they appear in the File Open dialog nor the order of
 * selection. If order of processing is important, the user must do separate Import operations.
 * 
 * importFiles calls the {@link Atalasoft.Controls.Capture.WebScanning#event:onScanStarted|onScanStarted} handler before doing anything else, 
 * then calls the {@link Atalasoft.Controls.Capture.WebScanning#event:onImageAcquired|onImageAcquired} handler with each successfully
 * imported image or PDF file, and finally calls the {@link Atalasoft.Controls.Capture.WebScanning#event:onScanCompleted|onScanCompleted}
 * handler when finished, whether successful or not.
 * 
 * The eventObj parameter to onScanCompleted has a property success that tells you if the import completed successfully. See the
 * {@link Atalasoft.Controls.Capture.WebScanning#event:onImageAcquired|onImageAcquired} event for details of how PDF files are imported.
 *
 * If the user attempts to import any files of unsupported type (such as .doc or .psd) the error unsupportedFileFormat is fired to the
 * {@link Atalasoft.Controls.Capture.WebScanning#event:onScanError|onScanError} handler and the import proceeds, completely ignoring all those files.
 * 
 * If a file of supported type cannot be imported (e.g. corrupted data, access error), an appropriate error is fired to the 
 * {@link Atalasoft.Controls.Capture.WebScanning#event:onScanError|onScanError} handler and the import process is aborted i.e. completes unsuccessfully.
 * 
 * The images and files imported by importFiles are not retained by the control or uploaded automatically to the server.
 * 
 * This method is called (with no parameters) when the user clicks the designated import button, if any.
 * @memberof Atalasoft.Controls.Capture.WebScanning
 * @param {ScanningOptions} options - Scanning options.
 * @returns {undefined}
 */
function importFiles(options) {
    // If parameter omitted, use default options:
    if (options === undefined) {
        options = api.scanningOptions;
    }
    __getScanClient().importFiles(options);
}

/** 
 * Starts a background operation to display the settings-only dialog (custom user interface) of the scanner, if the scanner supports this feature.
 * 
 * **Note: no scanner driver provides settings dialog under macOS**
 * 
 * This shows a version of the scanner's UI that is only for choosing settings, without a Scan button.
 * 
 * When the operation completes, successfully or not, callback(status) is called, where status is an object. status.complete is true if the dialog was
 * successfully displayed and closed by the user, false if the dialog could not be displayed or the operation was aborted.
 * 
 * If anything goes wrong, the onScanError handler will be called, asynchronously, with details.
 * 
 * The scanner used is:
 *  * *options.scanner* if that exists and is a string.
 *  * Otherwise {@link Atalasoft.Controls.Capture.WebScanning.scanningOptions#scanner|scanningOptions.scanner} if it exists and is a string.
 *  * Otherwise the scanner most recently selected in the UI.
 *  * Otherwise the default scanner, as reported by scanner device manager (TWAIN on Windows or ImageCapture on macOS).
 *
 * @memberof Atalasoft.Controls.Capture.WebScanning
 * @param {ScanningOptions} options - Scanning options.
 * @param {notificationCallback} callback - Completion callback.
 * @returns {undefined}
 */
function showSettingsDialog(options, callback) {
    if (!options) {
        options = api.scanningOptions;
    }
    __getScanClient().showSettingsDialog(options, callback);
}

/**
 * Represents the range of allowed scanner values.
 * @typedef {Object} ScannerValuesRange
 * @property {number} min - Minimum allowed value.
 * @property {number} max - Maximum allowed value.
 * @property {number} step - Increment
 *
 */

/**
 * Represents "Image Address" scanner feature state.
 *
 * Image address is used for scanned pages indexing.
 * At the moment "Image Address" is supported only by couple scanners in Kodak product line and not supported by Web Capture Service for macOS.
 *
 * @typedef {Object} ImageAddress
 *
 * @property {boolean} enabled - indicates whether image address is supported by scanner.
 * @property {string} template - represents image address generation template.
 * @property {string} value - current "Image Address" value.
 */
/**
 * Represents supported imprinters configuration.
 * 
 * Scanners intended for document imaging sometimes include accessories that let the scanner print data on the documents as it scans them.
 * 
 * @typedef {Object} SupportedImprinters
 * 
 * @property {string} printerId - currently selected imprinter.
 * @property {number[]} mode - available imprinters.
 **/
/**
 * Callback signature for {@link @Atalasoft.Controls.Capture.WebScanning.getSupportedValues}
 *
 * When done, it invokes callback with the ranges or list of the allowed values for the corresponding {@link Atalasoft.Controls.Capture.WebScanning.ScanningOptions | ScanningOptions} parameters.
 * @callback getSupportedValuesCallback
 * @param {Object} supportedValues supported values object.
 * @param {ScannerValuesRange} supportedValues.brightness - allowed values for {@link Atalasoft.Controls.Capture.WebScanning.ScanningOptions.brightness|brightness} property.
 * @param {ScannerValuesRange} supportedValues.contrast - allowed values for {@link Atalasoft.Controls.Capture.WebScanning.ScanningOptions.contrast|contrast} property.
 * @param {ScannerValuesRange} supportedValues.dpi - allowed values for {@link Atalasoft.Controls.Capture.WebScanning.ScanningOptions.dpi|dpi} property.
 * @param {ScannerValuesRange} supportedValues.threshold - allowed values for {@link Atalasoft.Controls.Capture.WebScanning.ScanningOptions.threshold|threshold} property.
 * @param {number[]} supportedValues.duplex - allowed values for {@link Atalasoft.Controls.Capture.WebScanning.ScanningOptions.duplex|duplex} property.
 * @param {number[]} supportedValues.feeder - allowed values for {@link Atalasoft.Controls.Capture.WebScanning.ScanningOptions.feeder|feeder} property.
 * @param {number[]} supportedValues.orientation - allowed values for {@link Atalasoft.Controls.Capture.WebScanning.ScanningOptions.orientation|orientation} property.
 * @param {number[]} supportedValues.paperSize - allowed values for {@link Atalasoft.Controls.Capture.WebScanning.ScanningOptions.paperSize|paperSize} property.
 * @param {boolean[]} supportedValues.patchCodes - allowed values for {@link Atalasoft.Controls.Capture.WebScanning.ScanningOptions.patchCodes|patchCodes} property.
 * @param {number[]} supportedValues.pixelType - allowed values for {@link Atalasoft.Controls.Capture.WebScanning.ScanningOptions.pixelType|pixelType} property.
 * @param {boolean[]} supportedValues.showProgress - allowed values for {@link Atalasoft.Controls.Capture.WebScanning.ScanningOptions.showProgress|showProgress} property.
 * @param {boolean[]} supportedValues.showScannerUI - allowed values for {@link Atalasoft.Controls.Capture.WebScanning.ScanningOptions.showScannerUI|showScannerUI} property.
 * @param {ImageAddress} supportedValues.imageAddress - if supported by scanner, returns current state of "Image Address" configuration.
 * @param {SupportedImprinters} supportedValues.imprintersConfig - if supported by scanner, returns supported imprinter configuration.
 */

/** 
 * Query the scanner for supported values of scanning parameters.
 *
 * Errors during this operation will normally result in an asynchronous call to the {@link Atalasoft.Controls.Capture.WebScanning#event:onScanError|onScanError} handler. If anything goes wrong, it invokes callback({ }).
 *
 * Each property in the object has the name of a Atalasoft WingScan scanning-parameter property e.g. pixelType, dpi, and so on. Each property value is one of the following:
 * - A enumeration, represented by an array of valid values, for example [0, 1, 3].
 * - A range represented by an object with min, max and step properties, for example { min: 50, max: 2400, step: 1 }.
 *
 * _**Note**_,
 *
 * - Note A few models of scanner may provide incorrect or misleading information through this query, such as a flatbed scanner that lists the value 1 for feeder, implying that you can scan from its (nonexistent) ADF.
 *
 * - Querying the scanner's capabilities requires opening the scanner, which may fail (scanner offline, unplugged, etc.) which may display an error box to the user. 
 * For friendly user interface design, make 'choose your scanner' or 'change scanner' into a separate dialog or screen, and call getSupportedValues when the user OK's a new scanner choice.
 *
 * - Completing the getSupportedValues operation can take several seconds.
 *
 * Code sample(see, {@link getSupportedValuesCallback} for complete list of available properties):
 * ```javascript
 * Atalasoft.Controls.Capture.WebScanning.getSupportedValues(null, function(values){
 *   // if successful might call gotValues with an object like this:
 *   // {
 *   //     pixelType: [0, 1, 2],
 *   //     dpi: {min: 50, max: 1200, step: 1},
 *   //     duplex: [0, 1],
 *   //     feeder: [0, 1],
 *   //     paperSize: [0, 1, 2, 4, 7, 9],
 *   //     orientation: [0, 1]
 *   // }
 *   });
 * ```
 *
 * @memberof Atalasoft.Controls.Capture.WebScanning
 * @param {ScanningOptions} [options] - Scanning options which will be applied to scanner before getting supported values.
 *
 * In scanners API (TWAIN on Windows or Image Capture on macOS) not all capabilities dependencies are documented, so supported values response could differ depending on scanner state.
 * Setting scanning options before querying scanner allows to start from some predictable default configuration or properly handle changes in configuration by setting parameters that should have exact values.
 *
 * @param {getSupportedValuesCallback} callback - Completion callback accepting available scanner options.
 */
function getSupportedValues(options, callback) {
    // query the selected scanner and return an array describing the supported values
    // of scanningOptions for the scanner
    if (!options) {
        options = api.scanningOptions;
    }
    __getScanClient().getSupportedValues(options, callback);
}


/**
 * Represents imprinter configuration.
 * 
 * Contains a set of properties that allow to configure desired imprinter device.
 * 
 * @typedef {Object} ImprinterConfig
 * 
 * @property {string} printerId - imprinter identifier. Can be on of the values described by {@link Atalasoft.Controls.Capture.ImprinterTypes|ImprinterTypes}.
 * @property {boolean} enabled - a value indicating whether the imprinter is enabled.
 * @property {number} mode - specifies the imprinter mode.
 * 
 * #### Available values
 * 
 * | Value | Description |
 * | ---------------| ---------------- |
 * | 0 | single line consisting of the value of string property |
 * | 1 | all the strings in the string property, printed one per line |
 * | 2 | a value of string property followed by the printer's current counter value, followed by the value of suffix property |
 * 
 * @property {string} string - string to be used as a string component.
 * @property {string} suffix - string to be used as a suffix.
 * @property {number} indexStart - starting number for imprinter index.
 * @property {number} indexStep - increment between printer index values.
 * @property {number} indexDigits - number of digits in imprinter index.
 * @property {Atalasoft.Controls.Capture.MeasurementUnit} units=Inches - determines the unit of measure for imprinter vertical offset value.
 * @property {number} verticalOffset - Y-offset for imprinter text.
 * @property {number} rotation=0 - Specify the amount of in-place character rotation for the next acquisition. The rotation is in degrees, and moves clockwise.
 *                                      Zero means normal in relation to the leading edge for a document feeder.
 * @property {Atalasoft.Controls.Capture.PrinterFontStyle} fontStyle=Normal - specifies which printer font styles to be used during the next acquisition.
 **/
/**
 * Represents scanner's imprinter devices configuration.
 * 
 * @typedef {Object} ImprintersConfig
 * 
 * @property {Atalasoft.Controls.Capture.ImprinterTypes} currentImprinterId - default scanner's imprinter device.
 * @property {number} currentImprinterIndex - index of default scanner's imprinter device in imprinters array.
 * @property {ImprinterConfig[]} imprinters - list of supported imprinter devices.
 */
/**
 * Callback signature for {@link @Atalasoft.Controls.Capture.WebScanning.getCurrentValues}
 *
 * When done, it invokes callback with current scan settings.
 * 
 * @callback getCurrentValuesCallback
 * @param {ImprintersConfig} currentValuesValues.imprinters - if supported by scanner, returns supported imprinter configuration.
 * @param {number} currentValuesValues.autoDiscardBlankPages - if supported by scanner, returns a value indicating whether the scanner is supposed to discard blank pages.
 *
 * #### Available values
 *
 * | Value | Description |
 * | ---------------| ---------------- |
 * | -2 | blank pages discarding is disabled |
 * | -1 | the scanner decides whether the page is blank or not and discard as appropriate |
 * | 0..2^31-1 | the value is used to specify the byte size cutoff point to identify which images are to be discarded. If the size of the image is less than or equal to this value, then it will be discarded. If the size of the image is greater than this value, then it will be kept so that it can be transferred to the Application. |
 *
 */
/** 
 * Query the scanner for current values of scanning parameters.
 *
 * Errors during this operation will normally result in an asynchronous call to the {@link Atalasoft.Controls.Capture.WebScanning#event:onScanError|onScanError} handler. If anything goes wrong, it invokes callback({ }).
 *
 * @memberof Atalasoft.Controls.Capture.WebScanning
 * @param {Atalasoft.Controls.Capture.WebScanning.ScanningOptions} [options] - Scanning options which will be applied to scanner before getting current values.
 *
 * @param {getCurrentValuesCallback} callback - Completion callback accepting current scanner options.
 */
function getCurrentValues(options, callback) {
    // query the selected scanner and return an array describing the supported values
    // of scanningOptions for the scanner
    if (!options) {
        options = api.scanningOptions;
    }
    __getScanClient().getCurrentValues(options, callback);
}


/** 
 * @memberof Atalasoft.Controls.Capture.WebScanning
 * @deprecated Use {@link Atalasoft.Controls.Capture.WebScanning.LocalFile.setEncryptionKey} instead. 
 */
function setSymmetricEncryptionKey(key) {
    logger.deprecate('Atalasoft.Controls.Capture.WebScanning.setSymmetricEncryptionKey', 'Atalasoft.Controls.Capture.WebScanning.LocalFile.setEncryptionKey');
    __getScanClient().setSymmetricEncryptionKey(key);
}

/** 
 * @memberof Atalasoft.Controls.Capture.WebScanning
 * @deprecated Use {@link Atalasoft.Controls.Capture.WebScanning.LocalFile.fromBase64String} instead. 
 */
function saveBase64ToEncryptedLocalFile(bs64) {
    logger.deprecate('Atalasoft.Controls.Capture.WebScanning.saveBase64ToEncryptedLocalFile', 'Atalasoft.Controls.Capture.WebScanning.LocalFile.fromBase64String');
    return __getScanClient().saveBase64ToEncryptedLocalFile(bs64);
}

/** 
 * @memberof Atalasoft.Controls.Capture.WebScanning
 * @deprecated Use {@link Atalasoft.Controls.Capture.WebScanning.LocalFile.asBase64String} instead. 
 */
function encryptedLocalFileAsBase64String(fid, fmt, opts) {
    logger.deprecate('Atalasoft.Controls.Capture.WebScanning.encryptedLocalFileAsBase64String', 'Atalasoft.Controls.Capture.WebScanning.LocalFile.asBase64String');
    return __getScanClient().encryptedLocalFileAsBase64String(fid, fmt, opts);
}

/** 
 * @memberof Atalasoft.Controls.Capture.WebScanning
 * @deprecated Use {@link Atalasoft.Controls.Capture.WebScanning.LocalFile.remove} instead. 
 */
function deleteLocalFile(fid) {
    logger.deprecate('Atalasoft.Controls.Capture.WebScanning.deleteLocalFile', 'Atalasoft.Controls.Capture.WebScanning.LocalFile.remove');
    __getScanClient().deleteLocalFile(fid);
}

/** 
 * @memberof Atalasoft.Controls.Capture.WebScanning
 * @deprecated Use {@link Atalasoft.Controls.Capture.WebScanning.LocalFile.list} instead.
 */
function listLocalFiles() {
    logger.deprecate('Atalasoft.Controls.Capture.WebScanning.listLocalFiles', 'Atalasoft.Controls.Capture.WebScanning.LocalFile.list');
    return __getScanClient().listLocalFiles();
}

/** 
 * Set's the barcode license.
 *
 * If license is not set default barcode engine is used. It's possible to enable Honeywell Omniplanar/SwiftDecoder engine, but license key should be purchased separately. 
 * Applicable for Web Capture Service for Windows only.
 * @memberof Atalasoft.Controls.Capture.WebScanning
 * @returns {undefined}
 */
function setBarcodeLicense(key) {
    __getScanClient().setBarcodeLicense(key);
}

/** 
 * This method returns a string, containing the current scanning options stored in {@link Atalasoft.Controls.Capture.WebScanning.scanningOptions|scanningOptions}.
 * The string is in JSON format, but you should not rely on that.
 * @memberof Atalasoft.Controls.Capture.WebScanning
 * @returns {string}
 */
function getProfile(s) {
    // Convert scanning options to JSON string and return.
    if (s === undefined) {
        s = api.scanningOptions;
    }
    return JSON.stringify(s);
}

/** 
 * This method loads the scanning options ({@link Atalasoft.Controls.Capture.WebScanning.scanningOptions|scanningOptions}) from a 
 * string previously produced by {@link Atalasoft.Controls.Capture.WebScanning.getProfile|getProfile}.
 * @memberof Atalasoft.Controls.Capture.WebScanning
 * @returns {undefined}
 */
function setProfile(p) {
    // Set the scanning options from a profile (which is a JSON string)
    api.scanningOptions = JSON.parse(p);
}

/** 
 * Gets components of WingScan version as an array of numbers.
 * @memberof Atalasoft.Controls.Capture.WebScanning
 * @returns {number[]} WingScan version components.
 */
function getVersion() {
    var scanClient = __getScanClient();
    return scanClient ? scanClient.getVersion() : null;
}

/** 
* Gets the NetBIOS name of the local scan station.
* @memberof Atalasoft.Controls.Capture.WebScanning
* @returns {string} NetBIOS name of the local scan station is scan control is initialized; undefined otherwise.
*/
function getScanStationName() {
    var scanClient = __getScanClient();
    return isInitialized() && scanClient ? scanClient.getScanStationName() : null;
}

function __localizeErrors(errors, localization) {
    if (localization) {
        // translate error strings using the localization table
        for (var id in errors) {
            if (errors.hasOwnProperty(id)) {
                if (typeof errors[id] === 'string' && id in localization) {
                    errors[id] = localization[id];
                }
            }
        }
    }
}

function __getLicense() {
    $.getJSON(
            _params.handlerUrl + '?cmd=getLicense', {},
            function (data) { __gotLicense(data); }
        )
        .fail(function (jqXhr) {
            errorsManager.report(
                _params.onScanError, errorsManager.licensingError, jqXhr);
        });
}

function __gotLicense(lic) {
    __getScanClient().setLicense(lic, function () {
        __getScanClient().enumerateScanners(function () {
            __connectGui();
            if (_params.onScanClientReady && __getScanClient().isSupportedBrowser) {
                _params.onScanClientReady();
            }
        });
    });
}

function __onScanClientReady() {
    api.isSupportedBrowser = __getScanClient().isSupportedBrowser;
    if (__getScanClient().isSupportedBrowser) {

        /**
         * Callback signature for API methods retrieving image data from local file.
         * @callback imageDataCallback
         * @param {string} data - Base64 representation of the image data.
         */

        /**
         * Callback signature for API methods that saving data to local file.
         *
         * @callback saveLocalFileCallback
         * @param {string} fileId - Identifier of the created local file.
         */

        /** @lends Atalasoft.Controls.Capture.WebScanning.LocalFile */
        api.LocalFile = {
            /** 
             * Sets the encryption key for subsequent encrypted local file load/saves. The basis is an arbitrary string, 
             * which is used to generate the symmetric encryption key.
             * 
             * The basis is immediately discarded, and the generated key is moved into the Windows secure cryptographic storage.
             * 
             * **macOS version of Web Capture Service does not use encryption key**
             *
             * @param {string} key - Basis for the encryption key.
             * @param {function=} callback - Completion callback function.
             * @returns {undefined}
             */
            setEncryptionKey: function (key, callback) { __getScanClient().setSymmetricEncryptionKey(key, callback); },

            /** 
             * Saves the specified base64-encoded binary data to an encrypted local file, and returns a unique file-identifier for that local file.
             *
             * @param {string} base64 - Base64 data to save.
             * @param {saveLocalFileCallback} [callback] - Completion callback function.
             * @returns {string|undefined} created local file identifier if executed synchronously; `undefined` otherwise.
             */
            fromBase64String: function (base64, callback) { return __getScanClient().saveBase64ToEncryptedLocalFile(base64, callback); },

            /** 
             * Decrypts a locally-saved file and returns it as a base64-encoded string.
             * 
             * If format is specified, returns the data in the specified file format. If format is absent or same as the one used to create encrypted local file, data is returned without un-compression.
             *
             * If no encryption key has been set, throws an exception.
             *
             * @param {string} fid - Local file identifier.
             * @param {string} [format] - File format to use.
             * @param {DeliverablesConfig} [options] - Additional file options.
             * @param {imageDataCallback} [callback] - Completion callback function. If not passed, method is executed synchronously.
             * @returns {string|undefined} Image data if executed synchronously; `undefined` otherwise.
             */
            asBase64String: function (fid, format, options, callback) { return __getScanClient().encryptedLocalFileAsBase64String.apply(__getScanClient(), arguments); },

            /**
             * Callback signature for {@link Atalasoft.Controls.Capture.WebScanning.LocalFile.splitToFiles| splitToFiles} method.
             * @callback splitToFilesCallback
             * @param {string[]} chunkFiles - Array of split chunks identifiers.
             */
            /**
             * Splits the existing encrypted local file to a set of blobs of the specified size. Each blobs is stored as new encrypted local file.
             *
             * Existing local file is unencrypted and split with no regards to content format, i.e. each chunk is a blob part of the original file, and don't have any application meaning itself until those chunks are combined back.
             *
             * The purpose of such feature is to allow big files, mostly imported PDF or eDocs to pass through 32bit browser and be uploaded to the destination web server.
             * So each chunk could be uploaded individually and then they should be combined and stored according to application logic.
             *
             * @param {string} fid - Local file identifier.
             * @param {Object} [options] - File split options.
             * @param {number} options.size - Size of the individual chunk in bytes.
             * @param {boolean} options.removeSource - Flag indicating whether slitted file should be deleted.
             * @param {splitToFilesCallback} callback - Callback function that accepts chunks identifiers.
             */
            splitToFiles: function (fid, options, callback) { return __getScanClient().splitToFiles.apply(__getScanClient(), arguments); },

            /** 
             * Immediately deletes a local file and any data associated with it. This is irreversible and non-recoverable.
             *
             * @param {string} fid - Local file identifier.
             * @param {function=} callback - Completion callback function.
             * @returns {undefined}
             */
            remove: function (fid, callback) { __getScanClient().deleteLocalFile(fid, callback); },
            /** 
             * Returns an array of the identifiers of all the existing saved local files associated with this instance of WingScan.
             *
             * @param {function=} [callback] - Completion callback function. Array of encrypted local file identifiers is passed as the parameter.
             * @returns {string[]|undefined} Array of encrypted local file identifiers if executed synchronously; `undefined` otherwise.
             */
            list: function (callback) { return __getScanClient().listLocalFiles(callback); },

            /** 
             * Immediately deletes all local files associated with (created by) this instance of WingScan. 
             * Has no effect on local files created in other instances of the client application, or files created by previous incarnations of WingScan.
             *
             * @param {function=} callback - Completion callback function.
             * @returns {undefined}
             */
            removeAll: function (callback) { __getScanClient().removeAll(callback); },
            /** 
             * Immediately deletes all local files written more than *hours* ago. Deletes ALL local files meeting the age criterion, 
             * no matter how or when they were created, or by which instance of WingScan. Obviously, use with caution.
             *
             * @param {number} hours - Age of local files, in hours.
             * @param {function=} callback - Completion callback function.
             * @returns {undefined}
             */
            globalPurgeByAge: function (hours, callback) { __getScanClient().globalPurgeByAge(hours, callback); }
        };
    }
    if (_params.license) {
        __gotLicense(_params.license);
        delete _params.license;
    } else if (__getScanClient().isSupportedBrowser) {
        __getLicense();
    }
}

function __eventBindObject() {
    return $('body');
}

function __connectGui() {
    __connectScanButtons(__getScanClient().scanners, $('.atala-scan-button'));
    __connectImportButtons($('.atala-local-file-import-button'));
    __connectScannerListElement(__getScanClient().scanners, __getScanClient().defaultScanner, $('.atala-scanner-list'));
}

function __disconnectUI() {
    $('.atala-scan-button, .atala-local-file-import-button').each(function (i, btn) {
        $(btn).off('click').attr('disabled', true);
    });

    $('.atala-scanner-list').each(function (i, list) {
        $(this).attr('disabled', true).empty();
        list.onchange = null;
    });
}

function __connectScanButtons(scanners, scanButtons) {
    if (scanners.length > 0) {
        scanButtons.click(function () { scan(); });
        scanButtons.removeAttr('disabled');
    } else {
        scanButtons.attr('disabled', true);
    }
}

function __connectScannerListElement(scanners, defaultScanner, scannerListElements) {
    // scannerListElements is assumed to be (the return from) a jquery selector i.e. a 'wrapped set'.
    if (scannerListElements.length > 0) {
        var scannerList = scannerListElements[0];
        // There is a scanner-list control, load it up.
        scannerList.length = 0;     // clear the list control
        if (scanners.length > 0) {
            // there are scanners!
            for (var i = 0; i < scanners.length; i++) {
                var elt = document.createElement('option');
                elt.text = scanners[i];
                elt.value = scanners[i];
                scannerList.add(elt);
                if (elt.text === defaultScanner) {
                    // this is the default scanner, make it the selection:
                    scannerList.selectedIndex = scannerList.length - 1;
                }
            }
            // When selection changes, tell the scanClient:
            scannerList.onchange = function () { __getScanClient().onScannerSelected(scannerList.options[scannerList.selectedIndex].value); };
            scannerListElements.removeAttr('disabled');
        } else {
            // There are no scanners - either none installed, unsupported browser, etc.
            // Disable all scanner lists
            scannerListElements.attr('disabled', true);
        }
    } else {
        // if they don't want a select box, then choose the system default
        __getScanClient().onScannerSelected(defaultScanner);
    }
}

function __connectImportButtons(importButtons) {
    importButtons.click(function () { importFiles(); });
    importButtons.removeAttr('disabled');
}


function __unload() {
    if (__getScanClient()) {

        //New API call covers scan abort and worker shutdown in one call
        if (!browser.supportsBeaconApi) {
            // Make a best effort to terminate any ongoing scan or import:
            __getScanClient().abortScan();
        }

        // Call shutdown handler that was passed to us, if any:
        if (_params.onShutdown) {
            try {
                // Notify the application we are shutting down:
                _params.onShutdown();
            } catch (e) {
            }
        }

        // Finally, let the scan object clean up:
        __getScanClient().__shutdown(undefined, undefined, browser.supportsBeaconApi);

    }
}

function __getScanClient() {
    return api._scanClient;
}
function __setScanClient(value) {
    api._scanClient = value;
}

$.extend(api, {
    initialize: initialize,
    isInitialized: isInitialized,
    dispose: dispose,
    enumerateScanners: enumerateScanners,
    getSessionId: getSessionId,
    getStoragePath: getStoragePath,
    scan: scan,
    abortScan: abortScan,
    importFiles: importFiles,
    showSettingsDialog: showSettingsDialog,
    getSupportedValues: getSupportedValues,
    getCurrentValues: getCurrentValues,
    setBarcodeLicense: setBarcodeLicense,
    getProfile: getProfile,
    setProfile: setProfile,
    getVersion: getVersion,
    getScanStationName: getScanStationName,
    // deprecate.
    setSymmetricEncryptionKey: setSymmetricEncryptionKey,
    saveBase64ToEncryptedLocalFile: saveBase64ToEncryptedLocalFile,
    encryptedLocalFileAsBase64String: encryptedLocalFileAsBase64String,
    deleteLocalFile: deleteLocalFile,
    listLocalFiles: listLocalFiles,
    getJSVersion: getJSVersion,
    getInstallerFileName: getInstallerFileName
});

module.exports = api;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
﻿// JavaScript include for web-based scanning.
// Copyright 2011-2014 by Atalasoft, a Kofax Company.
// All rights reserved.
//
// 2012.08.29   spike       added localization support, manually merged from KFS 1.117.4
// 2013.11.07   spike       IE 11 sniffing
// 2014.03.11   spike       replaced jQuery.browser with our own browser detection code (TFS Bug 315341)
// 2014.03.11   spike       introduced Atalasoft.Utils.versionLess, for comparing versions
// 2014.04.11   spike       removed trailing comma that upsets IE7 (TFS 324113)
// 2014.04.23   spike       introduced uploadOptions with .extraParts & .formData


//define([], function() {
var browser = __webpack_require__(5),
    clientVersion = __webpack_require__(4),
    errorsManager = __webpack_require__(2),
    eztwainConnector = __webpack_require__(13);

// #region Scanner Client Factory

//////////////////////////////////////////////////////////////////////////
/// EZTwain implementation
/// Used in IE and all NPAPI-plugin supporting browsers

    var scanClientFactory = {
        // localizable strings used only by this javascript module.
        // None of these are error messages, they are only used to create
        // the 'note' or 'details' strings that accompany errors.
        _localization: {
            notWindows: "Platform is not Windows or macOS: ",
            ieVersion: "IE version not supported: ",
            notSupported: "Not currently supported: ",
            pluginVersion: "Plugin is version: ",
            minVersionNeeded: "minimum version needed: "
        },

        getScanClient: function() {
            // Scanning is supported only on Windows platform:
            if (navigator.platform.substring(0, 3) !== 'Win' && navigator.platform.substring(0, 3) !== 'Mac' ) {
                NullScanner._badBrowser = this._localization.notWindows + navigator.platform;
                return NullScanner;
            }

            // Is it IE?
            if (browser.msie) {
                // Yes, must be IE 11 or later
                if (browser.version < 11) {
                    // IE but too old - not supported.
                    NullScanner._badBrowser = this._localization.ieVersion + browser.version;
                    return NullScanner;
                }
            }

            if (browser.msie || browser.firefox || browser.chrome /* || browser.opera */|| browser.safari ) {
                return eztwainConnector;
            } else {
                // Unknown or unsupported browser.
                NullScanner._badBrowser = this._localization.notSupported + (browser.name || navigator.userAgent);
                return NullScanner;
            }
        },
    };

// #endregion Scanner Client Factory

// #region NullScanner stub
    //////////////////////////////////////////////////////////////////////////
    /// NullScanner implementation (used when scanning is not supported).
    var NullScanner = {
        abortScan: function() {},
        deleteLocalFile: function(fid) {},
        encryptedLocalFileAsBase64String: function(fid, fmt, opts) { return null; },
        getSupportedValues: function(options, callback) { callback(null); },
        globalPurgeByAge: function(hours) {},
        importFiles: function(options) {},
        initialize: function(params) {
            if (params.onScanClientReady) {
                params.onScanClientReady();
            }
            errorsManager.report(params.onScanError, errorsManager.badBrowser, this._badBrowser);
        },
        isInstalled: function() { return true; },
        isAppropriateForClient: function() { return true; },
        listLocalFiles: function() { return null; },
        removeAll: function() {},
        saveBase64ToEncryptedLocalFile: function(bs64) { return null; },
        scan: function(scanningOptions, uploadFuncton) {},
        setBarcodeLicense: function(key) {},
        setLicense: function(lic) { return false; },
        setSymmetricEncryptionKey: function (key) { },
        getVersion: function () { return clientVersion.slice(); },
        getScanStationName: function () { return undefined; },
        showSettingsDialog: function(options, callback) {
            callback({ complete: false });
        },

        __shutdown: function(success, error) {},

        scanners: [],
        defaultScanner: '',
        isSupportedBrowser: false,
        onScannerSelected: function(scanner) {},

        _badBrowser: ""
    };

    // #endregion NullScanner stub
//});

module.exports = scanClientFactory;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
﻿

var $ = __webpack_require__(0),
    logger = __webpack_require__(1),
    clientVersion = __webpack_require__(4),
    errorsManager = __webpack_require__(2),
    connectionService = __webpack_require__(3),
    ImageType = __webpack_require__(14),
    LocalFileType = __webpack_require__(16),
    Enums = __webpack_require__(7),
    PixelTypeEnum = __webpack_require__(8),
    ScanApiType = __webpack_require__(17),
    browser = __webpack_require__(5);

// #region webTwainConnector
var webTwain = {
    SessionId: 0,
    HostRunsAsService: false,
    PersistentPath: "",
    ReadyState: 1,
    TwainAvailable: false,
    InstalledSources: [],
    DefaultSourceDevice: '',

    /**
     * Various options that control scanning operations.
     * @atalaconfig
     * @alias ScanningOptions
     * @memberof Atalasoft.Controls.Capture.WebScanning
     */
    scanningOptions: {

        /**
         * @property {string} scanner - Specifies the name of the scanner to use.
         *
         * **Default value**: The last scanner selected in the scanner list control. If no scanner has been selected or there is no designated scanner list control, the user's default scanner is used.
         *
         * This option is ignored by {@link Atalasoft.Controls.Capture.WebScanning.importFiles|importFiles}.
         */
        scanner: null,

        /**
         * @property {boolean} [applyVRS=true] - Enable or disable VRS post-processing in general.
         *
         * If you specify applyVRS: false, VRS is not used for any post-processing.
         *
         * If you specify applyVRS: true then the following options are set by default (i.e. if you do not specify them)
         *
         * | Property | Value |
         * | -------- | ----  |
         * | **pixelType** | 2 (Color) |
         * | **resultPixelType** | 0 (B&W) |
         * | **deskew** | true |
         * | **autoRotate** | true |
         * | **discardBlankPages** | false |
         */
         applyVRS: true,

        /**
         * @property {string} evrsSettings - Settings can be loaded into EVRS for use in post-processing scanned images,
         * by adding the property evrsSettings as a scanning option. The value of this property, if present, must be a string
         * containing a valid XML-style EVRS operation string.
         *
         * This option has effect only when **applyVRS** is true. If **applyVRS** is false the **evrsSettings** string is ignored.
         *
         * This option can be used to set the effective value of any EVRS parameter, overriding any default value or value normally used by
         * WingScan/WebCapture.
         *
         * Any command/operation included in this string will cause EVRS to ignore any competing scanning options, as described in the following table:
         *
         * | EVRS command | Ignored options |
         * | ----- | ------- |
         * | Do90DegreeRotation | autoRotate |
         * | DoBarcodeDetection | patchCodes |
         * | DoBinarization | resultPixelType |
         * | DoBlankPageDetection | discardBlankPages |
         * | DoColorDetection | resultPixelType |
         * | DoCropCorrection | autoCrop |
         * | DoEnhancedBinarization | resultPixelType |
         * | DoGrayOutput | resultPixelType |
         * | DoSkewCorrectionAlt | deskew |
         * | DoSkewCorrectionPage | deskew |
         *
         * Here is an example of setting EVRS options:
         * ```javascript
         * Atalasoft.Controls.Capture.WebScanning.initialize({
         *   // ...
         *   scanningOptions: { evrsSettings:
         *     '_Do90DegreeRotation_2' +
         *     '_DoGrayOutput_' +
         *     '_LoadSetting_<PropertyName="CBinarize.Do_Adv_Clarity.Bool" Value="1" Comment="DEFAULT 0"/>'
         *   },
         *   // ...
         * }
         * ```
         */
        evrsSettings: null,

        /**
         * @property {number} [brightness=0] - This scanning option specifies how the brightness of scanned images should be adjusted by the scanner.
         *
         *  **Note**:
         *  This option is not supported by Web Capture Service for macOS.
         *
         * Following TWAIN convention, the value range is -1000 to +1000.
         *
         * | Value | Meaning |
         * | ----- | ------- |
         * | -1000 | reduce brightness as much as possible |
         * | -1000 < n < 0 | reduce brightness |
         * | 0 | do not adjust brightness |
         * | 0 < n < 1000 | increase brightness |
         * | +1000 | increase brightness as much as possible |
         *
         * **Notes**:
         *  1. Not all scanners support this.
         *  1. For some scanners, not all values are distinguished: -500 may have the same effect as -501 or -499.
         *  1. Some scanners will ignore this value when scanning B&W.
         *  1. This option is ignored during  {@link Atalasoft.Controls.Capture.WebScanning.importFiles|importFiles}.
         */
        brightness: 0,

        /**
         * @property {number} [contrast=0] - This scanning option specifies how the contrast of scanned images should be adjusted by the scanner.
         *
         *  **Note**:
         *  This option is not supported by Web Capture Service for macOS.
         *
         * Following TWAIN convention, the value range is -1000 to +1000.
         *
         * | Value | Meaning |
         * | ----- | ------- |
         * | -1000 | reduce contrast as much as possible |
         * | -1000 < n < 0 | reduce contrast |
         * | 0 | do not adjust contrast |
         * | 0 < n < 1000 | increase contrast |
         * | +1000 | increase contrast as much as possible |
         *
         * **Notes**:
         *  1. Not all scanners support this.
         *  1. For some scanners, not all values are distinguished: -500 may have the same effect as -501 or -499.
         *  1. Some scanners will ignore this value when scanning B&W.
         *  1. This option is ignored during  {@link Atalasoft.Controls.Capture.WebScanning.importFiles|importFiles}.
         *
         */
        contrast: 0,

        /**
         *  @property {number} threshold=-1 - This scanning option specifies the threshold to be used when scanning to B&W (bitonal) images.
         *
         *  **Note**:
         *  This option is not supported by Web Capture Service for macOS.
         *
         * The value range is -1 to 255. The threshold value T is applied roughly as follows:
         *
         * A value of -1 means 'let the scanner choose the threshold'
         *
         * Imagine that each pixel of the document is measured as 8-bit grayscale to give a value V, with 0=black and 255=white.
         * In the returned bitonal image, that pixel is returned as white if V > T, and as black if V < T.
         * If V == T, it may be returned as black or as white, depending on the scanner.
         *
         * **Notes**:
         *  1. Almost all scanners support this.
         *  2. This setting only has an effect when scanning with **pixelType** = 0 (B&W).
         */
        threshold: -1,

        /**
         * @property {boolean} showScannerUI=false - Show (true) or hide (false) the scanner's user interface during scanning.
         *
         *  **Note**:
         *  This option is not supported by Web Capture Service for macOS.
         *
         * This option is ignored by {@link Atalasoft.Controls.Capture.WebScanning.importFiles|importFiles}.
         */
        showScannerUI: false,

        /**
         * @property {boolean} showScannerUIWithCurrentSettings=false - Show (true) or hide (false) the scanner's user interface during scanning.
         * If this property is used instead of {@link Atalasoft.Controls.Capture.WebScanning.showScannerUI|showScannerUI} WebCapture Service does not set any scanner related settings 
         * to the scanner before show the scanner's user interface.
         *
         *  **Note**:
         *  This option is not supported by Web Capture Service for macOS.
         *
         * This option is ignored by {@link Atalasoft.Controls.Capture.WebScanning.importFiles|importFiles}.
         */
        showScannerUIWithCurrentSettings: false,

        /**
         * @property {boolean} [showProgress=false] - Similar to **showScannerUI**, when this option is true, the scanner is asked to display a small progress dialog during scanning. These dialogs typically include a Cancel button.
         *
         * When set to false, the scanner is asked not to display a progress dialog during scanning.
         *
         * This option is ignored by {@link Atalasoft.Controls.Capture.WebScanning.importFiles|importFiles}.
         */
        showProgress: false,

        /**
         * @property {Atalasoft.Controls.Capture.PixelType} [pixelType=Any] - Defines the pixel format for scanning.
         *
         * Every scanner capable of scanning paper documents can scan in Black & White (B&W) mode.
         * Almost all scanners can scan grayscale and color. Many scanners, but certainly not all, can scan indexed color.
         *
         * **Note**: We recommend using resultPixelType to control pixel format.
         *
         * This option is ignored by {@link Atalasoft.Controls.Capture.WebScanning.importFiles|importFiles}.
         */
        pixelType: PixelTypeEnum.Any,

        /**
         * @property {Atalasoft.Controls.Capture.PixelType} [resultPixelType=Any] - This specifies the pixel format you want delivered to your application after scanning or importing, and post-processing.
         *
         * This is distinct from the **pixelType** parameter, which controls the pixel format requested from the scanner.
         *
         * The pixel format used for scanning is:
         *  1. **pixelType** if specified
         *  1. otherwise if **resultPixelType** is specified, the *Default Scan* listed in the tables below
         *  1. otherwise if **applyVRS** is true then *Color*
         *  1. otherwise: *B&W*
         *
         *
         * #### Scan with **applyVRS** = true
         *
         * | resultPixelType | Default Scan | Result |
         * | --------------- | ------------ | ------ |
         * | PixelType.Auto | Color | B&W and grayscale => BW; All color => BW or RGB24, chosen by VRS |
         * | PixelType.Any (default) | Color | All => BW (binarized by VRS) |
         * | PixelType.BW | Color | All => BW |
         * | PixelType.Grayscale | Grayscale | B&W => BW; All other => Gray8 |
         * | PixelType.Color | Color | B&W => BW; All grayscale => Gray8; All color => RGB24 |
         *
         * #### Scan with **applyVRS** = false
         *
         * Note that when VRS is disabled, **resultPixelType** can be effectively used in place of pixelType to control the scanner.
         *
         * | resultPixelType | Default Scan | Result |
         * | --------------- | ------------ | ------ |
         * | PixelType.Auto | Color | B&W => BW; All grayscale => Gray8; All color => RGB24 |
         * | PixelType.Any (default) | Color | B&W => BW; All grayscale => Gray8; All color => RGB24 |
         * | PixelType.BW | Color | All => BW |
         * | PixelType.Grayscale | Grayscale | B&W => BW; All other => Gray8 |
         * | PixelType.Color | Color | B&W => BW; All grayscale => Gray8; All color => RGB24 |
         *
         * #### Import with **applyVRS** = true
         *
         * | resultPixelType | Effect of import |
         * | --------------- | ---------------- |
         * | PixelType.Auto | B&W and grayscale => BW; Color => BW or RGB24, chosen by VRS |
         * | PixelType.Any (default) | All => BW (binarized by VRS) |
         * | PixelType.BW | All => BW |
         * | PixelType.Grayscale | B&W => BW; All other => Gray8 |
         * | PixelType.Color | B&W => BW; All grayscale => Gray8; All color => RGB24 |
         *
         * #### Import with **applyVRS** = false
         *
         * | resultPixelType | Effect of import |
         * | --------------- | ---------------- |
         * | PixelType.Auto | B&W => BW; all grayscale => Gray8; all color => RGB24 |
         * | PixelType.Any (default) | B&W => BW; all grayscale => Gray8; all color => RGB24 |
         * | PixelType.BW | All => BW |
         * | PixelType.Grayscale | B&W => BW; All other => Gray8 |
         * | PixelType.Color | B&W => BW; All grayscale => Gray8; All color => RGB24
         */
        resultPixelType: PixelTypeEnum.Any,

        /**
         *  @property {Atalasoft.Controls.Capture.ScanMode} [duplex=Simplex] - Controls duplex/simplex scanning.
         * All scanners support simplex scanning. Many scanners with an ADF (Automatic Document Feeder) can scan duplex, but many cannot.
         *
         * This option is ignored during {@link Atalasoft.Controls.Capture.WebScanning.importFiles|importFiles}.
         */
        duplex : Enums.ScanMode.Simplex,

        /**
         * @property {number} [dpi=200] - Controls the scanning resolution. It stands for dots per inch. It would be very unusual to find
         * a scanner that doesn't support 100, 200 and 300 DPI. 150 DPI is almost as widely supported. Nearly all flatbed scanners can
         * scan anything from 50 DPI to 1200 DPI.
         *
         * The units of this value are always dots per inch, even if the computer, user account or browser are configured for a metric locale.
         *
         * This option is ignored during {@link Atalasoft.Controls.Capture.WebScanning.importFiles|importFiles}.
         *
         */
        dpi: 200,

        /**
         * @property {Atalasoft.Controls.Capture.FeederType} [feeder=Any] - This option selects between the ADF (Automatic Document Feeder) and the flatbed/glass AKA the platen.
         *
         * This option is ignored by {@link Atalasoft.Controls.Capture.WebScanning.importFiles|importFiles}.
         */
        feeder: Enums.FeederType.Any,

        /**
         * @property {Atalasoft.Controls.Capture.PaperSize} [paperSize=USLetter] - Set the paper size being fed into the scanner.
         *
         * **Default value**: {@link Atalasoft.Controls.Capture.PaperSize|USLetter} (8.5" x 11.0", US Letter)
         */
        paperSize: Enums.PaperSize.USLetter,

        /**
         * @property {number} [orientation=Any] - This parameter tells the scanner the expected orientation of the paper being fed,
         * in the sense of upright (short edge feed) or sideways/landscape (long edge feed).
         *
         * This option is ignored by {@link Atalasoft.Controls.Capture.WebScanning.importFiles|importFiles}.
         */
        orientation: Enums.Orientation.Any,

        /**
         * @property {number} [scanCompression=Auto] - This parameter instructs the scanner whether scanned images should be compressed during scan.
         * This parameter should be set to Enable when the scanner is confired to produce color or greyscale images only. Otherwise it should be disabled.
         * It is strongly recommended to use Auto, incorrect value may lead to unexpected behaviour. 
         *
         * This option is ignored by {@link Atalasoft.Controls.Capture.WebScanning.importFiles|importFiles}.
         */
        scanCompression: Enums.ScanCompression.Auto,

        /**
         * @property {boolean} [disableVRSIfInstalledOnWorkstation=false] - If this property is true, automatically disable VRS processing if VRS
         * is detected on the client workstation. The idea is that if VRS is detected on the workstation, the user is probably using a VRS-equipped
         * TWAIN driver, so there is no need to apply VRS processing twice to each image.
         * 
         *  **Note**:
         *  This option is not supported by Web Capture Service for macOS.
         *
         * **Default value**: false
         */
        disableVRSIfInstalledOnWorkstation: false,

        /**
         * @property {boolean} [deskew=true] - Deskew is scanning jargon for 'straighten' - to rotate the scanned image by a few degrees
         * to correct for the paper being scanned slightly crooked. This is not the same as **autoRotate**.
         *
         * **Default value**: true if **applyVRS** is true, false otherwise.
         */
        deskew: true,

        /**
         * @property {boolean} [autoRotate=true] - Detect the orientation of the text in an image - right-side up, upside-down,
         * sideways - and rotates the image so the text is upright.
         *
         * **Default value**: true if VRS is enabled (**applyVRS**). If VRS is disabled, autoRotate is always disabled.
         */
        autoRotate: true,

        /**
         * @property {boolean} [autoCrop=false] - Scanning option indicating whether 'auto crop' filter is applied to the acquired image
         */
        autoCrop: false,

        /**
         * @property {boolean} [holeFill=false] - Scanning option indicating whether 'hole fill' filter is applied to the acquired image
         */
        holeFill: false,

        /**
         * @property {boolean} [despeckle=false] - Scanning option indicating whether 'despeckle' filter is applied to the acquired image
         */
        despeckle: false,

        /**
         * @property {boolean} [discardBlankPages=false] - When this option is true, blank images are detected and discarded during scanning.
         * In duplex scanning, front and back sides of pages are discarded independently.
         *
         * {@link Atalasoft.Controls.Capture.WebScanning#event:onImageAcquired|onImageAcquired} is not fired for such discarded images.
         *
         */
        discardBlankPages: false,

        /**
         *  @property {boolean} [suppressBackgroundColor=false] - If and only if VRS processing is enabled and **resultPixelType**
         * is {@link Atalasoft.Controls.Capture.PixelType | PixelType}.Auto, setting **suppressBackgroundColor** true causes solid-color
         * background to be considered white, so if there is  no other color content on a scanned image, the image will be
         * recognized as and converted to 1-bit B&W.
         *
         * This is useful when your scan batch or imported images may include invoices and other documents printed on
         * colored paper - which you want converted to B&W - but you also expect some pages with color content which you want preserved.
         */
        suppressBackgroundColor: false,

        /**
         * @property {number} [maxPages=-1] - Requests that the scanner scan no more than the specified number of pages.
         * It defaults to -1, meaning 'no limit'. Set to 1 to scan a single page.
         *
         * Note: this means physical pages - if scanning in duplex, maxPages:1 tells the scanner to send 2 images.
         * Not all scanners can do this! Numerous Kodak models always scan everything in the hopper once you start them.
         *
         * This option is ignored by {@link Atalasoft.Controls.Capture.WebScanning.importFiles|importFiles}.
         */
        maxPages: -1,

        /**
         * @property {boolean} [patchCodes=false] - When set true, patch codes are detected and the results are
         * available on each image delivered to the {@link Atalasoft.Controls.Capture.WebScanning#event:onImageAcquired|onImageAcquired} handler.
         */
        patchCodes: false,

        /**
         * @property [importEDocs=false] indicates whether arbitrary files are available on {@link Atalasoft.Controls.Capture.WebScanning.importFiles|importFiles} call.
         * @description setting this property to true adds `All Files(*.*)|*.*|` mask to file import dialog, which means any files will be visible to user.
         */
        importEDocs: false,

        /**
         * Image deliverables configuration
         * @typedef {Object} DeliverablesConfig
         * @property {string} format - specifies the image format to store image data.
         *
         * Supported format values are:
         *
         * | Value | Description |
         * | ---------------| ---------------- |
         * | "bmp" | Windows BMP file |
         * | "gif" | Standard GIF file |
         * | "jpg" or 'jpeg' | standard JPEG (technically, JFIF) |
         * | "png" | standard PNG file |
         * | "tif" or "tiff" | TIFF file TIFF file
         * Bitonal images are written to TIFF with CCITT G4 compression. Color and grayscale are written uncompressed, unless the tiff.jpegCompression option is true. |
         *
         * @property {boolean} [jpegCompression=false] - indicates whether to use JPEG compression for TIFF files.
         * @property {number} [quality=75] - specifies the quality parameter if JPEG compression is enabled or  JPEG format is requested.
         *
         * @property {boolean} [split] - indicates whether to split data to chunks and store them instead of storing whole file.
         *
         * If set, {@link BaseImage#localFileChunks} will be filled with array of chunk identifiers in the order of split; {@link BaseImage#localFile} will be set only if whole data is fit within single chunk.
         * Setting this property is recommended instead of storing big files since having smaller blobs helps to solve memory segmentation issues when processing big batches containing big files.
         *
         * @property {number} [chunkSize] - size of individual chunk in bytes.
         * Default chunk size is 10mb if split is enabled.
         */

        /**
         * Pre-generated image thumbnail configuration
         * @typedef {Object} DeliverablesThumbnailConfig
         * @extends DeliverablesConfig
         *
         * @property {string} format - specifies the image format to store image data.
         *
         * For the list of supported formats see {@link DeliverablesConfig}.
         *
         * @property {boolean} [jpegCompression=false] - indicates whether to use JPEG compression for TIFF files.
         * @property {number} [quality=75] - specifies the quality parameter if JPEG compression is enabled or  JPEG format is requested.
         * @property {number} [height] thumbnail height.
         * @property {number} [width] thumbnail width.
         */

        /**
         * @member {Deliveralbes} [deliverables] - Specifies configurations for pre-generated data that should be prepared for each scanned image right after it's scanned.
         * @memberOf! Atalasoft.Controls.Capture.WebScanning.ScanningOptions
         * @property {Deliveralbes} [deliverables] - Specifies configurations for pre-generated data that should be prepared for each scanned image right after it's scanned.
         */
        /**
         * Specifies configurations for pre-generated data that should be prepared for each scanned image right after it's scanned.
         * @atalaconfig
         * @alias Deliveralbes
         */
        deliverables: {
            /**
             * @property {DeliverablesConfig} [localFile] - Encrypted local file generation settings.
             * When specified, encrypted local file will be generated for each scanned image and identified of that local file will be passed using {@link BaseImage.localFile | localFile} property of the image object in {onImageAcquiredCallback| onImageAcquired} handler.
             */
            localFile: {
                format: 'tif',
                jpegCompression: false,
                quality: 75,
                split: false,
                chunkSize: 0,
            },

            /**
             * @property {DeliverablesConfig} originalImageFile - Specifies encrypted local file generation settings for source image, i.e. image received from scanner and before any image processing applied.
             *
             * When specified, encrypted local file will be generated for each scanned image, as it was received from scanner, and identified of that local file will be passed using {@link BaseImage.localFile | localFile} property of the image object in {onImageAcquiredCallback| onImageAcquired} handler.
             */
            originalImageFile: {
                format: 'tif',
                jpegCompression: false,
                quality: 75
            },

            /**
             * @property {DeliverablesThumbnailConfig} [thumbnail] Pre-generated thumbnail configuration.
             *
             * If specified, thumbnail image will be generated. If thumbnail is requested using {@link BaseImage.thumbnail} API with the same parameters, the pre-generated data will be used and no additional round-trip to server is required.
             */
            thumbnail: {
                format: 'tif',
                jpegCompression: false,
                quality: 75,
                height: undefined,
                width: undefined
            }
        },

        /**
         * @property {object} barcodes - This scanning option controls barcode recognition during scanning. The results are available
         * in the barcodes property on each image delivered to the {@link Atalasoft.Controls.Capture.WebScanning#event:onImageAcquired|onImageAcquired} handler.
         *
         * ```javascript
         * Atalasoft.Controls.Capture.WebScanning.scanningOptions = {
         *   barcodes: { count: 1, symbology: [ 'Code 39', 'Code 128' ]
         * }
         * // ...
         * function _onImageAcquired(event, imageProxy) {
         *   if (imageProxy.barcodes.length > 0) {
         *     // process barcodes
         *     alert('first barcode type=' + imageProxy.barcodes[0].symbology +
         *           ', data='+imageProxy.barcodes[0].data);
         *   }
         * }
         * ```
         *
         * To enable barcode recognition, include barcodes as a property of the scanningOptions object, and set it to an object with one or more of the
         * following properties:
         *
         * | Property | Type | Meaning | If omitted  |
         * | -------- | ---  | ------- | ----------- |
         * | **count** | integer | maximum number of symbols to recognize | -1, meaning 'all' |
         * | **checksums** | boolean | whether to check & strip optional checksums. Not supported by Web Capture Service for macOS. | false |
         * | **symbology** | string[] | names of symbologies to recognize (see below) | all |
         *
         * Supported symbologies:
         *   - EAN-13
         *   - EAN-8
         *   - UPC-A
         *   - UPC-E
         *   - Code 39
         *   - Code 39 (Full ASCII) (Not supported by Web Capture Service for macOS)
         *   - Code 128
         *   - Interleaved 2 of 5 (Not supported by Web Capture Service for macOS)
         *   - Codabar
         *   - Code 93 (Not supported by Web Capture Service for macOS)
         *   - Aztec (Not supported by Web Capture Service for macOS)
         *   - POSTNET
         *   - PDF417
         *   - Data Matrix
         *   - QR Code
         *   - MicroPDF417 (Not supported by Web Capture Service for macOS)
         *   - Micro QR Code (Not supported by Web Capture Service for macOS)
         */
        barcodes: {
            count: 0,
            checksums: false,
            symbology: undefined
        },

        /**
         * @property {ImageAddress} imageAddress - Allows to switch image indexing format to "Image Address" mode and set initial image address value.
         *
         * At the moment "Image Address" is supported only by couple scanners in Kodak product line.
         * `template` property is read-only and ignored when applying scanner configuration. Its value is only valid in scope of {Atalasoft.Controls.Capture.WebScanning.getSupportedValues|getSupportedValues} call.
         *
         */
        imageAddress: undefined,

        /**
         * @property {ImprintersConfig} imprintersConfig - Allows to configure scanner's imprinter devices.
         *
         *  **Note**:
         *  This option is not supported by Web Capture Service for macOS.
         *
         */
        imprintersConfig: undefined,

        /**
         * @property {object} [tiff=undefined] - Tiff images compression settings.
         * @property {boolean} [tiff.jpegCompression=false] - indicates whether to use jpeg compression for Tiff images.
         */
        tiff: {
            jpegCompression: false
        },

        /**
         * @property {object} [jpeg=undefined] - Jpeg images compression settings.
         * @property {number} [quality=75] - Jpeg compression quality
         */
        jpeg: {
            quality: 75
        },

        /**
         * @property {string} kofaxVRSEliteProfileName - Specifies the name of VRS Elite profile which is supposed to be used,
         * during scan using VRS.
         *
         *  **Note**:
         *  This option is not supported by Web Capture Service for macOS.
         * 
         * If the profile name is not defined, default profile is used during scan. If the specified profile does not exist,
         * previously selected profile is used.
         *
         * This option has effect only in case of using VRS for scan.
         *
         */
        kofaxVRSEliteProfileName: null
    },

    _shutdown: false,
    connectionBroken: true,
    eventsUrl: '',
    settingsUrl: '',
    images: '',
    image: '',
    _sessionsKey: 'sessions',

    initialize: function (params, success, failure) {
        var me = this;
        logger.scope('WebTwain.initialize()', function () {
            me._shutdown = false;
            me._server = connectionService;
            me._server.setLimitedMode(browser.msie && browser.version < 10);

            var requestData = {
                localization: params.localization,
                scanningOptions: me.extendScanningOptions(params.scanningOptions)
            };

            me.__retryConnection(requestData, function (response) {
                me.SessionId = response.id;
                me.HostRunsAsService = response.hostRunsAsService;
                me.PersistentPath = response.persistentPath;
                me.self = response.self;
                me.eventsUrl = response.events;
                me.settingsUrl = response.settings;
                me.images = response.images;
                me.Scan = new ScanApiType(response, me);
                me.LocalFile = new LocalFileType(response);

                // in general we don't need to store all settings in Scan now. scanningSettings is enough.
                me.scanningOptions = me.extendScanningOptions(response.scanningOptions);

                me.ReadyState = response.readyState || 1;
                me.TwainAvailable = response.twainAvailable;
                me.AppTitle = response.appTitle;
                me.Localization = response.localization;
                me.FullVersion = JSON.parse("[" + response.fullVersion.split('.').join(',') + "]");
                me.machineName = response.machineName;
                me.connectionBroken = false;
                me.closeAbandonedSessions(function () {
                    if (success && success.call) {
                        success.call(me);
                    }
                });

            }, failure);
        });
    },

    extendScanningOptions: function (scanningOptions) {
        // Interpret any scanning options in the scanningOptions object into plugin settings.
        var finalOptions = {};

        scanningOptions = scanningOptions || {};
        if (typeof scanningOptions.scanner === 'string') {
            finalOptions.scanner = scanningOptions.scanner;
        } else {
            finalOptions.scanner = this.SourceDevice;
        }

        if (scanningOptions.brightness !== undefined) {
            finalOptions.brightness = Number(scanningOptions.brightness);
        }

        if (scanningOptions.contrast !== undefined) {
            finalOptions.contrast = Number(scanningOptions.contrast);
        }

        if (scanningOptions.threshold !== undefined) {
            finalOptions.threshold = Number(scanningOptions.threshold);
        }

        finalOptions.showScannerUI = scanningOptions.showScannerUI || false;
        finalOptions.showScannerUIWithCurrentSettings = scanningOptions.showScannerUIWithCurrentSettings || false;
        finalOptions.showProgress = scanningOptions.showProgress || false;
        finalOptions.pixelType = (scanningOptions.pixelType !== undefined) ? Number(scanningOptions.pixelType) : -1;
        finalOptions.resultPixelType = (scanningOptions.resultPixelType !== undefined) ? Number(scanningOptions.resultPixelType) : -1;
        finalOptions.duplex = (scanningOptions.duplex !== undefined) ? Number(scanningOptions.duplex) : 0;
        finalOptions.dpi = Number(scanningOptions.dpi) || 200;
        finalOptions.feeder = (scanningOptions.feeder !== undefined) ? Number(scanningOptions.feeder) : -1;
        finalOptions.paperSize = (scanningOptions.paperSize !== undefined) ? Number(scanningOptions.paperSize) : 3;
        finalOptions.orientation = (scanningOptions.orientation !== undefined) ? Number(scanningOptions.orientation) : -1;
        finalOptions.applyVRS = (scanningOptions.applyVRS !== undefined) ? scanningOptions.applyVRS : true;
        finalOptions.scanCompression = (scanningOptions.scanCompression !== undefined) ? scanningOptions.scanCompression : Enums.ScanCompression.Auto;

        finalOptions.disableVRSIfInstalledOnWorkstation = scanningOptions.disableVRSIfInstalledOnWorkstation || false;
        finalOptions.deskew = (scanningOptions.deskew !== undefined) ? scanningOptions.deskew : finalOptions.applyVRS;
        finalOptions.autoRotate = (scanningOptions.autoRotate !== undefined) ? scanningOptions.autoRotate : finalOptions.applyVRS;
        finalOptions.autoCrop = scanningOptions.autoCrop || false;
        finalOptions.holeFill = scanningOptions.holeFill || false;
        finalOptions.despeckle = scanningOptions.despeckle || false;
        finalOptions.discardBlankPages = scanningOptions.discardBlankPages || false;
        finalOptions.suppressBackgroundColor = scanningOptions.suppressBackgroundColor || false;
        finalOptions.maxPages = Number(scanningOptions.maxPages) || -1;
        finalOptions.patchCodes = scanningOptions.patchCodes || false;
        finalOptions.importEDocs = scanningOptions.importEDocs || false;

        // tfs887020: fi7260 fail scan from flatbed in duplex mode.
        if (finalOptions.feeder === Enums.FeederType.Flatbed && finalOptions.duplex === Enums.ScanMode.Duplex)
            finalOptions.duplex = Enums.ScanMode.Simplex;

        if (typeof (scanningOptions.barcodes) === 'object') {
            finalOptions.barcodes = scanningOptions.barcodes;
            if (!finalOptions.barcodes.hasOwnProperty('count')) {
                finalOptions.barcodes.count = -1;
            }
        } else {
            finalOptions.barcodes = { count: 0 };
        }

        finalOptions.tiff = finalOptions.tiff || { jpegCompression: true };
        if (scanningOptions.tiff && scanningOptions.tiff.jpegCompression !== undefined) {
            finalOptions.tiff.jpegCompression = scanningOptions.tiff.jpegCompression;
        }
        finalOptions.jpeg = finalOptions.jpeg || {};
        finalOptions.jpeg.quality = Number(scanningOptions.jpeg && scanningOptions.jpeg.quality || 75);
        finalOptions.evrsSettings = (typeof scanningOptions.evrsSettings === 'string') ? scanningOptions.evrsSettings : "";
        finalOptions.deliverables = (typeof (scanningOptions.deliverables) === 'object') ? scanningOptions.deliverables : {};

        if (typeof (scanningOptions.imageAddress) === "object") {
            finalOptions.imageAddress = scanningOptions.imageAddress;
        } else {
            delete finalOptions.imageAddress;
        }

        if (typeof (scanningOptions.imprintersConfig) === "object") {
            finalOptions.imprintersConfig = scanningOptions.imprintersConfig;
        } else {
            delete finalOptions.imprintersConfig;
        }

        if (this.scanningOptions) {
            this.scanningOptions = finalOptions;
        }

        return finalOptions;
    },

    closeAbandonedSessions: function (callback) {
        var me = this,
            futureContainer = { future: null },
            futureFactory = function (that, u) { return function () { futureContainer.future = that.shutdownWorker(u); }; };

        if (me._server.isLimitedMode()) {
            if (window.localStorage) {
                var sessions = window.localStorage.getItem(me._sessionsKey);
                if (sessions) {
                    sessions = JSON.parse(sessions);

                    for (var i = 0; i < sessions.length; ++i) {
                        var url = sessions[i];
                        if (url) {
                            if (!futureContainer.future) {
                                futureContainer.future = me.shutdownWorker(url);
                            } else {
                                futureContainer.future.always(futureFactory(me, url));
                            }
                        }
                    }
                }
            }
        }

        if (futureContainer.future) {
            futureContainer.future.always(function () {
                window.localStorage.removeItem(me._sessionsKey);
                callback();
            });
        } else {
            callback();
        }
    },

    reloadScanners: function (async, callback) {
        var me = this;
        this._server.get(this.self, {}, async).done(function (sessionData) {
            me.InstalledSources = sessionData.installedSources || [];
            me.DefaultSourceDevice = sessionData.defaultSourceDevice;
            me.SourceDevice = sessionData.sourceDevice;

            if (callback)
                callback();
        });
    },

    shutdown: function (success, error, useBeaconApi) {
        var me = this,
            sessionKey = me._sessionsKey;
        logger.scope('WebTwain.shutdown()', function () {
            if (me.self) {
                me.shutdownWorker(me.self, useBeaconApi)
                    .done(function () {
                        me._shutdown = true;
                        me.self = undefined;
                        me.settingsUrl = undefined;
                        me.eventsUrl = undefined;
                        me.images = undefined;
                        me.SessionId = null;
                        me.Scan.uninitialize();

                        me.onacquiredone = function () { };
                        me.onacquirefailed = function (msg, note) { };
                        me.onimageacquired = function (index, image) { };
                        me.onimagediscarded = function () { };
                        me.onscanerror = function (msg, note) { };

                        me._server.releaseDeffered();

                        if (success) {
                            success();
                        }
                    })
                    .fail(function (jqXhr, textStatus, errorThrown) {
                        logger.warn('WebTwain.shutdown() error ' + textStatus + '; ' + errorThrown);

                        if (error) {
                            error(errorsManager.internalError, {});
                        }
                    });

                if (me._server.isLimitedMode()) {
                    if (window.localStorage) {
                        var sessions = window.localStorage.getItem(sessionKey) || '[]';
                        sessions = JSON.parse(sessions);
                        sessions.push(me.self);
                        window.localStorage.setItem(sessionKey, JSON.stringify(sessions));
                    }
                }

            } else {
                me._shutdown = true;
                if (success) {
                    success();
                }
            }
        });
    },

    shutdownWorker: function (url, useBeaconApi) {
        var me = this,
            future = null;

        logger.scope('WebTwain.shutdownWorker: ' + url, function () {
            if(!useBeaconApi) {
                future = me._server.del(url, {}, false);
            } else {
                future = me._server.beacon(url, "");
            }
        });

        return future;
    },

    updateSettings: function (params, async) {
        return this._server.put(this.self, params, async);
    },

    AsBase64String: function (frmt, opts, callback) {
        var me = this,
            base64 = '';

        logger.scope('WebTwain.Clear()', function () {
            if (me._server && me.images) {
                me._server.get(me.images, {
                    format: frmt || opts.format,
                    jpegCompression: opts ? opts.jpegCompression : undefined,
                    quality: opts ? opts.quality : undefined
                }, typeof (callback) === 'function')
                    .done(function (response) {
                        base64 = response.base64 || '';
                        if (callback && typeof (callback) === 'function')
                            callback(base64);
                    })
                    .fail(function (jqXhr, textStatus, errorThrown) {
                        logger.log('WebTwain.AsBase64String() error ' + textStatus + '; ' + errorThrown);
                    });
            }
        });

        return base64;
    },

    Clear: function () {
        var me = this;
        logger.scope('WebTwain.Clear()', function () {
            if (me._server && me.images) {
                me._server.del(me.images);
            }
        });
    },

    DeleteImage: function (image) {
        logger.scope('WebTwain.DeleteImage()', function () {
            if (image && image.clear)
                image.clear();
        });
    },

    // Events
    onacquiredone: function () { },
    onacquirefailed: function (msg, note) { },
    onimageacquired: function (index, image) { },
    onimagediscarded: function () { },
    onscanerror: function (msg, note) { },

    startEventsPoll: function (sessionId) {
        var eventTypes = {
            AcquireDone: 0,
            AcquireFailed: 1,
            ImageAcquired: 2,
            ScanError: 3,
            SupportedValues: 4,
            ScanDialogComplete: 5,
            SessionDisposed: 6,
            CurrentValues: 7,
            ImageDiscarded: 8
        };

        var me = this,
            brokenPollsCount = 0;
        this._server.poll(this.eventsUrl, function (e) {
            me.connectionBroken = false;
            brokenPollsCount = 0;
            switch (e.eventType) {
                case eventTypes.AcquireDone:
                    me.onacquiredone();
                    break;
                case eventTypes.AcquireFailed:
                    me.onacquirefailed(e.message, e.details);
                    break;
                case eventTypes.ImageAcquired:
                    var image = new ImageType(e.image.sessionId, e.image.index, e.image);
                    me.onimageacquired(e.index, image);
                    break;
                case eventTypes.ScanError:
                    me.onscanerror(e.message, e.details);
                    break;
                case eventTypes.SupportedValues:
                    me._server.executeDeferredCallback(e.callbackId, e.values);
                    break;
                case eventTypes.ScanDialogComplete:
                    me._server.executeDeferredCallback(e.callbackId, e.complete);
                    break;
                case eventTypes.SessionDisposed:
                    return false;
                case eventTypes.CurrentValues:
                    me._server.executeDeferredCallback(e.callbackId, e.values);
                    break;
                case eventTypes.ImageDiscarded:
                    me.onimagediscarded();
                    break;
            }
            return !me._shutdown;
        }, function (jqXhr) {
            if (jqXhr) {
                if (jqXhr.status === 404) {
                    // Hm, looks like worker is dead and can't be live again.
                    // Stop polling and inform user about this disaster.
                    me.reportBrokenConnection(errorsManager.brokenConnection);
                    return false;
                }
                if ((jqXhr.status === 500 || jqXhr.status === 0) && !me._shutdown) {
                    // TFS #557193: polling timeout changed to wait for 15 seconds(15 failed queries) to work-around
                    // scenario when system sleeps and we run under chrome. Before and after sleep chrome is
                    // still trying to send ajax requests, but they all fail because network io is suspended.
                    if (++brokenPollsCount > 15) {
                        me.reportBrokenConnection();
                        brokenPollsCount = 0;
                        return false;
                    }
                }
            }
            return !me._shutdown;
        });
    },

    reportBrokenConnection: function (error) {
        var me = this;
        if (!me.connectionBroken) {
            me.connectionBroken = true;
            if (error) {
                WebTwainScanner.__reportError(error);
            } else {
                WebTwainScanner.__reportError(errorsManager.noPlugin, {
                    message: errorsManager.webServiceMissed,
                    filename: WebTwainScanner._installerFileName
                });
            }
        }
    },

    __serviceUrlBase: window.location.protocol === 'https:' ? 'https://127.0.0.1:23024' : 'http://127.0.0.1:23023',

    __retryConnection: function (data, successCallback, failureCallback) {
        var retryTimeout = 2000;
        var me = this;
        if (!me._shutdown) {
            this._server.post(this.__serviceUrlBase + '/sessions', data, true)
                .done(function (response) { successCallback.call(me, response); })
                .fail(function (response) {
                    if (failureCallback)
                        failureCallback(response);
                    window.setTimeout(function () {
                        me.__retryConnection(data, successCallback);
                    }, retryTimeout);
                });
        }
    }
};

// #endregion webTwainConnector

// #region WebService Scanner object
//////////////////////////////////////////////////////////////////////////
/// WebTwain implementation
var WebTwainScanner = {
    // 'public' properties
    scanners: [],
    defaultScanner: '',
    isSupportedBrowser: true,

    // 'private' properties
    _logger: logger,
    _installerFileName: navigator.platform.substring(0, 3) !== 'Mac' ? 'Kofax.WebCapture.Installer.msi' : 'Kofax.WebCapture.macOS.pkg',
    _eztwain: {},
    _params: {},
    _lastSheetNo: -1, // physical sheet no. of last image (sometimes)
    _aborting: false, // set true when aborting a scan or import
    // localizable strings used only by this javascript module.
    // None of these are error messages, they are only used to create
    // the 'note' or onScanClientReady 'details' strings that accompany errors.
    _localization: {
        not32Bit: "Browser is not 32-bit: ",
        notWindows: "Platform is not Windows : ",
        ieVersion: "IE version not supported: ",
        notSupported: "Not currently supported or macOS: ",
        pluginVersion: "Plugin is version: ",
        minVersionNeeded: "minimum version needed: "
    },

    __reportError: function (msg, params) {
        // Note that the msg parameter must ALWAYS be a string from Atalasoft.Controls.Capture.Errors
        errorsManager.report(this._params.onScanError, msg, params);
    },

    /**
    * Gets components of WingScan version as an array of numbers.
    * @memberof Atalasoft.Controls.Capture.WebTwainScanner
    * @returns {number[]} WingScan version components.
    */
    getVersion: function () {
        return this._eztwain.FullVersion;
    },

    getInstallerFileName: function() {
        return this._installerFileName;
    },

    /**
    * Gets the NetBIOS name of the local scan station.
    * @memberof Atalasoft.Controls.Capture.WebTwainScanner
    * @returns {string}
    */
    getScanStationName: function () {
        return this._eztwain.machineName;
    },

    deleteLocalFile: function (fid, callback) {
        var localFileApi = this._eztwain.LocalFile;

        if (typeof callback === 'function')
            localFileApi.removeAsync(fid, callback);
        else {
            logger.warn(
                "Parameter 'callback' is not specified. The method 'deleteLocalFile' will be run synchronously.");
            localFileApi.remove(fid);
        }
    },

    encryptedLocalFileAsBase64String: function () {
        var args = Array.prototype.slice.call(arguments),
            callback = args.slice(-1).pop(),
            localFileApi = this._eztwain.LocalFile;

        if (typeof callback === 'function') {
            args.unshift(args.pop());
            localFileApi.asBase64StringAsync.apply(localFileApi, args);
        } else {
            logger.warn(
                "Parameter 'callback' is not specified. The method 'encryptedLocalFileAsBase64String' will be run synchronously.");
            return localFileApi.asBase64String.apply(localFileApi, arguments);
        }
    },

    splitToFiles: function () {
        var args = Array.prototype.slice.call(arguments),
            localFileApi = this._eztwain.LocalFile;
        // we always expect callback, but allow to skip other params.
        args.unshift(args.pop());
        localFileApi.splitToFiles.apply(localFileApi, args);
    },

    globalPurgeByAge: function (hours, callback) {
        var localFileApi = this._eztwain.LocalFile;

        if (typeof callback === 'function')
            localFileApi.globalPurgeByAgeAsync(hours, callback);
        else {
            logger.warn(
                "Parameter 'callback' is not specified. The method 'globalPurgeByAge' will be run synchronously.");
            localFileApi.globalPurgeByAge(hours);
        }
    },

    listLocalFiles: function (callback) {
        var localFileApi = this._eztwain.LocalFile;

        if (typeof callback === 'function')
            localFileApi.listAsync(callback);
        else {
            logger.warn(
                "Parameter 'callback' is not specified. The method 'listLocalFiles' will be run synchronously.");
            return localFileApi.list();
        }
    },

    removeAll: function (callback) {
        var localFileApi = this._eztwain.LocalFile;

        if (typeof callback === 'function')
            localFileApi.removeAllAsync(callback);
        else {
            logger.warn(
                "Parameter 'callback' is not specified. The method 'removeAll' will be run synchronously.");
            localFileApi.removeAll();
        }
    },

    saveBase64ToEncryptedLocalFile: function (bs64, callback) {
        var localFileApi = this._eztwain.LocalFile;

        if (typeof callback === 'function')
            localFileApi.fromBase64StringAsync(bs64, callback);
        else {
            logger.warn(
                "Parameter 'callback' is not specified. The method 'saveBase64ToEncryptedLocalFile' will be run synchronously.");
            return localFileApi.fromBase64String(bs64);
        }
    },

    setBarcodeLicense: function (key) {
        var settings = { barcodeLicense: key },
            me = this;
        this._eztwain.updateSettings(settings, true)
            .fail(function (jqXhr, textStatus, errorThrown) {
                me._logger.error('setBarcodeLicense() failed: ' + textStatus + '; ' + errorThrown);
                me.__reportError(errorsManager.internalError);
            });
    },

    setLicense: function (lic, callback) {
        var me = this;
        if (lic && (lic.key || lic.barcode)) {
            var settings = {
                domain: window.location.hostname
            };
            if (lic.key) {
                settings.wingScanLicense = lic.key;
            }
            if (lic.barcode) {
                settings.barcodeLicense = lic.barcode;
            }

            this._eztwain.updateSettings(settings, true)
                .done(function () {
                    if (callback)
                        callback(true);
                })
                .fail(function (jqXhr, textStatus, errorThrown) {
                    me._logger.error('setLicense() failed: ' + textStatus + '; ' + errorThrown);
                    if (callback)
                        callback(false);
                    else
                        me.__reportError(errorsManager.internalError, {});
                });
        }

        return true;
    },

    setSymmetricEncryptionKey: function (key) {
        var args = Array.prototype.slice.call(arguments),
            callback = args.slice(-1).pop(),
            async = typeof callback === 'function',
            me = this;

        // TODO: add deprecation info

        me._eztwain.updateSettings({ symmetricEncryptionKey: key }, async)
            .done(callback)
            .fail(function (jqXhr, textStatus, errorThrown) {
                me._logger.error('setSymmetricEncryptionKey() failed: ' + textStatus + '; ' + errorThrown);
                me.__reportError(errorsManager.internalError, {});
            });
    },

    enumerateScanners: function () {
        var args = Array.prototype.slice.call(arguments),
            callback = args.slice(-1).pop(),
            async = typeof callback === 'function',
            result = $.Deferred(),
            me = this;

        if (!async) {
            logger.warn(
                "Parameter 'callback' is not specified. The method 'enumerateScanners' will be run synchronously.");
        }

        if (!this._eztwain.TwainAvailable) {
            this.__reportError(errorsManager.noTwain);
            result.resolve();
        } else {
            this._eztwain.reloadScanners(async, function () {
                // Get the list of available devices (with TWAIN, this is just a list of *installed* device drivers)
                me.scanners = me._eztwain.InstalledSources || [];
                // And, ask plugin for the name of the system-wide default device:
                me.defaultScanner = me._eztwain.DefaultSourceDevice;
                result.resolve(me.scanners);
            });
        }

        result.done(function (scanners) {
            // call callback if needed.
            if (async)
                callback(scanners);
        });
    },

    // Called when the selection changes in the scanner-list control.
    // Parameter is the name of a scanner
    // This function passes the name of the newly selected device to the plugin,
    // selecting it for subsequent scans (or any other device operations.)
    onScannerSelected: function (scanner) {
        this._eztwain.SourceDevice = scanner;
    },

    isInstalled: function () {
        return true; // can we detect that EZTwain is already installed
    },

    /**
 * binds events to callbacks provided by client.
 * @param isBind attaches event handlers if true; otherwise detaches.
 */
    __bindEvents: function (isBind) {
        var evtObj = this._params.eventBindObject,
            fn = isBind ? evtObj.bind : evtObj.unbind;

        if (this._params.onScanStarted) {
            fn.call(evtObj, 'onScanStarted', isBind ? {} : this._params.onScanStarted, this._params.onScanStarted);
        }
        if (this._params.onScanCompleted) {
            fn.call(evtObj, 'onScanCompleted', isBind ? {} : this._params.onScanCompleted, this._params.onScanCompleted);
        }
        if (this._params.onImageAcquired) {
            fn.call(evtObj, 'onImageAcquired', isBind ? {} : this._params.onImageAcquired, this._params.onImageAcquired);
        }
        if (this._params.onImageDiscarded) {
            fn.call(evtObj, 'onImageDiscarded', isBind ? {} : this._params.onImageDiscarded, this._params.onImageDiscarded);
        }
        if (this._params.onScanError) {
            fn.call(evtObj, 'onScanError', isBind ? {} : this._params.onScanError, this._params.onScanError);
        }
    },

    versionLess: function (v, w) {
        if (v[0] !== w[0]) return v[0] < w[0];
        if (v[1] !== w[1]) return v[1] < w[1];
        if (v[2] !== w[2]) return v[2] < w[2];
        return v[3] < w[3];
    },

    __pluginTooOld: function (plugin, minVer) {
        return this.versionLess(plugin.FullVersion, minVer);
    },

    __initEztwainWhenReady: function () {
        // Minimum version of native code module, needed by this javascript layer:
        var minVer = clientVersion;
        // Did it create the object and is the object ready to run?
        if (!this._eztwain || this._eztwain.ReadyState != 4) {
            // So far, plugin not ready - could have multiple causes.
            // Check back later...
            var meLater = this;
            setTimeout(function () { meLater.__initEztwainWhenReady(); }, 2000);
        } else if ((this._params.backwardCompatibilityMode == null || !this._params.backwardCompatibilityMode) && this.__pluginTooOld(this._eztwain, minVer)) {
            // constructed and ready, but (still?) too low a version to use
            var details = this._localization.pluginVersion +
                this._eztwain.FullVersion +
                " - " +
                this._localization.minVersionNeeded +
                minVer;
            if (!this._eztwain.HostRunsAsService) {
                this.__reportError(errorsManager.oldPlugin, { message: details, filename: this._installerFileName });
            } else {
                this.__reportError(errorsManager.oldWindowsService, { message: details });
            }
        } else {
            // looks OK!
            this.__bindEvents(true);

            // Attach our handlers to the control's events:
            var me = this;
            // There are a variety of ways to attach an event handler to the control
            // or plugin, but this way has been found to work on
            // FF 9, Chrome 16, Safari 5.1, Opera 11:
            me._eztwain.onacquiredone = function () { me.__onAcquireDone(); };
            me._eztwain.onacquirefailed = function (msg, note) { me.__onAcquireFailed(msg, note); };
            me._eztwain.onimageacquired = function (index, image) { me.__onImageAcquired(image); };
            me._eztwain.onimagediscarded = function () { me.__onImageDiscarded(); };
            me._eztwain.onscanerror = function (msg, note) { me.__reportError(msg, { message: note }); };

            // start event polling.
            me._eztwain.startEventsPoll(me._eztwain.SessionId);
            me._logger
                .info('minVer:                 ' + minVer)
                .info('navigator.userAgent:    ' + navigator.userAgent)
                .info('navigator.vendor:       ' + navigator.vendor)
                .info('browser: ' + browser.name)
                .info('version: ' + browser.version);

            // If there's a handler for control-ready, call the handler:
            if (me._params.onScanClientReady) {
                me._params.onScanClientReady();
            }
        }
    },

    // Called to set up scanning on the current page.
    // params will have members to report errors and events
    initialize: function (params) {
        this._params = params;
        if (params.localization) {
            $.extend(this._localization, params.localization);
        }

        var pthis = this;
        //Try to connect to local scan service:
        this._eztwain = webTwain;
        this._eztwain.initialize(params, function () {
            //success!  Control is constructed and ready to go.
            pthis.__initEztwainWhenReady();
        },
            function (response) {
                if (response.responseText && errorsManager[response.responseText]) {
                    pthis.__reportError(errorsManager[response.responseText]);
                } else {
                    pthis.__reportError(errorsManager.noPlugin,
                    {
                        message: errorsManager.webServiceMissed,
                        filename: pthis._installerFileName
                    });
                }
            });
    },

    __shutdown: function (success, error, useBeaconApi) {
        try {
            var me = this;
            if (this._eztwain) {
                this._eztwain.shutdown(function () {
                    me.__bindEvents(false);
                    me.scanners = [];
                    me._params = {};
                    me._eztwain = null;
                    me._uploadFunction = null;

                    if (success) {
                        success();
                    }
                }, error, useBeaconApi);
            }
        } catch (e) {
            if (error) {
                error(errorsManager.internalError, e);
            }
        }
    },

    __onAcquireDone: function () {
        var me = this;
        this._logger.scope('onAcquireDone event', function () {
            me._logger.scope('calling user event handler...', function () {
                me._params.eventBindObject.trigger('onScanCompleted', { success: true });
            });

            if (me._uploadFunction) {
                me._logger.scope('calling uploadFunction.', function () {
                    me._eztwain.AsBase64String('.tif', {}, function (data) {
                        if (data && data.length) {
                            // todo: commentig out since it could affect async image operations.
                            //me._eztwain.Clear();
                            me._uploadFunction(data);
                        }
                    });
                });
            }
        });
    },

    __onAcquireFailed: function (msg, note) {
        var me = this;
        this._logger.scope('onAcquireFailed event (%s, %s)', msg, note, function () {
            me._logger.scope('calling user event handler...', function () {
                me._params.eventBindObject.trigger('onScanCompleted', { success: false, error: { message: msg, details: note } });
            });
        });
    },

    __onImageAcquired: function (image) {
        var me = this;
        this._logger.scope('onImageAcquired event', function () {
            me._logger.info('image:').object(image);

            image.discard = false;
            try {
                if (me._aborting) {
                    image.discard = true;
                } else {
                    me._logger.scope('calling user event handler...', function () {
                        // pass to handler so it can do whatever:
                        me._params.eventBindObject.trigger('onImageAcquired', image);
                    });
                }
            } catch (e) {
                me.__reportError(errorsManager.internalError, e);
                image.discard = true;
            }
            if (image.discard) {
                me._eztwain.DeleteImage(image);
            }
        });

    },

    __onImageDiscarded: function () {
        var me = this;
        this._logger.scope('onImageDiscarded event', function () {
            me._logger.scope('calling user event handler...', function () {
                me._params.eventBindObject.trigger('onImageDiscarded');
            });
        });
    },

    scan: function (scanningOptions, uploadFunction) {
        if (this._eztwain) {
            this._aborting = false;
            this._params.eventBindObject.trigger('onScanStarted', {});
            try {
                this._eztwain.Clear();
                this._lastSheetNo = -1;
                // Record upload function, will be called on Acquire Done event:
                this._uploadFunction = uploadFunction;
                // Initiate the scan:
                var opts = this._eztwain.extendScanningOptions(scanningOptions);
                if (!this._eztwain.Scan.start(opts)) {
                    this._params.eventBindObject.trigger('onScanCompleted', { success: false, error: { message: errorsManager.scanFail } });
                }
            } catch (e) {
                this.__reportError(errorsManager.internalError, e);
                this._params.eventBindObject.trigger('onScanCompleted', { success: false, error: e });
            }
        }
    },

    abortScan: function () {
        if (this._eztwain) {
            this._aborting = true;
            if (this._eztwain.Scan && this._eztwain.Scan.abort) {
                // The guard above is because sometimes this function
                // is called during plugin-install, and (apparently?)
                // under some conditions _eztwain is only semi-there.
                this._eztwain.Scan.abort();
            }
        }
    },

    importFiles: function (options) {
        if (this._eztwain) {
            this._aborting = false;
            this._params.eventBindObject.trigger('onScanStarted', {});
            try {
                this._eztwain.Clear();
                this._lastSheetNo = -1;
                // Record upload function, will be called on Acquire Done event:
                this._uploadFunction = null;
                // Initiate the import:
                var opts = this._eztwain.extendScanningOptions(options);
                if (!this._eztwain.Scan.importFiles(opts)) {
                    this._params.eventBindObject.trigger('onScanCompleted', { success: false, error: { message: errorsManager.scanFail } });
                }
            } catch (e) {
                this.__reportError(errorsManager.internalError, e);
                this._params.eventBindObject.trigger('onScanCompleted', { success: false, error: e });
            }
        }
    },

    showSettingsDialog: function (options, callback) {
        try {
            if (typeof options.scanner !== 'string') {
                options.scanner = this._eztwain.SourceDevice;
            }
            this._eztwain.Scan.showSettingsDialog(options, callback);
        } catch (e) {
            this.__reportError(errorsManager.internalError, e);
        }
    },

    getSessionId: function() {
        return this._eztwain.SessionId;
    },

    getPersistentPath: function() {
        return this._eztwain.PersistentPath;
    },

    getSupportedValues: function (options, callback) {
        try {
            // TODO: Thin Client calls this method before we are actually initialized. Work with them to fix this!
            if (this._eztwain.Scan.getSupportedValues) {
                if (typeof options.scanner !== 'string') {
                    options.scanner = this._eztwain.SourceDevice;
                }
                this._eztwain.Scan.getSupportedValues(options, callback);
            } else {
                callback();
            }

        } catch (e) {
            this.__reportError(errorsManager.internalError, e);
        }
    },

    getCurrentValues: function (options, callback) {
        try {
            // TODO: Thin Client calls this method before we are actually initialized. Work with them to fix this!
            if (this._eztwain.Scan.getCurrentValues) {
                if (typeof options.scanner !== 'string') {
                    options.scanner = this._eztwain.SourceDevice;
                }
                this._eztwain.Scan.getCurrentValues(options, callback);
            } else {
                callback();
            }

        } catch (e) {
            this.__reportError(errorsManager.internalError, e);
        }
    },

    clear: function () {
        this._eztwain.Clear();
    }
};

// #endregion

module.exports = WebTwainScanner;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
﻿

    // dependencies
    var logger = __webpack_require__(1),
	service = __webpack_require__(3),
	$ = __webpack_require__(0),
    ImageBase = __webpack_require__(6),
	ThumbnailType = __webpack_require__(15);
 
    /** Image implementation.
     * @class
     * @augments BaseImage
     */
    var Image = function (session, imgId, data) { 
        ImageBase.apply(this, arguments);
        this.thumbnailData = new ThumbnailType(this.id, $.extend(true, data.thumbnailData, { thumb: data.thumb }));
    };

    
    Image.prototype = $.extend(
        /** @lends Image.prototype */ {
        /** Gets thumbnail image.
         */       
        thumbnail: function (w, h) {
            if (!this.thumbnailData || this.thumbnailData.requestedWidth !== w || this.thumbnailData.requestedHeight !== h) {
                this.thumbnailData = new ThumbnailType(this.id, {
                    thumb: this.thumbUrl,
                    width: w,
                    height: h,
                    requestedWidth: w,
                    requestedHeight: h
                });
            }
            
            return this.thumbnailData;
        },
        
        /** Gets thumbnail image.
         * @deprecated Use thumbnail instead.
         */       
        Thumbnail: function Thumbnail() {
            logger.deprecate('Thumbnail', 'thumbnail');
            return this.thumbnail.apply(this, arguments);
        }
    }, ImageBase.prototype);

    module.exports = Image;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

﻿var ImageBase = __webpack_require__(6),
    imageClass = ImageBase.prototype;

/** @this Thumbnail
  * @private
  */
var udateFields = function (data) {
    imageClass.updateData.call(this, data);

    /** Base64 string that represents thumbnail data. 
     * @type {string}
     */
    this.base64 = data.base64;

    // for precomputed thumb or in case if already generated

    /** Thumbnail image format. 
     * @type {string}     
     */
    this.format = data.format;

    /** Thumbnail JPEG compression. */
    this.jpegCompression = data.jpegCompression;

    /** Thumbnail quality. 
     * @type {number}
     */
    this.quality = data.quality;

    /** Originally requested thumbnail width. 
     * @type {number}
     */
    this.requestedWidth = data.requestedWidth;

    /** Originally requested thumbnail height. 
     * @type {number}
     */
    this.requestedHeight = data.requestedHeight;
};

/** Thumbnail implementation.
 * @class
 * @augments BaseImage
 */
var Thumbnail = function (imgId, data) {
    this.id = imgId;
    data = data || {};

    udateFields.call(this, data);

    // URL templates
    this.selfUrl = data.thumb;
    this.thumbUrl = null;
};

Thumbnail.prototype = {
    updateData: function (image) {
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
    
    clear: function () {
        this.id = null;
        this.selfUrl = null;
        this.base64 = null;
    }
};

module.exports = Thumbnail;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
﻿// JavaScript include for web-based scanning.
// Copyright 2011-2015 by Atalasoft, a Kofax Company.
// All rights reserved.


// dependencies
var logger = __webpack_require__(1),
    service = __webpack_require__(3),
    $ = __webpack_require__(0);

// private fields
var fileUrl,
    splitFileUrl,
    filesCollectionUrl;

/** FileApi implementation.
 * @class
 * @param {object} session
 * @private
 */
function FileApi(session) {
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
                format: fmt || (opt ? opt.format : undefined),
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
            service.del(filesCollectionUrl + '?age=' + hours, {}, async)
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
    /** Gets file as base64 string. 
     * @memberof FileApi
     * @instance
     * @deprecated Use async version of the method instead.
     */
    asBase64String: function (fid, fmt, opt) {
        return genericSyncFunction(asBase64String(fid, fmt, opt, false), '');
    },

    /** Saves local file from specified base64 string. 
     * @memberof FileApi
     * @instance
     * @deprecated Use async version of the method instead.
     */
    fromBase64String: function (base64) {
        return genericSyncFunction(fromBase64String(base64, false));
    },

    /** Gets a list of local files. 
     * @memberof FileApi
     * @instance
     * @deprecated Use async version of the method instead.
     */
    list: function () {
        return genericSyncFunction(list(false));
    },

    /** Removes specified local file from disk.
     * @memberof FileApi
     * @instance
     * @deprecated Use async version of the method instead.
     */
    remove: function (fid) {
        return genericSyncFunction(remove(fid, false), false);
    },

    /** Removes all persisted local files.
     * @memberof FileApi
     * @instance
     * @deprecated Use async version of the method instead.
     */
    removeAll: function () {
        return genericSyncFunction(removeAll(false), false);
    },

    /** Removes local files older than specific age (in hours).
     * @memberof FileApi
     * @instance
     * @deprecated Use async version of the method instead.
     */
    globalPurgeByAge: function (hours) {
        return genericSyncFunction(globalPurgeByAge(hours, false), false);
    }
};

// Asynchronous APIs - supported in all browsers
var asyncApi = {
    /** Gets file as base64 string. 
         * @memberof FileApi
         * @instance
         */
    asBase64StringAsync: function (callback, fid, fmt, opt) {
        genericAsyncFunction(asBase64String(fid, fmt, opt, true), callback, '');
    },

    /** Saves local file from specified base64 string. 
         * @memberof FileApi
         * @instance
         */
    fromBase64StringAsync: function (base64, callback) {
        genericAsyncFunction(fromBase64String(base64, true), callback);
    },

    /** Gets a list of local files. 
         * @memberof FileApi
         * @instance
         */
    listAsync: function (callback) {
        genericAsyncFunction(list(true), callback);
    },

    /** Removes specified local file from disk.
         * @memberof FileApi
         * @instance
         */
    removeAsync: function (fid, callback) {
        genericAsyncFunction(remove(fid, true), callback, false);
    },

    /** Removes all persisted local files.
         * @memberof FileApi
         * @instance
         */
    removeAllAsync: function (callback) {
        genericAsyncFunction(removeAll(true), callback, false);
    },

    /** Removes local files older than specific age (in hours).
         * @memberof FileApi
         * @instance
         */
    globalPurgeByAgeAsync: function (hours, callback) {
        genericAsyncFunction(globalPurgeByAge(hours, true), callback, false);
    },

    /** Splits specified local file into chunks.
         * @memberof FileApi
         * @instance
         */
    splitToFiles: function (callback, fid, parameters) {
        genericAsyncFunction(splitToFiles(fid, parameters), callback);
    }
};

// public Local File API
FileApi.prototype = $.extend({}, syncApi, asyncApi);
module.exports = FileApi;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
﻿

// dependencies
var logger = __webpack_require__(1),
    service = __webpack_require__(3);

// private fields
var scanUrl,
    importUrl,
    settingsDialogUrl,
    supportedValuesUrl,
    currentValuesUrl;

/** ScanApi implementation.
 * @class
 * @param {object} session
 * @private
 */
var ScanApi = function (session, scanClient) {
    scanUrl = session.scan;
    importUrl = session.importFiles;
    settingsDialogUrl = session.settingsDialog;
    supportedValuesUrl = session.supportedValues;
    currentValuesUrl = session.currentValues;
    this.scanClient = scanClient;
};

ScanApi.prototype = {
    uninitialize: function () {
        scanUrl = undefined;
        importUrl = undefined;
        settingsDialogUrl = undefined;
        supportedValuesUrl = undefined;
        currentValuesUrl = undefined;
    },

    /** Starts scanning session.
     */
    start: function (options) {
        logger.scope('Scan.start()', function () {
            service.post(scanUrl, options, true)
                .fail(function (jqXhr, textStatus, errorThrown) {
                    logger.error('Scan.start() error ' + textStatus + '; ' + errorThrown);
                    if (this.scanClient) {
                        this.scanClient.reportBrokenConnection();
                    }
                });
        });
        return true;
    },


    /** Aborts scanning session.
     */
    abort: function () {
        // send delete to scan.
        logger.scope('Scan.abort()', function () {
            service.del(scanUrl, {}, false)
                .fail(function (jqXhr, textStatus, errorThrown) {
                    logger.error('Scan.abort() error ' + textStatus + '; ' + errorThrown);
                });
        });
        return true;
    },

    /** Starts local file import.
     */
    importFiles: function (options) {
        logger.scope('Scan.importFiles()', function () {
            service.post(importUrl, options, true)
                .fail(function (jqXhr, textStatus, errorThrown) {
                    logger.error('Scan.importFiles() error ' + textStatus + '; ' + errorThrown);
                    if (this.scanClient) {
                        this.scanClient.reportBrokenConnection();
                    }
                });
        });
        return true;
    },

    /** Shows scanner settings dialog.
     */
    showSettingsDialog: function (options, callback) {
        logger.scope('Scan.showSettingsDialog()', function () {
            service.callDeferred(service.post, settingsDialogUrl, options, callback)
            .fail(function (jqXhr, textStatus, errorThrown) {
                logger.error('Scan.showSettingsDialog() error ' + textStatus + '; ' + errorThrown);
                callback({ complete: false });
                if (this.scanClient) {
                    this.scanClient.reportBrokenConnection();
                }
            });
        });
        return true;
    },

    /** Get supported values from a scanner.
     */
    getSupportedValues: function (options, callback) {
        logger.scope('Scan.getSupportedValues()', function () {
            service.callDeferred(service.post, supportedValuesUrl, options, callback)
            .fail(function (jqXhr, textStatus, errorThrown) {
                logger.error('Scan.getSupportedValues() error ' + textStatus + '; ' + errorThrown);
                callback({});
                if (this.scanClient) {
                    this.scanClient.reportBrokenConnection();
                }
            });
        });
        return true;
    },

    /** Get current values from a scanner.
     */
    getCurrentValues: function (options, callback) {
        logger.scope('Scan.getCurrentValues()', function () {
            service.callDeferred(service.post, currentValuesUrl, options, callback)
            .fail(function (jqXhr, textStatus, errorThrown) {
                logger.error('Scan.getCurrentValues() error ' + textStatus + '; ' + errorThrown);
                callback({});
                if (this.scanClient) {
                    this.scanClient.reportBrokenConnection();
                }
            });
        });
        return true;
    }
};

module.exports = ScanApi;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// This file contains slightly adopted CORS transport for IE 8/9.
// Base implementation was taken from https://github.com/jaubourg/ajaxHooks/blob/master/src/xdr.js
// Additional information can be found at http://bugs.jquery.com/ticket/8283
//
// Main difference from default implementation from jQuery guys (see the links above)
// is introduction of global associative array to hold Xdr objects.
// The reason for that is strange IE behavior when these objects are collected
// by GC and, as consequence, outstanding requests are being aborted. 
// Additional (though, quite shallow) can be found at https://github.com/faye/faye/pull/98

var jQuery = __webpack_require__(0);
module.exports = (function() {
    if (window.XDomainRequest) {

        // Global(sic!) map to hold Xdr object and prevent them from garbage collection
        var cachedXdrs = { NextId: 0 };

        jQuery.ajaxTransport(function(s) {

            if (s.crossDomain && s.async) {
                if (s.timeout) {
                    s.xdrTimeout = s.timeout;
                    delete s.timeout;
                }

                var xdr,
                    xdrId,
                    cachedXdr = cachedXdrs;

                return {
                    send: function(_, complete) {

                        function callback(status, statusText, responses, responseHeaders) {
                            xdr.onload = xdr.onerror = xdr.ontimeout = jQuery.noop;
                            xdr = undefined;

                            // Remove cached Xdr object from the cache
                            delete cachedXdr[xdrId];

                            complete(status, statusText, responses, responseHeaders);
                        }

                        // Create new Xdr object
                        xdr = new XDomainRequest();

                        // Here is the hack! Cached created Xdr object to prevent garbage collection
                        xdrId = (++cachedXdr.NextId).toString();
                        cachedXdr[xdrId] = xdr;

                        // Open the request first (before we initialize any callbacks!)
                        xdr.open(s.type, s.url);
                        xdr.timeout = s.xdrTimeout || Number.MAX_VALUE;

                        // Define callbacks
                        xdr.onprogress = function() {};

                        xdr.onload = function() {
                            callback(200, "OK", { text: xdr.responseText }, "Content-Type: " + xdr.contentType);
                        };

                        xdr.onerror = function() {
                            callback(500, "Not Found");
                        };

                        xdr.ontimeout = function() {
                            callback(0, "timeout");
                        };

                        // Actually execute the request. Note the timeout hack :(
                        // We need this to give bogus Xdr object additional time for initialization
                        setTimeout(function() {
                            xdr.send((s.hasContent && s.data) || null);
                        }, 0);
                    },
                    abort: function() {
                        if (xdr) {
                            // Remove cached Xdr object from the cache
                            delete cachedXdr[xdrId];

                            xdr.onerror = jQuery.noop;
                            xdr.abort();
                        }
                    }
                };
            }
        });
    }
})();

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
﻿

// dependencies
var $ = __webpack_require__(0),
    errorsManager = __webpack_require__(2);


/** 
 * This object is responsible for returning information from KIC, such as the content-types and content-type document descriptions, and for importing uploaded documents into Kofax Capture.
 * @alias Atalasoft.Controls.Capture.CaptureService
 * @namespace Atalasoft.Controls.Capture.CaptureService
 */
module.exports = {
    __resetFields: function() {
        this._params = {};

        this.contentType = "";
        this.contentTypeDescriptionName = "";
        this.contentTypeDescription = {};
        this.contentTypeDescriptionArray = [];
        this.documentFilename = "";
        this.currentImportId = "";
        this.currentStatus = "";
        this.loosePages = false;
        this.loosePageDisplayName = "";
        this.indexFieldsForDocumentClass = {};
        this.indexFieldsForDocumentClassArray = [];
        this.indexFieldValuesForDisplay = {};
        this.batchFieldValuesForDisplayList = {};
        this.batchFieldArray = [];
        this.fieldValuesForImport = {};
        this.customValidationCollection = {};
    },
    __getContentTypeDocs: function(contentType) {
        var that = this;
        this.getContentTypeDescription(contentType,
            function(contentTypeDescriptionArray) {
                var contentTypeDocumentList = $('.atala-content-type-document-list')[0];
                if (contentTypeDocumentList) {
                    // clear out old ones
                    while (contentTypeDocumentList.length > 0) contentTypeDocumentList.remove(0);

                    //To filter the list
                    if (that._params.removedContentTypeDescriptions !== undefined) {
                        var filteredContentTypeDescriptionArray = that.__filterContentTypeDescriptionList(contentTypeDescriptionArray, that._params.removedContentTypeDescriptions);

                        that.__buildContentTypeDescriptionDropDown(that, contentType, filteredContentTypeDescriptionArray, contentTypeDocumentList);
                    } else {
                        that.__buildContentTypeDescriptionDropDown(that, contentType, contentTypeDescriptionArray, contentTypeDocumentList);
                    }

                    if (that._params.onContentTypeDescriptionsCreated !== undefined)
                        that._params.onContentTypeDescriptionsCreated();
                }
            },
            function(error, params) {
                that._params.onError(error, { statusText: params.xhr.statusText });
            }
        );
    },

    __filterContentTypeDescriptionList: function(contentTypeDescriptionArray, removalList) {

        var filteredArray = [];
        var toRemove = removalList.split(",");

        for (var removeIndex = 0; removeIndex < toRemove.length; removeIndex++) {
            toRemove[removeIndex] = toRemove[removeIndex].trim();
        }

        for (var arrayIndex = 0; arrayIndex < contentTypeDescriptionArray.length; arrayIndex++) {
            if (this.__inArray(contentTypeDescriptionArray[arrayIndex].documentClass, toRemove) === -1) {
                filteredArray.push(contentTypeDescriptionArray[arrayIndex]);
            }
        }

        return filteredArray;
    },

    __buildContentTypeDescriptionDropDown: function(that, contentType, contentTypeDescriptionArray, contentTypeDescDropDown) {
        // put in the new list
        that.contentTypeDescriptionArray = contentTypeDescriptionArray;
        that.contentTypeDescription = contentTypeDescriptionArray[0];

        //Add the rest of the doc class / formtypes. 
        for (var cDocs in contentTypeDescriptionArray) {
            var opt = new Option(contentTypeDescriptionArray[cDocs].documentClass);
            contentTypeDescDropDown.add(opt);
        }

        //Add a blank option for loosepages.
        if (that.loosePages === true) {
            if (that._params.displayedLoosePagesForContentType !== undefined) {
                var displayedLoosePages = that._params.displayedLoosePagesForContentType.split(',');
                for (var pageIndex = 0; pageIndex < displayedLoosePages.length; pageIndex++) {
                    displayedLoosePages[pageIndex] = displayedLoosePages[pageIndex].trim();
                }

                if (this.__inArray(contentType, displayedLoosePages) !== -1) {
                    that.__addLoosePageOption(contentTypeDescDropDown, that.loosePageDisplayName);
                }
            } else {
                that.__addLoosePageOption(contentTypeDescDropDown, that.loosePageDisplayName);
            }

        }

        if ($('.atala-indexfield-list').length > 0 || $('.atala-batchfield-list').length > 0) {
            that.__getIndexAndBatchFields(that.contentType, that.contentTypeDescription);
        }
    },

    __addLoosePageOption: function(contentTypeDescDropDown, loosePageDisplayName) {
        var looseOption;
        if (loosePageDisplayName === undefined) {
            looseOption = new Option('');
        } else {
            looseOption = new Option(loosePageDisplayName);
        }
        contentTypeDescDropDown.add(looseOption);
    },

    __getContentTypeDocsWithNoUI: function(contentType, contentTypeDescriptionName) {
        var that = this;
        that.contentTypeDescriptionName = contentTypeDescriptionName;
        this.getContentTypeDescription(contentType,
            function(contentTypeDescriptionArray) {
                that.contentTypeDescriptionArray = contentTypeDescriptionArray;

                for (var cDocs in contentTypeDescriptionArray) {
                    if (contentTypeDescriptionArray[cDocs].documentClass === that.contentTypeDescriptionName) {
                        that.contentTypeDescription = contentTypeDescriptionArray[cDocs];
                    }
                }
            },
            function(error, params) {
                that._params.onError(error, { statusText: params.xhr.statusText });
            }
        );
    },

    __getIndexAndBatchFields: function(contentType, docClass) {
        var that = this;
        var ifield;
        var documentClassNameForServer = "";
        if (docClass !== undefined) {
            var dClass = docClass.documentClass;
            var splitDocClass = [];
            var hasFormType = this.__inArray(" / ", dClass);

            //Sharepoint doesn't have formtypes, so as long as the sharepoint handler doesn't do anything more than 
            //the parent handler it should deal with it just fine, i.e. [] is all that ever gets returned. 
            if (hasFormType !== -1) {
                splitDocClass = dClass.split(" / ");
                documentClassNameForServer = splitDocClass[0];
            } else {
                documentClassNameForServer = dClass;
            }
        }

        if (this._params.displayedIndexFields === "" || this._params.displayedIndexFields === undefined) {
            that.indexFieldsForDocumentClass = "";
        } else {
            var tempindexFieldsDisplayed = this._params.displayedIndexFields.split(',');
            for (ifield = 0; ifield < tempindexFieldsDisplayed.length; ifield++) {
                tempindexFieldsDisplayed[ifield] = tempindexFieldsDisplayed[ifield].trim();
            }
            that.indexFieldsForDocumentClass = tempindexFieldsDisplayed;
        }

        if (docClass !== undefined) {
            //Add batch fields.
            if ($('.atala-batchfield-list').length > 0) {
                that.__buildBatchFieldTable(that._params.displayedBatchFields, contentType, true);
            }
            //Add index fields.
            this.getIndexFieldsForDocumentClass(contentType, documentClassNameForServer,
                function(indexFieldsForDocClassArray) {
                    var indexFieldName = [];
                    var indexFieldInfo = [];
                    var indexFieldRequired = "";

                    if ($('.atala-indexfield-list').length > 0) {
                        if ($('#atala-indexfield-table tr').length !== 0 || $('#atala-indexfield-table') !== undefined) {
                            //Clear out the old ones.                    
                            $('#atala-indexfield-table').remove();
                        }

                        //Make the table.
                        $('<table id=atala-indexfield-table></table>').appendTo('.atala-indexfield-list');

                        //Add the new ones.
                        that.indexFieldsForDocumentClassArray = indexFieldsForDocClassArray;

                        // if indexFieldsForDocumentClass is empty, there IS a UI
                        if (that.indexFieldsForDocumentClass === "" || that.indexFieldsForDocumentClass === undefined) {
                            that.__drawIndexFieldTable(indexFieldsForDocClassArray, true);
                        }
                        // case when there is NO UI
                        else {
                            that.__drawIndexFieldTable(indexFieldsForDocClassArray, false);
                        }
                        //Fire the indexField table created event.            
                        if (that._params.onIndexFieldsCompleted !== undefined) {
                            that._params.onIndexFieldsCompleted(true);
                        }
                    }
                },
                function(error_params) {
                    that._params.onError(error_params, { statusText: error_params.xhr.statusText });
                }
            );

        } else {
            that.__buildBatchFieldTable(that._params.displayedBatchFields, contentType, false);
        }
    },

    __drawIndexFieldTable: function(indexFieldsForDocClassArray, dontDoArrayCheck) {
        var that = this;
        for (var iFields = 0; iFields < indexFieldsForDocClassArray.length; iFields++) {
            var requiredCSSClassHtml = '',
            indexFieldName = indexFieldsForDocClassArray[iFields].indexField.split(" / "),
            indexFieldInfo = indexFieldName[1].split(" ^ "),
            indexFieldRequired = indexFieldInfo[1],
            indexFieldHidden = indexFieldInfo[2];

            if (indexFieldRequired === 'true') {
                // add to required css class
                requiredCSSClassHtml = ' class="atala-indexfield-required"';
            }

            if (indexFieldHidden === 'true') {
                requiredCSSClassHtml = ' class="atala-field-hidden"';
            }

            if (dontDoArrayCheck || this.__inArray(indexFieldName[0], that.indexFieldsForDocumentClass) !== -1) {
                var fieldId = that.__replaceWhiteSpace(indexFieldName[0]) + '_indexFieldInputId';
                $('<tr><td><label' + requiredCSSClassHtml + ' for=\'' + fieldId + '\'>' + indexFieldName[0] + '</label></td><td><input type=\'text\' ' + requiredCSSClassHtml + ' id=\'' + fieldId + '\' /></td></tr>').appendTo('#atala-indexfield-table');

            }
            //Fire the indexField created event.            
            if (that._params.onIndexFieldCompleted !== undefined) {
                that._params.onIndexFieldCompleted(indexFieldName[0]);
            }
        }
    },

    __buildBatchFieldTable: function(displayedBatchFields, contentType, batchFieldDivPresent) {
        var that = this;
        //Here the list of batch fields that should be displayed when filtering is being used is done.
        if (displayedBatchFields === "" || displayedBatchFields === undefined) {
            that.batchFieldValuesForDisplayList = "";
        } else {
            var tempBatchFieldsDisplayed = this._params.displayedBatchFields.split(',');
            for (var ifield = 0; ifield < tempBatchFieldsDisplayed.length; ifield++) {
                tempBatchFieldsDisplayed[ifield] = tempBatchFieldsDisplayed[ifield].trim();
            }
            that.batchFieldValuesForDisplayList = tempBatchFieldsDisplayed;
        }

        if (batchFieldDivPresent) {
            that.getBatchFields(contentType,
                function(batchFieldArray) {
                    if ($('#atala-batchfield-table tr').length !== 0 || $('#atala-batchfield-table') !== undefined) {
                        //Clear out the old ones.                    
                        $('#atala-batchfield-table').remove();
                    }

                    that.batchFieldArray = batchFieldArray;

                    //Make the table.
                    $('<table id=atala-batchfield-table></table>').appendTo('.atala-batchfield-list');

                    //Build the list when there's no filtering.
                    if (that._params.displayedBatchFields === undefined || that._params.displayedBatchFields === "") {
                        that.__drawBatchFieldRow(batchFieldArray, true);
                    }
                    //Build the list when there is filtering.
                    else {
                        that.__drawBatchFieldRow(batchFieldArray, false);
                    }
                    //Fire the onBatchFieldsCompleted event. 
                    if (that._params.onBatchFieldsCompleted !== undefined) {
                        that._params.onBatchFieldsCompleted(true);
                    }
                },
                function(error_params) {
                    that._params.onError(error_params, { statusText: error_params.xhr.statusText });
                });
        } else {
            that.getBatchFields(contentType,
                function(batchFieldArray) {
                    //Set for use later -- later being when scraping results from the page.
                    that.batchFieldArray = batchFieldArray;

                    var indexFieldName = [];
                    var indexFieldInfo = [];
                    var indexFieldRequired = "";

                    if ($('.atala-batchfield-list').length > 0) {
                        if ($('#atala-indexfield-table tr').length !== 0 || $('#atala-indexfield-table') !== undefined) {
                            //Clear out the old ones.                    
                            $('#atala-indexfield-table').remove();
                        }
                    }

                    if ($('.atala-indexfield-list').length > 0 && $('.atala-batchfield-list').length === 0) {
                        if ($('#atala-indexfield-table tr').length !== 0 || $('#atala-indexfield-table') !== undefined) {
                            //Clear out the old ones.                    
                            $('#atala-indexfield-table').remove();
                        }

                        //Make the table.
                        $('<table id=atala-indexfield-table></table>').appendTo('.atala-indexfield-list');

                        //Build the list when there's no filtering. 
                        if (that.batchFieldValuesForDisplayList === "" || that.batchFieldValuesForDisplayList === undefined) {
                            that.__drawBatchFieldRow(batchFieldArray, true);
                        }
                        //Build the list when there is filtering.
                        else {
                            that.__drawBatchFieldRow(batchFieldArray, false);
                        }
                    }
                    //Fire the onBatchFieldsCompleted event. 
                    if (that._params.onBatchFieldsCompleted !== undefined) {
                        that._params.onBatchFieldsCompleted(true);
                    }
                },
                function(error_params) {
                    that._params.onError(error_params, { statusTest: error_params.xhr.statusText });
                });
        }
    },

    __drawBatchFieldRow: function(batchFieldArray, dontDoArrayCheck) {
        var that = this;
        for (var iFields = 0; iFields < batchFieldArray.length; iFields++) {
            var requiredCSSClassHtml = '',
            indexFieldName = batchFieldArray[iFields].batchField.split(" / "),
            indexFieldInfo = indexFieldName[1].split(" ^ "),
            indexFieldRequired = indexFieldInfo[1],
            fieldHidden = indexFieldInfo[2];

            if (indexFieldRequired === 'true') {
                // add to required css class
                requiredCSSClassHtml = ' class="atala-indexfield-required"';
            }

            if (fieldHidden === 'true') {
                requiredCSSClassHtml = ' class="atala-field-hidden"';
            }

            if (dontDoArrayCheck || this.__inArray(indexFieldName[0], that.batchFieldValuesForDisplayList) !== -1) {
                var fieldId = that.__replaceWhiteSpace(indexFieldName[0]) + '_batchFieldInputId';
                var fieldHtml = '<tr><td><label' + requiredCSSClassHtml + ' for=\'' + fieldId + '\'>' + indexFieldName[0] + '</label></td><td><input type=\'text\' ' + requiredCSSClassHtml + ' id=\'' + fieldId + '\'/></td></tr>';

                if ($('.atala-batchfield-list').length > 0) {
                    $(fieldHtml).appendTo('#atala-batchfield-table');
                } else {
                    $(fieldHtml).appendTo('#atala-indexfield-table');
                }
                //Fire the batch field created event.
                if (that._params.onBatchFieldCompleted !== undefined) {
                    that._params.onBatchFieldCompleted(indexFieldName[0]);
                }
            }
        }
    },

    __replaceWhiteSpace: function(fieldName) {
        //This is a regex to get All The Whitespace. 
        return fieldName.replace(/\s/g, "_");
    },

    __inArray: function(elem, arr, i) {
        var len;
        var core_indexOf = Array.prototype.indexOf;
        if (arr) {
            if (core_indexOf) {
                return core_indexOf.call(arr, elem, i);
            }

            len = arr.length;
            i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

            for (; i < len; i++) {
                // Skip accessing in sparse arrays
                if (arr[i] === elem) {
                    return i;
                }
            }
        }

        return -1;
    },


    __setCurrentImportId: function(importId) {
        this.currentImportId = importId;
    },

    __scrapeFieldValues: function(fieldNamesArray, isBatchField, that) {
        var field;
        var fieldName;
        var fieldValue;
        var typeRequired;
        var hasValue;
        var result = [];

        if (fieldNamesArray === undefined)
            return result;

        for (var index = 0; index < fieldNamesArray.length; index++) {
            if (isBatchField) {
                field = fieldNamesArray[index].batchField.split(' / ');
            } else {
                field = fieldNamesArray[index].indexField.split(' / ');
            }

            //get the name that was returned form the server.
            fieldName = field[0];

            if (isBatchField) {
                fieldValue = $('#' + that.__replaceWhiteSpace(fieldName) + '_batchFieldInputId').val();
            } else {
                fieldValue = $('#' + that.__replaceWhiteSpace(fieldName) + '_indexFieldInputId').val();
            }

            //Determine if the field was required.
            typeRequired = field[1].split(' ^ ');
            hasValue = fieldValue !== undefined && fieldValue !== "";

            //This is just to make sure that 'undefined' doesn't get sent to the handler and muck with validation on the server side.
            if (!hasValue) {
                fieldValue = "";
            }

            if (isBatchField) {
                fieldName = "batchField_" + fieldName;
                that.fieldValuesForImport[fieldName] = encodeURIComponent(fieldValue);
            } else {
                fieldName = "indexField_" + fieldName;
                that.fieldValuesForImport[fieldName] = encodeURIComponent(fieldValue);
            }

            if (typeRequired[1] === 'true' && !hasValue) {
                result.push(true);
            } else {
                //compile a list of the errant input values to return to the client to do something about.
                result.push(false);
            }

            //The validation collection to return to the client.
            that.customValidationCollection[fieldName] = {};
            that.customValidationCollection[fieldName].name = fieldName;
            that.customValidationCollection[fieldName].value = fieldValue;
            that.customValidationCollection[fieldName].fieldType = typeRequired[0];
            that.customValidationCollection[fieldName].required = typeRequired[1];


        }
        //Check that the client even cares to do something with the validation results. 
        if (isBatchField) {
            if (that._params.onBatchFieldTypeValidationStatus !== undefined) {
                that._params.onBatchFieldTypeValidationStatus(that.customValidationCollection);
            }
        } else {
            if (that._params.onIndexFieldTypeValidationStatus !== undefined) {
                that._params.onIndexFieldTypeValidationStatus(that.customValidationCollection);
            }
        }
        return result;
    },

    __getFieldListValuesForImport: function(indexFieldNamesArray, batchFieldNameArray) {
        var that = this;
        var result = [];

        if (indexFieldNamesArray !== undefined && indexFieldNamesArray.length > 0) {
            result.push(that.__scrapeFieldValues(indexFieldNamesArray, false, that));
        }

        if (batchFieldNameArray !== undefined && batchFieldNameArray.length > 0) {
            result.push(that.__scrapeFieldValues(batchFieldNameArray, true, that));
        }

        return result;
    },

    __checkIndexFieldValidationResults: function(requireFieldsHaveValues) {

        var key;
        for (var outer = 0; outer < requireFieldsHaveValues.length; outer++) {
            for (key = 0; key < requireFieldsHaveValues[outer].length; key++) {
                if (requireFieldsHaveValues[outer][key] === true)
                    return false;
            }
        }

        return true;
    },

    __setIndexFieldsWithNoUi: function(indexFieldNamesAndValues) {
        var that = this;
        var indexFieldNameValuePairs = indexFieldNamesAndValues.split(",");

        if (indexFieldNameValuePairs.length === 1) {
            indexFieldNameValuePairs[0] = indexFieldNameValuePairs[0].trim();
        } else {
            for (var index = 0; index < indexFieldNameValuePairs.length; index++) {
                indexFieldNameValuePairs[index] = indexFieldNameValuePairs[index].trim();
            }
        }

        for (var nameValuesIndex = 0; nameValuesIndex < indexFieldNameValuePairs.length; nameValuesIndex++) {
            var nameValuePair = indexFieldNameValuePairs[nameValuesIndex].split(":");
            that.fieldValuesForImport["indexField_" + nameValuePair[0]] = encodeURIComponent(nameValuePair[1]);
        }

    },

    __setBatchFieldsWithNoUi: function(batchFieldNamesAndValues) {
        var that = this;
        var batchFieldNameValuePairs = batchFieldNamesAndValues.split(",");
        var index;
        //Clean up surrounding whitespaces. 
        for (index = 0; index < batchFieldNameValuePairs.length; index++) {
            batchFieldNameValuePairs[index] = batchFieldNameValuePairs[index].trim();
        }

        //Set the batch field values. 
        for (index = 0; index < batchFieldNameValuePairs.length; index++) {
            var nameValuePair = batchFieldNameValuePairs[index].split(":");
            that.fieldValuesForImport["batchField_" + nameValuePair[0]] = encodeURIComponent(nameValuePair[1]);
        }
    },

    __setLoosePages: function(setting) {
        var loosePageArray = setting.split(',');
        if (loosePageArray[0] === "true") {
            this.loosePages = true;
        }
        if (loosePageArray.length === 2) {
            this.loosePageDisplayName = loosePageArray[1].trim();
        }
    },

    __buildContentTypeList: function(selectionBox, ContentTypeList, that) {
        for (var cType in ContentTypeList) {
            var opt = new Option(ContentTypeList[cType]);
            selectionBox.add(opt);
        }

        if (that._params.onContentTypesCreated !== undefined)
            that._params.onContentTypesCreated();
    },

    __filterContentTypes: function(contentTypes, contentTypesToRemove, defaultContentType) {
        var filteredContentTypes = [];
        var cTypesToRemove = [];

        if (defaultContentType !== undefined) {
            filteredContentTypes.push(defaultContentType);
        }

        var cTypeIndex;
        if (contentTypesToRemove !== undefined) {
            cTypesToRemove = contentTypesToRemove.split(",");


            for (var trimIndex = 0; trimIndex < cTypesToRemove.length; trimIndex++) {
                cTypesToRemove[trimIndex] = cTypesToRemove[trimIndex].trim();
            }

            for (cTypeIndex = 0; cTypeIndex < contentTypes.length; cTypeIndex++) {
                if (this.__inArray(contentTypes[cTypeIndex], cTypesToRemove) === -1) {
                    filteredContentTypes.push(contentTypes[cTypeIndex]);
                }
            }
        } else {
            for (cTypeIndex = 0; cTypeIndex < contentTypes.length; cTypeIndex++) {
                if (contentTypes[cTypeIndex] !== defaultContentType) {
                    filteredContentTypes.push(contentTypes[cTypeIndex]);
                }
            }
        }

        return filteredContentTypes;
    },

    __beforeImporting: function(that) {
        var result = true;

        if (that._params.onBeforeImport !== undefined) {
            result = that._params.onBeforeImport();
        }
        return result;
    },

    /** Checks if Document Service is initialized or not.
      * @returns {boolean} true if initialized, false otherwise.
      */
    isInitialized: function() {
        return this._params && this._params.handlerUrl;
    },

    /**
     * Document import complete event.
     * @event Atalasoft.Controls.Capture.CaptureService#onImportComplete
     * @type {onCaptureCompleteCallback}
     */

    /**
     * Callback signature for {@link Atalasoft.Controls.Capture.CaptureService#event:onImportComplete| onImportComplete} event.
     * @param {Object} data - Data object received from server.
     * @param {string} id - imported document identifier.
     *
     * @callback onCaptureCompleteCallback
     */

    /**
     * Document import error event.
     * @event Atalasoft.Controls.Capture.CaptureService#onError
     * @type {onCaptureError}
     */

    /**
     * Callback signature for {@link Atalasoft.Controls.Capture.CaptureService#event:onError| onError} event.
     * @callback onCaptureErrorCallback
     * @param {string} error - Error identifier, one of {@link Atalasoft.Controls.Capture.Errors}.
     * @param {Object} data - Additional error data.
     * @param {string} data.message - Technical error message.
     */

    /**
     * Callback signature for {@link CaptureOptions|onBeforeImport} parameter.
     *
     * @returns {boolean} - Value indicating whether import should be started.
     *
     * This callback could be used to intercept import triggered from automatically generated UI.
     * @callback onBeforeImportCallback
     *
     */

    /**
     * Document import status event.
     * @event Atalasoft.Controls.Capture.CaptureService#onTrackStatus
     * @type {onTrackStatusReceivedCallback}
     */
    /**
     * Callback signature for {@link Atalasoft.Controls.Capture.CaptureService#event:onTrackStatus|onTrackStatus} event.
     * @param {string} status - Document import status.
     * @callback onTrackStatusReceivedCallback
     */

    /**
     * Index fields validation error event.
     * @event Atalasoft.Controls.Capture.CaptureService#onIndexFieldImportValidationError
     * @type {onFieldsValidationErrorCallback}
     */

    /**
     * Batch fields validation error event.
     * @event Atalasoft.Controls.Capture.CaptureService#onBatchFieldImportValidationError
     * @type {onFieldsValidationErrorCallback}
     */

    /**
     * Callback signature for {@link Atalasoft.Controls.Capture.CaptureService#event:onIndexFieldImportValidationError|onIndexFieldImportValidationError} event.
     * @param {string} error - Error identifier, one of {@link Atalasoft.Controls.Capture.Errors}.
     * @param {boolean[]} validationResults - Array of field validation results.
     * @callback onFieldsValidationErrorCallback
     */

    /**
     * Index field rendering completed event.
     * @event Atalasoft.Controls.Capture.CaptureService#onIndexFieldCompleted
     * @type {onFieldRenderCompleteCallback}
     */

    /**
     * Batch field rendering completed event.
     * @event Atalasoft.Controls.Capture.CaptureService#onBatchFieldCompleted
     * @type {onFieldRenderCompleteCallback}
     */

    /**
     * Callback signature for {@link Atalasoft.Controls.Capture.CaptureService#event:onIndexFieldCompleted|onIndexFieldCompleted} and {@link Atalasoft.Controls.Capture.CaptureService#event:onBatchFieldCompleted|onBatchFieldCompleted} events.
     * @param {string} field - The field name.
     * @callback onFieldRenderCompleteCallback
     */

    /**
     * {@link Atalasoft.Controls.Capture.CaptureService} initialization parameters.
     * @property {string} handlerUrl - The URL to the web capture request handler. See {@tutorial 2-4-capture-server-handlers} for handler configuration details.
     *
     * @property {onCaptureCompleteCallback} [onImportCompleted] - {@link Atalasoft.Controls.Capture.CaptureService#event:onImportComplete|Document import complete} event handler.
     * @property {onCaptureErrorCallback} [onError] - {@link Atalasoft.Controls.Capture.CaptureService#event:onError| Document import error} event handler.
     * @property {onBeforeImportCallback} [onBeforeImport] - The function passed in through this parameter will be run prior to importing a document to KC.
     * @property {onTrackStatusReceivedCallback} [onTrackStatusReceived] - {@link Atalasoft.Controls.Capture.CaptureService#event:onTrackStatus|Document import status} event handler
     *
     * @property {notificationCallback} [onContentTypesCreated] - Callback that is called when content type selection box has been populated.
     *
     * @property {notificationCallback} [onContentTypeDescriptionsCreated] - Callback that is called when content type description selection box has been populated.
     *
     * @property {onFieldsValidationErrorCallback} [onIndexFieldImportValidationError] - {@link Atalasoft.Controls.Capture.CaptureService#event:onIndexFieldImportValidationError | onIndexFieldImportValidationError} event handler.
     *
     * @property {onFieldsValidationErrorCallback} [onBatchFieldImportValidationError] - {@link Atalasoft.Controls.Capture.CaptureService#event:onBatchFieldImportValidationError| onBatchFieldImportValidationError} event handler.
     *
     * @property {onFieldRenderCompleteCallback} [onIndexFieldCompleted] - Use this parameter to customize event behavior when an index field label, and input field have been created.
     * @property {onFieldRenderCompleteCallback} [onBatchFieldCompleted] - Use this parameter to customize behavior after each batch field label, and input field have been created.
     *
     * @property {notificationCallback} [onIndexFieldsCompleted] - Use this parameter to customize event behavior for after all index field labels and input fields have been created.
     * @property {notificationCallback} [onBatchFieldsCompleted] - Use this parameter to customize behavior after all of the batch fields labels and input fields have been created.
     *
     * @property {string} [contentType] - Use this parameter when the client is not bound to any UI elements in a page to set the batch class or repository name for KIC. See {@tutorial 2-3-connect-to-ui}.
     *
     * @property {string} [defaultContentType] - Use this parameter to specify one content type to be the content type first displayed and selected when the list is populated.
     *
     * @property {string} [contentTypeDescriptionName] - Use this parameter when the client is not bound to any UI elements in a page to set the KIC document class/form type pair.
     *
     * @property {string} [removedContentTypes] - Use this parameter to filter the list of content types displayed in the content type selection drop down. The list (comma separated) specified in the parameter will be removed from the list.
     *
     * @property {string} [removedContentTypeDescriptions] - Use this parameter to filter the list of content type descriptions displayed in the content type document list selection drop down. The list (comma separated) specified in the parameter will be removed from the list.
     *
     * @property {string} [loosePages] - This parameter enables importing loose pages in to KC through KIC only. Set to "true" to enable. Default is false. To specify a loose pages selection text in the `atala-contenttype-document-list` selection set the parameter to "true, <any text>", if unspecified a blank entry is created. See {@tutorial 2-3-connect-to-ui}
     *
     * @property {string} [displayedLoosePagesForContentType] - Use this parameter in conjunction with the `loosePages` parameter. Will only apply to clients connecting to a KIC service. This take a comma separated list of batch class names which should have the loose pages option included in the content type description name drop down list.
     *
     * @property {string} [indexFields] - Comma separated list of index fields name-value pairs. Format `"Field1: Value1, Field2: Value2"`.
     *
     * Use this parameter when the client is not bound to the indexfield UI div to set the `indexfields` for the specified KC/KIC document class.
     * See {@tutorial 2-3-connect-to-ui}
     *
     * @property {string} [displayedIndexFields] - Comma separated list of displayed index fields.
     *
     * Use this parameter when the client is bound to the index field dive element to inclusively filter the list of index fields displayed. See {@tutorial 2-3-connect-to-ui}
     *
     * @property {string} [batchFields] -  Comma separated list of batch fields name-value pairs. Format `"Field1: Value1, Field2: Value2"`
     * Use this parameter when the client is not bound to the batchfield UI div to set the batch fields for the specified KC/KIC batch class.
     *
     * @property {string} [displayedBatchFields] - Comma separated list of displayed batch fields.
     * Use this parameter when the client is bound to the index field dive element to inclusively filter the list of batch fields displayed. See {@tutorial 2-3-connect-to-ui}
     *
     * @typedef CaptureOptions
     */

    /** 
     * Initializes the CaptureService component.
     *
     * As a side-effect, initialize starts a process that attempts to communicate with the KIC and obtain the content-type list and content-type document description list. If this process succeeds, it will populate the appropriate controls on the web page, if they exist with the correct classes.
     *
     * @param {CaptureOptions} params - Initialization parameters. This object must contain a `handlerUrl`, the other items are optional.
     *
     *
     */
    initialize: function(params) {
        this.__resetFields();
        this._params = params;
        var that = this;
        var validationResults = [];
        var validated = false;

        if ($('.atala-content-type-list')[0] !== undefined) {
            this.getContentTypeList(
                function(contentTypes) {
                    //Check if isKic param is set.
                    if (that._params.loosePages !== undefined) {
                        that.__setLoosePages(that._params.loosePages);
                    }

                    var contentTypeList = $('.atala-content-type-list')[0];

                    //Filter the contentTypeList if desired.
                    if (that._params.removedContentTypes !== undefined || that._params.defaultContentType !== undefined) {
                        var filteredContentTypes = that.__filterContentTypes(contentTypes, that._params.removedContentTypes, that._params.defaultContentType);

                        that.__buildContentTypeList(contentTypeList, filteredContentTypes, that);
                        that.contentType = filteredContentTypes[0];
                    } else {
                        that.__buildContentTypeList(contentTypeList, contentTypes, that);
                        that.contentType = contentTypes[0];
                    }

                    //Get doc classes. 
                    that.__getContentTypeDocs(that.contentType);

                    $('.atala-content-type-list').change(function() {
                        that.contentType = $('.atala-content-type-list option:selected').text();
                        that.__getContentTypeDocs(that.contentType);
                    });

                    $('.atala-content-type-document-list').change(function() {
                        that.contentTypeDescription = that.contentTypeDescriptionArray[$('.atala-content-type-document-list')[0].selectedIndex];
                        if ($('.atala-indexfield-list') !== undefined) {
                            that.__getIndexAndBatchFields(that.contentType, that.contentTypeDescription);
                        }
                    });
                    $('.atala-import-button').click(function() {
                        that.importDocument(
                            that.documentFilename, that.contentType, that.contentTypeDescription,
                            that._params.onImportCompleted, that._params.onError);
                    });
                    $('.atala-import-index-field-button').click(function() {
                        //For importing as a normal import.
                        if (that.contentTypeDescription !== undefined) {
                            validationResults = that.__getFieldListValuesForImport(that.indexFieldsForDocumentClassArray, that.batchFieldArray);
                            validated = that.__checkIndexFieldValidationResults(validationResults);

                            if (validated === true) {
                                that.importIndexFieldDocument(
                                    that.documentFilename, that.contentType, that.contentTypeDescription, that.fieldValuesForImport,
                                    that._params.onImportCompleted, that._params.onError);
                            } else {
                                //get the specific failing fields form that.customValidationCollection

                                that._params.onError(errorsManager.fieldValidationError, that.customValidationCollection);
                            }
                        }
                        //For importing a loose page.  Will only work with KIC/KC.
                        else {
                            validationResults = that.__getFieldListValuesForImport(undefined, that.batchFieldArray);
                            validated = that.__checkIndexFieldValidationResults(validationResults);

                            if (validated === true) {
                                that.importLoosePageDocument(that.documentFilename, that.contentType, that.fieldValuesForImport,
                                    that._params.onImportCompleted, that._params.onError);
                            } else {
                                that._params.onError(errorsManager.indexFieldValidationError, that.customValidationCollection);
                            }
                        }
                    });

                    $('.atala-track-import-button').click(function() {
                        that.trackImportStatus(that.currentImportId, that._params.onTrackStatusReceived);
                    });
                },
                function(error, params) {
                    that._params.onError(error, { statusText: params.xhr.statusText + ((params.xhr.responseText.indexOf("LicenseException") != -1) ? " - Licensing" : "") });
                }
            );
        } else {
            if ($('.atala-content-type-list')[0] !== undefined) {
                $('.atala-content-type-list').change(function() {
                    that.contentType = $('.atala-content-type-list option:selected').text();
                    that.__getContentTypeDocs(that.contentType);
                });
            }

            if ($('.atala-content-type-document-list')[0] !== undefined) {
                $('.atala-content-type-document-list').change(function() {
                    that.contentTypeDescription = that.contentTypeDescriptionArray[that.contentType];
                    that.__getIndexAndBatchFields(that.contentType, that.contentTypeDescription);
                });
            }

            if (that._params.contentType !== undefined && that._params.contentTypeDescriptionName !== undefined) {
                that.__getContentTypeDocsWithNoUI(that._params.contentType, that._params.contentTypeDescriptionName);
            }
            if (that._params.contentType !== undefined) {
                that.__getContentTypeDocs(that._params.contentType);
            }

            var docClass = [];
            if ($('.atala-indexfield-list')[0] !== undefined && that._params.contentType !== undefined) {
                if (that._params.contentTypeDescriptionName !== undefined) {
                    docClass.documentClass = that._params.contentTypeDescriptionName;
                    that.__getIndexAndBatchFields(that._params.contentType, docClass);
                } else {
                    that.__getIndexAndBatchFields(that._params.contentType, undefined);
                }
            } else {
                if (that._params.contentTypeDescriptionName !== undefined) {
                    docClass.documentClass = that._params.contentTypeDescriptionName;
                    if (that._params.indexFields !== undefined) {
                        that.__setIndexFieldsWithNoUi(that._params.indexFields);
                    }
                }
                if (that._params.batchFields !== undefined) {
                    that.__setBatchFieldsWithNoUi(that._params.batchFields);
                }
            }

            $('.atala-import-button').click(function() {
                that.importDocument(
                    that.documentFilename, that._params.contentType, that.contentTypeDescription,
                    that._params.onImportCompleted, that._params.onError);
            });

            $('.atala-import-index-field-button').click(function() {

                var fieldTypeCheck = false;

                //Importing when there's no index/batch field UI.
                if ($('.atala-indexfield-list')[0] === undefined) {
                    if (that._params.indexFields !== undefined) {
                        that.__setIndexFieldsWithNoUi(that._params.indexFields);
                    } else {
                        if (that._params.batchFields !== undefined) {
                            that.__setBatchFieldsWithNoUi(that._params.batchFields);
                        }
                    }
                } else {
                    if (that._params.contentTypeDescriptionName !== undefined) {
                        validationResults = that.__getFieldListValuesForImport(that.indexFieldsForDocumentClassArray);
                        fieldTypeCheck = true;
                    } else {
                        validationResults = that.__getFieldListValuesForImport(undefined, that.batchFieldArray);
                    }
                }


                if ($('.atala-indexfield-list')[0] !== undefined) {
                    validated = that.__checkIndexFieldValidationResults(validationResults);
                } else {
                    validated = true;
                }

                if (validated === true) {
                    if (that._params.contentTypeDescriptionName !== undefined) {
                        var cTypeDesc = [];
                        cTypeDesc.documentClass = that._params.contentTypeDescriptionName;
                        that.importIndexFieldDocument(
                            that.documentFilename, that._params.contentType, cTypeDesc, that.fieldValuesForImport,
                            that._params.onImportCompleted, that._params.onError);
                    } else {
                        that.importLoosePageDocument(that.documentFilename, that._params.contentType, that.fieldValuesForImport,
                            that._params.onImportCompleted, that._params.onError);
                    }
                } else {
                    if (fieldTypeCheck === true) {
                        that._params.onIndexFieldImportValidationError(errorsManager.indexFieldValidationError, validationResults.length > 0 ? validationResults[0] : []);
                    } else {
                        that._params.onBatchFieldImportValidationError(errorsManager.batchFieldValidationError, validationResults.length > 1 ? validationResults[1] : validationResults.length > 0 ? validationResults[0] : []);
                    }

                }
            });

            $('.atala-track-import-button, .atala-import-button').click(function() {
                that.trackImportStatus(that.currentImportId, that._params.onTrackStatusReceived);
            });
        }
    },

    /**
     * Disposed  the CaptureService. Removes auto-generated capture UI, if any.
     * @memberof Atalasoft.Controls.Capture.CaptureService
     * @returns {undefined}
     */
    dispose: function() {
        $('.atala-content-type-list, .atala-content-type-document-list').each(function(i, select) {
            $(select).empty().off('change');
        });

        $('.atala-import-index-field-button, .atala-track-import-button').each(function(i, btn) {
            $(btn).off('click');
        });
        $('.atala-batchfield-list, .atala-indexfield-list').each(function(i, div) {
            $(div).empty();
        });

        this.__resetFields();
    },

    /** 
     * Set batch fields outside of the initialization parameters. Currently this worksas it would if used in the initialization parameters, and is intended to be used when no UI for batch fields is present.
     * @param {string} batchFieldValues - Comma separated list of batch fields name-value pairs. Format `"Field1: Value1, Field2: Value2"`.
     * @returns undefined.
     * @memberof Atalasoft.Controls.Capture.CaptureService
     */
    setBatchFieldValues: function(batchFieldValues) {
        var that = this;
        if (batchFieldValues.length > 0 && batchFieldValues !== undefined) {
            that.__setBatchFieldsWithNoUi(batchFieldValues);
        }
    },

    /** 
     * Sets index fields outside of the initialization parameters. Currently this works as it would if used in the initialization parameters, and is intended to be used when no UI for index fields is present.
     *  @param {string} indexFieldValues - Comma separated list of batch fields name-value pairs. Format `"Field1: Value1, Field2: Value2"`.
     *  @returns undefined.
     *  @memberof Atalasoft.Controls.Capture.CaptureService
     */
    setIndexFieldValues: function(indexFieldValues) {
        var that = this;

        if (indexFieldValues.length > 0 && indexFieldValues !== undefined) {
            that.__setIndexFieldsWithNoUi(indexFieldValues);
        }
    },

    /** 
     * Triggers document import.
     * @param {string} filename -  The file name of the document.
     * @param {string} contentType - Document content type.
     * @param {string} [contentTypeDescription] - Content type description.
     * @param {onCaptureCompleteCallback} onImportCompleted - callback to be called in case of successful import.
     * @param {onCaptureErrorCallback} onErrorImport - callback to be called in case of failed import.
     * @memberof Atalasoft.Controls.Capture.CaptureService
     */
    importDocument: function(filename, contentType, contentTypeDescription, onImportCompleted, onErrorImport) {
        var that = this;
        var tempDocClass = "";
        var requestObj;

        if (contentTypeDescription !== undefined) {
            tempDocClass = contentTypeDescription.documentClass;
        }

        if (that.__beforeImporting(that)) {
            requestObj = {
                url: this._params.handlerUrl + "?cmd=importDocument",
                type: "POST",
                data: {
                    filename: filename,
                    contentType: contentType,
                    contentTypeDocumentClass: tempDocClass,
                    contentTypeDescription: JSON.stringify(contentTypeDescription)
                },
                dataType: "json",
                success:
                    function(data, jqXHR) {
                        if (data.success === "true") {
                            onImportCompleted(data, data.id, data.status, jqXHR);
                            that.__setCurrentImportId(data.id);
                        } else {
                            onErrorImport(errorsManager.importError, { message: data.errorMessage, xhr: jqXHR });
                        }
                    },
                error:
                    function(jqXHR, statusText) { onErrorImport(errorsManager.importError, { message: statusText, xhr: jqXHR }); }
            };

            $.ajax(requestObj);
        }

    },

    /**
     * Triggers document import with the specified fields.
     * @param {string} filename -  The file name of the document.
     * @param {string} contentType - Document content type.
     * @param {string} [contentTypeDescription] - Content type description.
     * @param {string} indexFields - String batch and index fields representation.
     * @param {onCaptureCompleteCallback} onImportCompleted - callback to be called in case of successful import.
     * @param {onCaptureErrorCallback} onErrorImport - callback to be called in case of failed import.
     * @memberof Atalasoft.Controls.Capture.CaptureService
     */
    importIndexFieldDocument: function(filename, contentType, contentTypeDescription, indexFields, onImportCompleted, onErrorImport) {
        var that = this;

        if (that.__beforeImporting(that)) {
            var requestObj = {
                url: this._params.handlerUrl + "?cmd=importDocumentWithIndexFields",
                type: "POST",
                data: {
                    filename: filename,
                    contentType: contentType,
                    contentTypeDocumentClass: contentTypeDescription.documentClass,
                    contentTypeDescription: JSON.stringify(contentTypeDescription),
                    indexFields: JSON.stringify(indexFields)
                },
                dataType: "json",
                success:
                    function(data, status, jqXHR) {
                        if (data.success === "true") {
                            onImportCompleted(data, data.id, data.status, jqXHR);
                            that.__setCurrentImportId(data.id);
                        } else {
                            onErrorImport(errorsManager.importError, { message: data.errorMessage, xhr: jqXHR });
                        }
                    },
                error:
                    function(jqXHR, statusText) { onErrorImport(errorsManager.importError, { message: statusText, xhr: jqXHR }); }
            };

            $.ajax(requestObj);
        }
    },

    /** 
     * Triggers loose page document import to the Kofax Capture. See {@tutorial 2-3-connect-to-ui}.
     * @param {string} filename -  The file name of the document.
     * @param {string} contentType - Document content type.     *
     * @param {string} batchFields - String batch filds representation.
     * @param {onCaptureCompleteCallback} onImportCompleted - callback to be called in case of successful import.
     * @param {onCaptureErrorCallback} onErrorImport - callback to be called in case of failed import.
     * @memberof Atalasoft.Controls.Capture.CaptureService
     */
    importLoosePageDocument: function(filename, contentType, batchFields, onImportCompleted, onErrorImport) {
        var that = this;

        if (that.__beforeImporting(that)) {
            var requestObj = {
                url: this._params.handlerUrl + "?cmd=importDocumentWithIndexFields",
                type: "POST",
                data: {
                    filename: filename,
                    contentType: contentType,
                    indexFields: JSON.stringify(batchFields)
                },
                dataType: "json",
                success:
                    function(data, jqXHR) {
                        if (data.success === "true") {
                            onImportCompleted(data, data.id, data.status, jqXHR);
                            that.__setCurrentImportId(data.id);
                        } else {
                            onErrorImport(data.errorMessage, jqXHR);
                        }
                    },
                error:
                    function(jqXHR) { onErrorImport(errorsManager.importError, { xhr: jqXHR }); }
            };

            $.ajax(requestObj);
        }
    },

    /**
     * @private
     */
    trackImportStatus: function(theImportId, onTrackStatusReceived) {
        $.get(
            this._params.handlerUrl + '?cmd=trackImportStatus&importId=' + encodeURIComponent(theImportId),
            {},
            function(data) {
                onTrackStatusReceived(data.status);
            }
        );
    },

    /**
     * @private
     */
    getContentTypeList: function(onReceivedContentTypes, onErrorContentTypes) {
        $.getJSON(
                this._params.handlerUrl + '?cmd=getContentTypeList', {},
                function(data) { onReceivedContentTypes(data); }
            )
            .fail(function(jqXHR) { onErrorContentTypes(errorsManager.contentTypesError, { xhr: jqXHR }); });
    },

    /**
     * @private
     */
    getContentTypeDescription: function(contentType, onReceivedContentDesc, onErrorContentDesc) {
        $.getJSON(
                this._params.handlerUrl + '?cmd=getContentTypeDescription&contentType=' + contentType, {},
                function(data) { onReceivedContentDesc(data); }
            )
            .fail(function(jqXHR) { onErrorContentDesc(errorsManager.contentDescError, { xhr: jqXHR }); });
    },

    /** 
     * @private
     */
    getIndexFieldsForDocumentClass: function(contentType, documentClass, onReceivedDocClassIndexFields, onErrorDocClassIndexFields) {
        $.getJSON(
                this._params.handlerUrl + '?cmd=indexFieldsForDocumentClass&contentType=' + contentType + '&documentClass=' + documentClass, {},
                function(data) { onReceivedDocClassIndexFields(data); }
            )
            .fail(function(jqXHR) { onErrorDocClassIndexFields(errorsManager.docClassIndexFieldError, { xhr: jqXHR }); });
    },

    /**
     * @private
     */
    getBatchFields: function(contentType, onReceivedBatchFields, onErrorBatchFields) {
        $.getJSON(
                this._params.handlerUrl + '?cmd=getBatchFields&contentType=' + contentType, {},
                function(data) { onReceivedBatchFields(data); }
            )
            .fail(function(jqXHR) { onErrorBatchFields(errorsManager.batchFieldsError, { xhr: jqXHR }); });
    }
};


/***/ })
/******/ ]);
//# sourceMappingURL=atalaWebCapture.js.map