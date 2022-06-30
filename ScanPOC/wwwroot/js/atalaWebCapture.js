// JavaScript include for web-based scanning.
// Copyright 2011-2015 by Atalasoft, a Kofax Company.
// All rights reserved.
//
// 2014.03.11   spike       created 'versionLess' utility function for comparing versions
// 2014.03.11   spike       compare jQuery version correctly (TFS Bug 315340)
// 2014.04.21   spike       introduced uploadOptions and extraParts
// 2015.01.20   spike       Bug 550581: Added locally scoped non-conflict jQuery.

// Check for jQuery
(function() {
    var jqVersion = [1,7,1];
    function versionLess(v, w) {
        for (var i = 0; i < 3; i++) {
            if (v[i] != w[i]) return v[i] < w[i];
        }
        return false;       // equality, fails.
    }
    if (typeof (jQuery) === 'undefined' || versionLess(jQuery().jquery.split('.'), jqVersion)) {
        throw 'jQuery ' + jqVersion.join('.') + ' or greater is required.';
    }
})();

// Namespace definition(s)
var Atalasoft = jQuery.extend(true, {}, Atalasoft, { Controls: { Capture: {} }, Utils: {} });

(function ($) {

    Atalasoft.Utils.getScriptBaseDir = function (fromScript) {
        var scripts = document.getElementsByTagName('script');
        for (var si in scripts) {
            var s = scripts[si].src;
            if (s) {
                var index = s.indexOf(fromScript);
                if (index != -1) {
                    return s.substring(0, index); // '../atala.js'
                }
            }
        }
        throw fromScript + ' must be included in the <head> as a script tag.';
    };

    // compare two element arrays representing version numbers
    // like [1,1,4,0] to [1,2,0,7]
    // Return true if v < w.
    Atalasoft.Utils.versionLess = function (v, w) {
        if (v[0] != w[0]) return v[0] < w[0];
        if (v[1] != w[1]) return v[1] < w[1];
        if (v[2] != w[2]) return v[2] < w[2];
        return v[3] < w[3];
    };

    try {
        Atalasoft.Controls.Capture.scriptBaseDir = Atalasoft.Utils.getScriptBaseDir('atalaWebCapture.min.js');
    }
    catch (exception) {
    }
    try {
        Atalasoft.Controls.Capture.scriptBaseDir = Atalasoft.Utils.getScriptBaseDir('atalaWebCapture.js');
    }
    catch (exception) {
    }

    if (!Atalasoft.Controls.Capture.concatenated) {
        // Not concatenated, so try to dynamically load our component .js files from same base directory

        //This needs to not be here for the minified atalaWebCapture.min.js file to actually run in a browser. 
        Atalasoft.Utils.getScript = function (basedir, script) {
            $('head').append('<script type="text/javascript" src="' + basedir + script + '"></script>');
        };

        try {
            Atalasoft.Utils.getScript(Atalasoft.Controls.Capture.scriptBaseDir, 'atalaCaptureService.js');
        } catch (exception) { }
        try {
            Atalasoft.Utils.getScript(Atalasoft.Controls.Capture.scriptBaseDir, 'atalaLogger.js');
        } catch (exception) { }
        try {
            Atalasoft.Utils.getScript(Atalasoft.Controls.Capture.scriptBaseDir, 'atalaWebTwain.js');
        } catch (exception) { }
        try {
            Atalasoft.Utils.getScript(Atalasoft.Controls.Capture.scriptBaseDir, 'atalaWebTwain.Service.js');
        } catch (exception) { }
        try {
            Atalasoft.Utils.getScript(Atalasoft.Controls.Capture.scriptBaseDir, 'atalaWebTwain.Image.js');
        } catch (exception) { }
        try {
            Atalasoft.Utils.getScript(Atalasoft.Controls.Capture.scriptBaseDir, 'atalaWebTwain.File.js');
        } catch (exception) { }
        try {
            Atalasoft.Utils.getScript(Atalasoft.Controls.Capture.scriptBaseDir, 'atalaWebTwain.Scan.js');
        } catch (exception) { }
        try {
            Atalasoft.Utils.getScript(Atalasoft.Controls.Capture.scriptBaseDir, 'atalaWebTwain.Thumb.js');
        } catch (exception) { }
        try {
            Atalasoft.Utils.getScript(Atalasoft.Controls.Capture.scriptBaseDir, 'atalaEzTwain.js');
        } catch (exception) { }
        try {
            Atalasoft.Utils.getScript(Atalasoft.Controls.Capture.scriptBaseDir, 'atalaUpload.js');
        } catch (exception) { }
    }

    //Web Capture Client side errors.
    Atalasoft.Controls.Capture.Errors = {
        report: function (errorFunction, errorMsg, params) {
            if (errorFunction) {
                errorFunction(errorMsg, params);
            } else {
                $.error(errorMsg);
            }
        },

        activeX: 'The Scanning ActiveX Control needs to be installed, updated, or enabled, or ActiveX controls need to be allowed to install and run.',
        ajax: 'Could not create an XMLHttpRequest object needed for uploading.',
        badBrowser: 'Scanning requires Chrome, FireFox, or Internet Explorer (at least version 8 and with Compatibility View Mode disabled) running on Windows.',            
        badLicense: 'Scanning service license is invalid or expired.',
        badVrsLicense: 'VRS license is missing or invalid.',
        vrsBadCommand: 'eVRS command string is invalid',
        batchFieldValidationError: 'Batch field validation failed.',
        batchFieldsError: 'The server could not retrieve the batch fields for the selected batch class.',
        contentTypesError: 'The server could not retrieve content types.',
        contentDescError: 'The server could not retrieve the content description.',
        dllVersion: 'Scanning service helper DLL is an incompatible version',
        docClassIndexFieldError: 'The server could not retrieve the index fields for the document class.',
        doorOpen: 'Scanner reports cover open',
        doubleFeed: 'Scanner reports a double-feed',
        driverCrash: 'Fatal exception in scanner driver',
        dsmFail: 'Failure in TWAIN Manager',
        dsOpen: 'Failed to open scanner',
        fieldValidationError: 'Batch, or index field validation failed.',
        fileFail: 'File not found or cannot be written or cannot be read.',
        fileLocked: 'File locked by other application.',
        helperDll: 'Failed to load scanning service helper DLL',
        importError: 'The server could not import the document.',
        indexFieldValidationError: 'IndexField validation failed.',
        internalError: 'Unexpected internal error',
        licensingError: 'Scanning service: The server did not return valid licensing information',
        noPlugin: 'The scanning service needs to be installed. If it is installed it may need to be enabled. In the browser look for Add-ons, Plugins, Kofax scanning.',
        noTwain: 'The TWAIN Manager needs to be installed.',
        oldPlugin: 'The scanning service needs to be updated to a newer version.',
        outOfMemory: 'Insufficient memory to complete an operation. Restarting the browser may help.',
        paperJam: 'Scanner reports a paper jam.',
        pluginCreate: 'Scanning service not created',
        scanFail: 'Unable to start scan',
        serverNotResponding: 'The server is not responding.',
        tooManyImages: 'Too many images for Scanning service to handle.',
        unsupportedFormatWarning: 'Warning: Only the following image file types are supported for import: BMP, GIF, JPG/JPEG, PDF, TIFF. All other file types will be ignored and will not be imported.',
        uploadError: 'The server reported an error while uploading.',
        userCancel: 'User cancelled the operation.',
        vrsBadDpiWarning: 'Warning: One or more images were skipped - Image Enhancement requires image DPI > 25',
        xferFail: 'Image transfer from scanner failed.',
        webServiceMissed: 'Web Capture local service is not running.',
        lowIntegrityAccessDenied: 'Access to the Web Capture Service is denied because the current user has insufficient rights. This can have happened if you have visited site with the untrusted certificate or connect to the Web Capture Service from internet. Contact your administrator for assistance.',
        oldWindowsService: 'The scanning service needs to be updated to a newer version. Contact your administrator for assistance.',
        brokenConnection: 'Connection to the scanning service is broken. You may need to refresh the page to restore it.'
    };

    Atalasoft.Controls.Capture.PixelType = {
        Auto: -2,
        Any: -1,
        BW: 0,
        Grayscale: 1,
        Color: 2,
        Indexed: 3
    };
    
    Atalasoft.Controls.Capture.ImprinterTypes = {
        ImprinterBefore      : "ImprinterBefore",
        ImprinterAfter       : "ImprinterAfter",
        ImprinterBottomBefore: "ImprinterBottomBefore",
        ImprinterBottomAfter : "ImprinterBottomAfter",
        EndorserBefore       : "EndorserBefore",
        EndorserAfter        : "EndorserAfter",
        EndorserBottomBefore : "EndorserBottomBefore",
        EndorserBottomAfter  : "EndorserBottomAfter"
    };

    /// Web Scanning
    Atalasoft.Controls.Capture.WebScanning = {
        _params: {},
        scanningOptions: {},
        uploadOptions: {},
        isSupportedBrowser: false,
        logger: Atalasoft.Logger,

        initialize: function (params) {
            this.logger.log("Atalasoft.Controls.Capture.WebScanning.initialize(...)");
            this._params = params;
            // If a scanningOptions object is provided...
            if (params.scanningOptions !== undefined) {
                // ...share that object as our options object.
                this.scanningOptions = params.scanningOptions;
            }
            if (params.uploadOptions !== undefined) {
                this.uploadOptions = params.uploadOptions;
            }
            // Replace any of our string translations with those passed in:
            this._localizeErrors(Atalasoft.Controls.Capture.Errors, params.localization);
            if (!this._scanClient) {
                // Get the possibly browser- or platform-specific scanning object
                this._scanClient = Atalasoft.Controls.Capture.EZTwainScanner.getScanClient();
                this._scanClient.initialize({
                    onScanError: params.onScanError,
                    onScanStarted: params.onScanStarted,
                    onScanCompleted: params.onScanCompleted,
                    onImageAcquired: params.onImageAcquired,
                    onImageDiscarded: params.onImageDiscarded,
                    onScanClientReady: function () { Atalasoft.Controls.Capture.WebScanning.__onScanClientReady(); },
                    eventBindObject: this.__eventBindObject(),
                    localization: Atalasoft.Controls.Capture.Errors,
                    scanningOptions: this.scanningOptions
                });

                // Set up our cleanup call-back, when page is unloaded.
                var me = this;

                var unload = function() {
                    if (me._scanClient) {
                        var browser = Atalasoft.Controls.Capture.WebTwainScanner._browser;
                        var shouldUseBeaconApiInsteadOfSync = browser.system === "Win32" && !browser.msie;
                        //New API call covers scan abort and worker shutdown in one call
                        if(!shouldUseBeaconApiInsteadOfSync) {
                            // Make a best effort to terminate any ongoing scan or import:
                            me._scanClient.abortScan();
                        }

                        // Call shutdown handler that was passed to us, if any:
                        if (me._params.onShutdown) {
                            try {
                                // Notify the application we are shutting down:
                                me._params.onShutdown();
                            } catch (e) {
                            }
                        }
                        // Finally, let the scan object clean up:
                        me._scanClient.__shutdown(undefined,undefined, shouldUseBeaconApiInsteadOfSync);
                    }
                };

                me.destuructor = unload;
                $(window)
                    .bind('beforeunload', unload)
                    .bind('unload', unload);
            }

            Atalasoft.Controls.Capture.UploadToCaptureServer.initialize({
                handlerUrl: params.handlerUrl,
                serverTimeout: params.serverTimeout,    
                onUploadError: params.onUploadError,
                onUploadStarted: params.onUploadStarted,
                onUploadCompleted: params.onUploadCompleted,
                uploadLocation: params.uploadLocation,
                eventBindObject: this.__eventBindObject(),
                uploadOptions: this.uploadOptions
            });
        },

        dispose: function (success, error) {
            var me = this;
            Atalasoft.Controls.Capture.UploadToCaptureServer.dispose();
            if (me._scanClient) {
                me._scanClient.__shutdown(function () {
                    me._scanClient = null;

                    if (me.destuructor) {
                        $(window)
                        .unbind('beforeunload', me.destuructor)
                        .unbind('unload', me.destuructor);
                        me.destuructor = null;
                    }

                    me.__disconnectUI();
                    
                    if (success) {
                        success();
                    }
                }, function () {
                    me.__disconnectUI();
                    if (error && typeof error === "function") {
                        error.apply(me, arguments);
                    }
                });
            }
        },

        isInitialized: function() {
            return !!this._scanClient;
        },

        scan: function (scanningOptions) {
            // If parameter omitted, use default options:
            if (scanningOptions === undefined) {
                scanningOptions = this.scanningOptions;
            }
            this._scanClient.scan(scanningOptions, Atalasoft.Controls.Capture.UploadToCaptureServer.getUploadCallback());
        },

        abortScan: function () {
            this._scanClient.abortScan();
        },

        importFiles: function (options) {
            // If parameter omitted, use default options:
            if (options === undefined) {
                options = this.scanningOptions;
            }
            this._scanClient.importFiles(options);
        },

        showSettingsDialog: function (options, callback) {
            if (!options) {
                options = this.scanningOptions;
            }
            this._scanClient.showSettingsDialog(options, callback);
        },

        getSupportedValues: function (options, callback) {
            // query the selected scanner and return an array describing the supported values
            // of scanningOptions for the scanner
            if (!options) {
                options = this.scanningOptions;
            }
            this._scanClient.getSupportedValues(options, callback);
        },

        getCurrentValues: function (options, callback) {
            // query the selected scanner and return an array describing the supported values
            // of scanningOptions for the scanner
            if (!options) {
                options = this.scanningOptions;
            }
            this._scanClient.getCurrentValues(options, callback);
        },

        setSymmetricEncryptionKey: function (key) {
            this.logger.deprecate('Atalasoft.Controls.Capture.WebScanning.setSymmetricEncryptionKey', 'Atalasoft.Controls.Capture.WebScanning.LocalFile.setEncryptionKey');
            this._scanClient.setSymmetricEncryptionKey(key);
        },

        saveBase64ToEncryptedLocalFile: function (bs64) {
            this.logger.deprecate('Atalasoft.Controls.Capture.WebScanning.saveBase64ToEncryptedLocalFile', 'Atalasoft.Controls.Capture.WebScanning.LocalFile.fromBase64String');
            return this._scanClient.saveBase64ToEncryptedLocalFile(bs64);
        },

        encryptedLocalFileAsBase64String: function (fid, fmt, opts) {
            this.logger.deprecate('Atalasoft.Controls.Capture.WebScanning.encryptedLocalFileAsBase64String', 'Atalasoft.Controls.Capture.WebScanning.LocalFile.asBase64String');
            return this._scanClient.encryptedLocalFileAsBase64String(fid, fmt, opts);
        },

        deleteLocalFile: function (fid) {
            this.logger.deprecate('Atalasoft.Controls.Capture.WebScanning.deleteLocalFile', 'Atalasoft.Controls.Capture.WebScanning.LocalFile.remove');
            this._scanClient.deleteLocalFile(fid);
        },

        listLocalFiles: function () {
            this.logger.deprecate('Atalasoft.Controls.Capture.WebScanning.listLocalFiles', 'Atalasoft.Controls.Capture.WebScanning.LocalFile.list');
            return this._scanClient.listLocalFiles();
        },

        setBarcodeLicense: function (key) {
            this._scanClient.setBarcodeLicense(key);
        },

        getProfile: function (s) {
            // Convert scanning options to JSON string and return.
            if (s === undefined) {
                s = this.scanningOptions;
            }
            return this.__stringify(s);
        },

        setProfile: function (p) {
            // Set the scanning options from a profile (which is a JSON string)
            this.scanningOptions = $.parseJSON(p);
        },

        /** 
         * Gets components of WingScan version as an array of numbers.
         * @memberof Atalasoft.Controls.Capture.WebScanning
         * @returns {number[]} WingScan version components.
         */
        getVersion: function () {
            return this._scanClient.getVersion();
        },

        /** 
         * Gets the NetBIOS name of the local scan station.
         * @memberof Atalasoft.Controls.Capture.WebTwainScanner
         * @returns {string} NetBIOS name of the local scan station is scan control is initialized; undefined otherwise.
         */
        getScanStationName: function() {
            return this.isInitialized() && this._scanClient ? this._scanClient.getScanStationName() : undefined;
        },

        _localizeErrors: function (errors, localization) {
            if (localization) {
                // translate error strings using the localization table
                for (var id in errors) {
                    if (typeof errors[id] === 'string' && id in localization) {
                        errors[id] = localization[id];
                    }
                }
            }
        },

        __getLicense: function () {
            var me = this;
            $.getJSON(
                    this._params.handlerUrl + '?cmd=getLicense', {},
                    function (data) { me.__gotLicense(data); }
                )
                .fail(function (jqXHR) {
                    Atalasoft.Controls.Capture.Errors.report(
                        me._params.onScanError, Atalasoft.Controls.Capture.Errors.licensingError, jqXHR);
                });
        },

        __gotLicense: function (lic) {
            var me = this;
            this._scanClient.setLicense(lic, function () {
                me._scanClient.enumerateScanners(function () {
                    me.__connectGui();
                    if (me._params.onScanClientReady && me._scanClient !== Atalasoft.Controls.Capture.NullScanner) {
                        me._params.onScanClientReady();
                    }
                });
            });
        },

        __onScanClientReady: function () {
            this.isSupportedBrowser = this._scanClient.isSupportedBrowser;
            if (this.isSupportedBrowser) {
                this.LocalFile = {
                    _scanClient: this._scanClient,
                    setEncryptionKey: function (key, callback) { this._scanClient.setSymmetricEncryptionKey(key, callback); },
                    fromBase64String: function (str, callback) { return this._scanClient.saveBase64ToEncryptedLocalFile(str, callback); },
                    asBase64String: function () { return this._scanClient.encryptedLocalFileAsBase64String.apply(this._scanClient, arguments); },
                    splitToFiles: function () { return this._scanClient.splitToFiles.apply(this._scanClient, arguments); },
                    remove: function (fid, callback) { this._scanClient.deleteLocalFile(fid, callback); },
                    list: function (callback) { return this._scanClient.listLocalFiles(callback); },
                    removeAll: function (callback) { this._scanClient.removeAll(callback); },
                    globalPurgeByAge: function (hours, callback) { this._scanClient.globalPurgeByAge(hours, callback); }
                };
            }
            if (this._params.license) {
                this.__gotLicense(this._params.license);
                delete this._params.license;
            } else if (this.isSupportedBrowser) {
                this.__getLicense();
            }
        },

        __eventBindObject: function () {
            return $('body');
        },

        __connectGui: function () {
            this.__connectScanButtons(this._scanClient.scanners, $('.atala-scan-button'));
            this.__connectImportButtons($('.atala-local-file-import-button'));
            this.__connectScannerListElement(this._scanClient.scanners, this._scanClient.defaultScanner, $('.atala-scanner-list'));
        },

        __disconnectUI: function() {
            $('.atala-scan-button, .atala-local-file-import-button').each(function(i, btn) {
                $(btn).off('click').attr('disabled', true);
            });

            $('.atala-scanner-list').each(function (i, list) {
                $(this).attr('disabled', true).empty();
                list.onchange = null;
            });
        },

        __connectScanButtons: function (scanners, scanButtons) {
            if (scanners.length > 0) {
                scanButtons.click(function () { Atalasoft.Controls.Capture.WebScanning.scan(); });
                scanButtons.removeAttr('disabled');
            } else {
                scanButtons.attr('disabled', true);
            }
        },

        __connectScannerListElement: function (scanners, defaultScanner, scannerListElements) {
            // scannerListElements is assumed to be (the return from) a jquery selector i.e. a 'wrapped set'.
            var that = this; // needed for onchange callback

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
                    scannerList.onchange = function () { that._scanClient.onScannerSelected(scannerList.options[scannerList.selectedIndex].value); };
                    scannerListElements.removeAttr('disabled');
                } else {
                    // There are no scanners - either none installed, unsupported browser, etc.
                    // Disable all scanner lists
                    scannerListElements.attr('disabled', true);
                }
            } else {
                // if they don't want a select box, then choose the system default
                this._scanClient.onScannerSelected(defaultScanner);
            }
        },

        __connectImportButtons: function (importButtons) {
            importButtons.click(function () { Atalasoft.Controls.Capture.WebScanning.importFiles(); });
            importButtons.removeAttr('disabled');
        },

        __stringify: function (obj) {
            var t = typeof (obj);
            if (t !== "object" || obj === null) {
                // simple data type
                if (t === "string") obj = '"' + obj + '"';
                return String(obj);
            }
            else {
                // recurse array or object
                var n, v, json = [], arr = (obj && obj.constructor === Array);
                for (n in obj) {
                    if (!obj.hasOwnProperty(n)) continue;
                    v = obj[n]; t = typeof (v);
                    if (t === "string") v = '"' + v + '"';
                    else if (t === "object" && v !== null) v = this.__stringify(v);
                    else if (t === 'function') continue;
                    json.push((arr ? "" : '"' + n + '":') + String(v));
                }
                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        }

    };

}(jQuery));
