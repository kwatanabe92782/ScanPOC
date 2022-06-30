// JavaScript include for web-based scanning.
// Copyright 2011-2015 by Atalasoft, a Kofax Company.
// All rights reserved.

(function ($) {

    Atalasoft.Controls.Capture.WebTwain = {
        SessionId: 0,
        HostRunsAsService: false,
        ReadyState: 1,
        TwainAvailable: false,
        InstalledSources: [],
        DefaultSourceDevice: '',
        scanningOptions: {},
        _shutdown: false,
        connectionBroken: true,
        eventsUrl: '',
        settingsUrl: '',
        images: '',
        image: '',
        _sessionsKey: 'sessions',

        initialize: function (params, browser, success, failure) {
            var me = this;
            Atalasoft.Logger.scope('WebTwain.initialize()', function () {
                me._shutdown = false;
                me._server = Atalasoft.Controls.Capture.WebTwain.Service;
                me._server.setLimitedMode(browser.msie && browser.version < 10);

                var requestData = {
                    localization: params.localization,
                    scanningOptions: Atalasoft.Controls.Capture.WebTwainScanner.__extendScanningOptions(params.scanningOptions)
                };

                me.__retryConnection(requestData, function (response) {
                    me.SessionId = response.id;
                    me.HostRunsAsService = response.hostRunsAsService;
                    me.self = response.self;
                    me.eventsUrl = response.events;
                    me.settingsUrl = response.settings;
                    me.images = response.images;
                    me.Scan = new Atalasoft.Controls.Capture.WebTwain.ScanApi(response);
                    me.LocalFile = new Atalasoft.Controls.Capture.WebTwain.LocalFileApi(response);

                    // in general we don't need to store all settings in Scan now. scanningSettings is enough.
                    me.scanningOptions = Atalasoft.Controls.Capture.WebTwainScanner.__extendScanningOptions(response.scanningOptions);

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
            Atalasoft.Logger.scope('WebTwain.shutdown()', function () {
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
                            Atalasoft.Logger.warn('WebTwain.shutdown() error ' + textStatus + '; ' + errorThrown);

                            if (error) {
                                error(Atalasoft.Controls.Capture.Errors.internalError, {});
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
                }
            });
        },

        shutdownWorker: function (url, useBeaconApi) {
            var me = this,
                future = null;

            Atalasoft.Logger.scope('WebTwain.shutdownWorker: ' + url, function () {
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

            Atalasoft.Logger.scope('WebTwain.Clear()', function () {
                if (me._server && me.images) {
                    me._server.get(me.images, {
                        format: frmt,
                        jpegCompression: opts ? opts.jpegCompression : undefined,
                        quality: opts ? opts.quality : undefined
                    }, typeof (callback) === 'function')
                        .done(function (response) {
                            base64 = response.base64 || '';
                            if (callback && typeof (callback) === 'function')
                                callback(base64);
                        })
                        .fail(function (jqXhr, textStatus, errorThrown) {
                            Atalasoft.Logger.log('WebTwain.AsBase64String() error ' + textStatus + '; ' + errorThrown);
                        });
                }
            });

            return base64;
        },

        Clear: function () {
            var me = this;
            Atalasoft.Logger.scope('WebTwain.Clear()', function () {
                if (me._server && me.images) {
                    me._server.del(me.images);
                }
            });
        },

        DeleteImage: function (image) {
            Atalasoft.Logger.scope('WebTwain.DeleteImage()', function () {
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
                SuportedValues: 4,
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
                        var image = new Atalasoft.Controls.Capture.WebTwain.Image(e.image.sessionId, e.image.index, e.image);
                        me.onimageacquired(e.index, image);
                        break;
                    case eventTypes.ScanError:
                        me.onscanerror(e.message, e.details);
                        break;
                    case eventTypes.SuportedValues:
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
                        me.reportBrokenConnection(Atalasoft.Controls.Capture.Errors.brokenConnection);
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
                    Atalasoft.Controls.Capture.WebTwainScanner.__reportError(error);
                } else {
                    Atalasoft.Controls.Capture.WebTwainScanner.__reportError(Atalasoft.Controls.Capture.Errors.noPlugin, {
                        message: Atalasoft.Controls.Capture.Errors.webServiceMissed,
                        filename: Atalasoft.Controls.Capture.WebTwainScanner._installerFileName
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

    //////////////////////////////////////////////////////////////////////////
    /// WebTwain implementation
    Atalasoft.Controls.Capture.WebTwainScanner = {
        // 'public' properties
        scanners: [],
        defaultScanner: '',
        isSupportedBrowser: true,

        // 'private' properties
        _logger: Atalasoft.Logger,
        _installerFileName: 'Kofax.WebCapture.Installer.msi',
        _eztwain: {},
        _params: {},
        _lastSheetNo: -1,                               // physical sheet no. of last image (sometimes)
        _aborting: false,                               // set true when aborting a scan or import
        // localizable strings used only by this javascript module.
        // None of these are error messages, they are only used to create
        // the 'note' oronScanClientReady 'details' strings that accompany errors.
        _localization: {
            not32Bit: "Browser is not 32-bit: ",
            notWindows: "Platform is not Windows: ",
            ieVersion: "IE version not supported: ",
            notSupported: "Not currently supported: ",
            pluginVersion: "Plugin is version: ",
            minVersionNeeded: "minimum version needed: "
        },

        __reportError: function (msg, params) {
            // Note that the msg parameter must ALWAYS be a string from Atalasoft.Controls.Capture.Errors
            Atalasoft.Controls.Capture.Errors.report(this._params.onScanError, msg, params);
        },

        /** 
         * Gets components of WingScan version as an array of numbers.
         * @memberof Atalasoft.Controls.Capture.WebScanning
         * @returns {number[]} WingScan version components.
         */
        getVersion: function () {
            return this._eztwain.FullVersion;
        },

        /** 
         * Gets the NetBIOS name of the local scan station.
         * @memberof Atalasoft.Controls.Capture.WebTwainScanner
         * @returns {string}
         */
        getScanStationName: function() {
            return this._eztwain.machineName;
        },

        deleteLocalFile: function (fid, callback) {
            var localFileApi = this._eztwain.LocalFile;

            if (typeof callback === 'function')
                localFileApi.removeAsync(fid, callback);
            else
                localFileApi.remove(fid);
        },

        encryptedLocalFileAsBase64String: function () {
            var args = Array.prototype.slice.call(arguments),
                callback = args.slice(-1).pop(),
                localFileApi = this._eztwain.LocalFile;

            if (typeof callback === 'function') {
                args.unshift(args.pop());
                localFileApi.asBase64StringAsync.apply(localFileApi, args);
            } else {
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
            else
                localFileApi.globalPurgeByAge(hours);
        },

        listLocalFiles: function (callback) {
            var localFileApi = this._eztwain.LocalFile;

            if (typeof callback === 'function')
                localFileApi.listAsync(callback);
            else
                return localFileApi.list();
        },

        removeAll: function (callback) {
            var localFileApi = this._eztwain.LocalFile;

            if (typeof callback === 'function')
                localFileApi.removeAllAsync(callback);
            else
                localFileApi.removeAll();
        },

        saveBase64ToEncryptedLocalFile: function (bs64, callback) {
            var localFileApi = this._eztwain.LocalFile;

            if (typeof callback === 'function')
                localFileApi.fromBase64StringAsync(bs64, callback);
            else
                return localFileApi.fromBase64String(bs64);
        },

        setBarcodeLicense: function (key) {
            var settings = { barcodeLicense: key },
                me = this;
            this._eztwain.updateSettings(settings, true)
            .fail(function (jqXhr, textStatus, errorThrown) {
                me._logger.error('setBarcodeLicense() failed: ' + textStatus + '; ' + errorThrown);
                me.__reportError(Atalasoft.Controls.Capture.Errors.internalError);
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
                        me.__reportError(Atalasoft.Controls.Capture.Errors.internalError, {});
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
                me.__reportError(Atalasoft.Controls.Capture.Errors.internalError, {});
            });
        },

        enumerateScanners: function () {
            var args = Array.prototype.slice.call(arguments),
                callback = args.slice(-1).pop(),
                async = typeof callback === 'function',
                result = $.Deferred(),
                me = this;

            if (!this._eztwain.TwainAvailable) {
                this.__reportError(Atalasoft.Controls.Capture.Errors.noTwain);
                result.resolve();
            } else {
                this._eztwain.reloadScanners(async, function () {
                    // Get the list of available devices (with TWAIN, this is just a list of *installed* device drivers)
                    me.scanners = me._eztwain.InstalledSources || [];
                    // And, ask plugin for the name of the system-wide default device:
                    me.defaultScanner = me._eztwain.DefaultSourceDevice;
                    result.resolve();
                });
            }

            result.done(function () {
                // call callback if needed.
                if (async)
                    callback();
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
        
        __pluginTooOld: function (plugin, minVer) {
            return Atalasoft.Utils.versionLess(plugin.FullVersion, minVer);
        },

        __extendScanningOptions: function (scanningOptions) {
            // Interpret any scanning options in the scanningOptions object into plugin settings.
            var finalOptions = {};

            scanningOptions = scanningOptions || {};
            if (typeof scanningOptions.scanner === 'string') {
                finalOptions.scanner = scanningOptions.scanner;
            }
            else {
                finalOptions.scanner = this._eztwain.SourceDevice;
            }

            finalOptions.brightness = (scanningOptions.brightness !== undefined) ? Number(scanningOptions.brightness) : 0;
            finalOptions.contrast = (scanningOptions.contrast !== undefined) ? Number(scanningOptions.contrast) : 0;
            finalOptions.threshold = (scanningOptions.threshold !== undefined) ? Number(scanningOptions.threshold) : -1;
            finalOptions.showScannerUI = scanningOptions.showScannerUI || false;
            finalOptions.showProgress = scanningOptions.showProgress !== false;
            finalOptions.pixelType = (scanningOptions.pixelType !== undefined) ? Number(scanningOptions.pixelType) : -1;
            finalOptions.resultPixelType = (scanningOptions.resultPixelType !== undefined) ? Number(scanningOptions.resultPixelType) : -1;
            finalOptions.duplex = (scanningOptions.duplex !== undefined) ? Number(scanningOptions.duplex) : 0;
            finalOptions.dpi = Number(scanningOptions.dpi) || 200;
            finalOptions.feeder = (scanningOptions.feeder !== undefined) ? Number(scanningOptions.feeder) : -1;
            finalOptions.paperSize = (scanningOptions.paperSize !== undefined) ? Number(scanningOptions.paperSize) : 3;
            finalOptions.orientation = (scanningOptions.orientation !== undefined) ? Number(scanningOptions.orientation) : -1;
            finalOptions.applyVRS = (scanningOptions.applyVRS !== undefined) ? scanningOptions.applyVRS : true;
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
            if (finalOptions.feeder === 0 && finalOptions.duplex === 1)
                finalOptions.duplex = 0;

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

            if (typeof(scanningOptions.imageAddress) === "object") {
                finalOptions.imageAddress = scanningOptions.imageAddress;
            } else {
                delete finalOptions.imageAddress;
            }
            if (typeof (scanningOptions.imprintersConfig) === "object") {
                finalOptions.imprintersConfig = scanningOptions.imprintersConfig;
            } else {
                delete finalOptions.imprintersConfig;
            }

            if (this._eztwain.scanningOptions) {
                this._eztwain.scanningOptions = finalOptions;
            }

            return finalOptions;
        },

        __initEztwainWhenReady: function () {
            // Minimum version of native code module, needed by this javascript layer:
            var minVer = Atalasoft.Controls.Capture.minVersion;
            // Did it create the object and is the object ready to run?
            if (!this._eztwain || this._eztwain.ReadyState != 4) {
                // So far, plugin not ready - could have multiple causes.
                // Check back later...
                var meLater = this;
                setTimeout(function () { meLater.__initEztwainWhenReady(); }, 2000);
            } else if (this.__pluginTooOld(this._eztwain, minVer)) {
                // constructed and ready, but (still?) too low a version to use
                var details = this._localization.pluginVersion +
                    this._eztwain.FullVersion +
                    " - " +
                    this._localization.minVersionNeeded +
                    minVer;
                if (!this._eztwain.HostRunsAsService) {
                    this.__reportError(Atalasoft.Controls.Capture.Errors.oldPlugin,
                    { message: details, filename: this._installerFileName });
                } else {
                    this.__reportError(Atalasoft.Controls.Capture.Errors.oldWindowsService, { message: details });
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
                me._eztwain.onimagediscarded = function() { me.__onImageDiscarded(); };
                me._eztwain.onscanerror = function (msg, note) { me.__reportError(msg, { message: note }); };

                // start event polling.
                me._eztwain.startEventsPoll(me._eztwain.SessionId);
                me._logger
                    .info('minVer:                 ' + minVer)
                    .info('navigator.userAgent:    ' + navigator.userAgent)
                    .info('navigator.vendor:       ' + navigator.vendor)
                    .info('browser: ' + me._browser.name)
                    .info('version: ' + me._browser.version);

                // If there's a handler for control-ready, call the handler:
                if (me._params.onScanClientReady) {
                    me._params.onScanClientReady();
                }
            }
        },

        // Called to set up scanning on the current page.
        // params will have members to report errors and events
        // This function creates a DIV, which holds the EZTwainX control or NPAPI plugin
        // which is also created & initialized.
        initialize: function (params) {
            this._params = params;
            if (params.localization) {
                $.extend(this._localization, params.localization);
            }

            var pthis = this;
            //Try to connect to local scan service:
            this._eztwain = Atalasoft.Controls.Capture.WebTwain;
            this._eztwain.initialize(params, this._browser, function () {
                //success!  Control is constructed and ready to go.
                pthis.__initEztwainWhenReady();
            },
            function (response) {
                if (Atalasoft.Controls.Capture.Errors[response.responseText]) {
                    pthis.__reportError(Atalasoft.Controls.Capture.Errors[response.responseText]);
                } else {
                    pthis.__reportError(Atalasoft.Controls.Capture.Errors.noPlugin,
                    {
                        message: Atalasoft.Controls.Capture.Errors.webServiceMissed,
                        filename: pthis._installerFileName
                    });
                }
            });
        },

        __shutdown: function (success, error, useBeaconApi) {
            try {

                var useBeacon;
                if (useBeaconApi === undefined) {
                    var browser = Atalasoft.Controls.Capture.WebTwainScanner._browser;
                    useBeacon = browser.system === "Win32" && !browser.msie;
                }
                else {
                    useBeacon = useBeaconApi;
                }
                var me = this;
                if (this._eztwain) {
                    this._eztwain.shutdown(function() {
                        me.__bindEvents(false);
                        me.scanners = [];
                        me._params = {};
                        me._eztwain = null;
                        me._uploadFunction = null;

                        if (success) {
                            success();
                        }
                    }, error, useBeacon);
                }
            } catch (e) {
                if (error) {
                    error(Atalasoft.Controls.Capture.Errors.internalError, e);
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
                    me.__reportError(Atalasoft.Controls.Capture.Errors.internalError, e);
                    image.discard = true;
                }
                if (image.discard) {
                    me._eztwain.DeleteImage(image);
                }
            });

        },

        __onImageDiscarded: function() {
            var me = this;
            this._logger.scope('onImageDiscarded event', function() {
                me._logger.scope('calling user event handler...',function() {
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
                    var opts = this.__extendScanningOptions(scanningOptions);
                    if (!this._eztwain.Scan.start(opts)) {
                        this._params.eventBindObject.trigger('onScanCompleted', { success: false, error: { message: Atalasoft.Controls.Capture.Errors.scanFail } });
                    }
                } catch (e) {
                    this.__reportError(Atalasoft.Controls.Capture.Errors.internalError, e);
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
                    var opts = this.__extendScanningOptions(options);
                    if (!this._eztwain.Scan.importFiles(opts)) {
                        this._params.eventBindObject.trigger('onScanCompleted', { success: false, error: { message: Atalasoft.Controls.Capture.Errors.scanFail } });
                    }
                } catch (e) {
                    this.__reportError(Atalasoft.Controls.Capture.Errors.internalError, e);
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
                this.__reportError(Atalasoft.Controls.Capture.Errors.internalError, e);
            }
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
                this.__reportError(Atalasoft.Controls.Capture.Errors.internalError, e);
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
                this.__reportError(Atalasoft.Controls.Capture.Errors.internalError, e);
            }
        },

        clear: function () {
            this._eztwain.Clear();
        }
    };

}(jQuery));