// JavaScript include for web-based scanning.
// Copyright 2011-2014 by Atalasoft, a Kofax Company.
// All rights reserved.

Atalasoft.Controls.Capture.WebTwain.ScanApi = (function () {
    'use strict';

    // dependencies
    var logger = Atalasoft.Logger,
        service = Atalasoft.Controls.Capture.WebTwain.Service;

    // private fields
    var scanUrl,
        importUrl,
        settingsDialogUrl,
        supportedValuesUrl,
        currentValuesUrl;

    // define ctor
    var ctor = function (session) {
        scanUrl = session.scan;
        importUrl = session.importFiles;
        settingsDialogUrl = session.settingsDialog;
        supportedValuesUrl = session.supportedValues;
        currentValuesUrl = session.currentValues;
    };
    
    ctor.prototype = {
        uninitialize: function () {
            scanUrl = undefined;
            importUrl = undefined;
            settingsDialogUrl = undefined;
            supportedValuesUrl = undefined;
            currentValuesUrl = undefined;
        },

        start: function (options) {
            logger.scope('Scan.start()', function () {
                service.post(scanUrl, options, true)
                    .fail(function (jqXhr, textStatus, errorThrown) {
                        logger.error('Scan.start() error ' + textStatus + '; ' + errorThrown);
                        Atalasoft.Controls.Capture.WebTwain.reportBrokenConnection();
                    });
            });
            return true;
        },

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

        importFiles: function (options) {
            logger.scope('Scan.importFiles()', function () {
                service.post(importUrl, options, true)
                    .fail(function (jqXhr, textStatus, errorThrown) {
                        logger.error('Scan.importFiles() error ' + textStatus + '; ' + errorThrown);
                        Atalasoft.Controls.Capture.WebTwain.reportBrokenConnection();
                    });
            });
            return true;
        },

        showSettingsDialog: function (options, callback) {
            logger.scope('Scan.showSettingsDialog()', function () {
                service.callDeferred(service.post, settingsDialogUrl, options, callback)
                .fail(function (jqXhr, textStatus, errorThrown) {
                    logger.error('Scan.showSettingsDialog() error ' + textStatus + '; ' + errorThrown);
                    callback({ complete: false });
                    Atalasoft.Controls.Capture.WebTwain.reportBrokenConnection();
                });
            });
            return true;
        },

        getSupportedValues: function (options, callback) {
            logger.scope('Scan.getSupportedValues()', function () {
                service.callDeferred(service.post, supportedValuesUrl, options, callback)
                .fail(function (jqXhr, textStatus, errorThrown) {
                    logger.error('Scan.getSupportedValues() error ' + textStatus + '; ' + errorThrown);
                    callback({});
                    Atalasoft.Controls.Capture.WebTwain.reportBrokenConnection();
                });
            });
            return true;
        },

        getCurrentValues: function (options, callback) {
            logger.scope('Scan.getCurrentValues()', function () {
                service.callDeferred(service.post, currentValuesUrl, options, callback)
                .fail(function (jqXhr, textStatus, errorThrown) {
                    logger.error('Scan.getCurrentValues() error ' + textStatus + '; ' + errorThrown);
                    callback({});
                    Atalasoft.Controls.Capture.WebTwain.reportBrokenConnection();
                });
            });
            return true;
        }
    };

    return ctor;
}());