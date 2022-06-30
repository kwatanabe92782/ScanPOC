// JavaScript include for web-based scanning.
// Copyright 2011-2014 by Atalasoft, a Kofax Company.
// All rights reserved.
//
// 2012.08.29   spike       added localization support, manually merged from KFS 1.117.4
// 2013.11.07   spike       IE 11 sniffing
// 2014.03.11   spike       replaced jQuery.browser with our own browser detection code (TFS Bug 315341)
// 2014.03.11   spike       introduced Atalasoft.Utils.versionLess, for comparing versions
// 2014.04.11   spike       removed trailing comma that upsets IE7 (TFS 324113)
// 2014.04.23   spike       introduced uploadOptions with .extraParts & .formData
//
//////////////////////////////////////////////////////////////////////////
/// NullScanner implementation (used when scanning is not supported).

Atalasoft.Controls.Capture.NullScanner = {
    abortScan: function() { },
    deleteLocalFile: function(fid) { },
    encryptedLocalFileAsBase64String: function(fid, fmt, opts) { return null; },
    getSupportedValues: function (options, callback) { callback(null); },
    getCurrentValues: function (options, callback) { callback(null); },
    globalPurgeByAge: function(hours) { },
    importFiles: function(options) { },
    initialize: function(params) {
        if (params.onScanClientReady) {
            params.onScanClientReady();
        }
        Atalasoft.Controls.Capture.Errors.report(params.onScanError, Atalasoft.Controls.Capture.Errors.badBrowser, this._badBrowser);
    },
    isInstalled: function() { return true; },
    isAppropriateForClient: function() { return true; },
    listLocalFiles: function() { return null; },
    removeAll: function() { },
    saveBase64ToEncryptedLocalFile: function(bs64) { return null; },
    scan: function(scanningOptions, uploadFuncton) { },
    setBarcodeLicense: function(key) { },
    setLicense: function(lic) { return false; },
    setSymmetricEncryptionKey: function (key) { },
    getVersion: function () { return Atalasoft.Controls.Capture.minVersion; },
    getScanStationName: function () { return undefined; },
    showSettingsDialog: function(options, callback) {
        callback({ complete: false });
    },

    __shutdown: function(success, error) { },

    scanners: [],
    defaultScanner: '',
    isSupportedBrowser: false,
    onScannerSelected: function(scanner) { },

    _badBrowser: ""
};

//////////////////////////////////////////////////////////////////////////
/// EZTwain implementation
/// Used in IE and all NPAPI-plugin supporting browsers

Atalasoft.Controls.Capture.EZTwainScanner = {
    // localizable strings used only by this javascript module.
    // None of these are error messages, they are only used to create
    // the 'note' or 'details' strings that accompany errors.
    _localization: {
        notWindows: "Platform is not Windows: ",
        ieVersion: "IE version not supported: ",
        notSupported: "Not currently supported: ",
        pluginVersion: "Plugin is version: ",
        minVersionNeeded: "minimum version needed: "
    },

    getScanClient: function() {
        // Scanning is supported only on Windows platform:
        if (navigator.platform.substring(0, 3) !== 'Win') {
            Atalasoft.Controls.Capture.NullScanner._badBrowser = this._localization.notWindows + navigator.platform;
            return Atalasoft.Controls.Capture.NullScanner;
        }
               
        var browser = this.__detectBrowser();  
       
        // Is it IE?
        if (browser.msie) {
            // Yes, must be IE 8 or later
            if (browser.version < 8) {
                // IE but too old - not supported.
                Atalasoft.Controls.Capture.NullScanner._badBrowser = this._localization.ieVersion + browser.version;
                return Atalasoft.Controls.Capture.NullScanner;
            }            
        }

        if (browser.msie || browser.firefox || browser.chrome /* || this._browser.opera || this._browser.safari */) {
            Atalasoft.Controls.Capture.WebTwainScanner._browser = browser;
            return Atalasoft.Controls.Capture.WebTwainScanner;
        }
        else {
            // Unknown or unsupported browser.
            Atalasoft.Controls.Capture.NullScanner._badBrowser = this._localization.notSupported + (browser.name || navigator.userAgent);
            return Atalasoft.Controls.Capture.NullScanner;
        }
    },

    // sniff browser & version
    __detectBrowser: function () {
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
        } else
            if (/msie|trident/i.test(ua)) {
            browser = {
                name: 'Internet Explorer',
                msie: true,
                version: parseFloat(getFirstMatch(/(?:msie |rv:)(\d+\.\d+)/i))
            };
        } else
            if (/chrome/i.test(ua)) {
            browser = {
                name: 'Chrome',
                chrome: true,
                version: parseFloat(getFirstMatch(/(?:chrome|crios|crmo)\/(\d+\.\d+)/i))
            };
        } else
            if (/firefox|iceweasel/i.test(ua)) {
            browser = {
                name: 'Firefox',
                firefox: true,
                version: parseFloat(getFirstMatch(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i))
            };
        } else
            if (/safari/i.test(ua)) {
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

        return browser;
    }
};