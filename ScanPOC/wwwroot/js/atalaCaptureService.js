// JavaScript include for web-based capture service integration.
// Copyright 2011-2015 by Atalasoft, a Kofax Company.
// All rights reserved.

(function ($) {

    Atalasoft.Controls.Capture.CaptureService = {

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
        __getContentTypeDocs: function (contentType) {
            var that = this;
            this.getContentTypeDescription(contentType,
                function (contentTypeDescriptionArray) {
                    var contentTypeDocumentList = $('.atala-content-type-document-list')[0];
                    if (contentTypeDocumentList) {
                        // clear out old ones
                        while (contentTypeDocumentList.length > 0) contentTypeDocumentList.remove(0);

                        //To filter the list
                        if (that._params.removedContentTypeDescriptions !== undefined) {
                            var filteredContentTypeDescriptionArray = that.__filterContentTypeDescriptionList(contentTypeDescriptionArray, that._params.removedContentTypeDescriptions);

                            that.__buildContentTypeDescriptionDropDown(that, contentType, filteredContentTypeDescriptionArray, contentTypeDocumentList);
                    	}
                    	else {
                            that.__buildContentTypeDescriptionDropDown(that, contentType, contentTypeDescriptionArray, contentTypeDocumentList);
                        }

                        if (that._params.onContentTypeDescriptionsCreated !== undefined)
                            that._params.onContentTypeDescriptionsCreated();
                    }
                },
                function (error, params) {
                    that._params.onError(error, { statusText: params.xhr.statusText });
                }
            );
        },

        __filterContentTypeDescriptionList: function (contentTypeDescriptionArray, removalList) {

            var filteredArray = [];
            var toRemove = removalList.split(",");

            for (var removeIndex = 0; removeIndex < toRemove.length; removeIndex++) {
                toRemove[removeIndex] = $.trim(toRemove[removeIndex]);
            }

            for (var arrayIndex = 0; arrayIndex < contentTypeDescriptionArray.length; arrayIndex++) {
                if (this.__inArray(contentTypeDescriptionArray[arrayIndex].documentClass, toRemove) === -1) {
                    filteredArray.push(contentTypeDescriptionArray[arrayIndex]);
                }
            }

            return filteredArray;
        },

        __buildContentTypeDescriptionDropDown: function (that, contentType, contentTypeDescriptionArray, contentTypeDescDropDown) {
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
                        displayedLoosePages[pageIndex] = $.trim(displayedLoosePages[pageIndex]);
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

        __addLoosePageOption: function (contentTypeDescDropDown, loosePageDisplayName) {
            var looseOption;
            if (loosePageDisplayName === undefined) {
                looseOption = new Option('');
            }
            else {
                looseOption = new Option(loosePageDisplayName);
            }
            contentTypeDescDropDown.add(looseOption);
        },

        __getContentTypeDocsWithNoUI: function (contentType, contentTypeDescriptionName) {
            var that = this;
            that.contentTypeDescriptionName = contentTypeDescriptionName;
            this.getContentTypeDescription(contentType,
                function (contentTypeDescriptionArray) {
                    that.contentTypeDescriptionArray = contentTypeDescriptionArray;

                    for (var cDocs in contentTypeDescriptionArray) {
                        if (contentTypeDescriptionArray[cDocs].documentClass === that.contentTypeDescriptionName) {
                            that.contentTypeDescription = contentTypeDescriptionArray[cDocs];
                        }
                    }
                },
                function (error, params) {
                    that._params.onError(error, { statusText: params.xhr.statusText });
                }
            );
        },

        __getIndexAndBatchFields: function (contentType, docClass) {
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
                }
                else {
                    documentClassNameForServer = dClass;
                }
            }

            if (this._params.displayedIndexFields === "" || this._params.displayedIndexFields === undefined) {
                that.indexFieldsForDocumentClass = "";
            }
            else {
                var tempindexFieldsDisplayed = this._params.displayedIndexFields.split(',');
                for (ifield = 0; ifield < tempindexFieldsDisplayed.length; ifield++) {
                    tempindexFieldsDisplayed[ifield] = $.trim(tempindexFieldsDisplayed[ifield]);
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
                    function (indexFieldsForDocClassArray) {
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
                    function (error_params) {
                        that._params.onError(error_params, { statusText: error_params.xhr.statusText });
                    }
                );

            }
            else {
                that.__buildBatchFieldTable(that._params.displayedBatchFields, contentType, false);
            }
        },

        __drawIndexFieldTable: function (indexFieldsForDocClassArray, dontDoArrayCheck) {
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

        __buildBatchFieldTable: function (displayedBatchFields, contentType, batchFieldDivPresent) {
            var that = this;
            //Here the list of batch fields that should be displayed when filtering is being used is done.
            if (displayedBatchFields === "" || displayedBatchFields === undefined) {
                that.batchFieldValuesForDisplayList = "";
            }
            else {
                var tempBatchFieldsDisplayed = this._params.displayedBatchFields.split(',');
                for (var ifield = 0; ifield < tempBatchFieldsDisplayed.length; ifield++) {
                    tempBatchFieldsDisplayed[ifield] = $.trim(tempBatchFieldsDisplayed[ifield]);
                }
                that.batchFieldValuesForDisplayList = tempBatchFieldsDisplayed;
            }

            if (batchFieldDivPresent) {
                that.getBatchFields(contentType,
                    function (batchFieldArray) {
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
                    function (error_params) {
                        that._params.onError(error_params, { statusText: error_params.xhr.statusText });
                    });
            } else {
                that.getBatchFields(contentType,
                function (batchFieldArray) {
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
                function (error_params) {
                    that._params.onError(error_params, { statusTest: error_params.xhr.statusText });
                });
            }
        },

        __drawBatchFieldRow: function (batchFieldArray, dontDoArrayCheck) {
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
                    }
                    else {
                        $(fieldHtml).appendTo('#atala-indexfield-table');
                    }
                    //Fire the batch field created event.
                    if (that._params.onBatchFieldCompleted !== undefined) {
                        that._params.onBatchFieldCompleted(indexFieldName[0]);
                    }
                }
            }
        },

        __replaceWhiteSpace: function (fieldName) {
            //This is a regex to get All The Whitespace. 
            return fieldName.replace(/\s/g, "_");
        },

        __inArray: function (elem, arr, i) {
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


        __setCurrentImportId: function (importId) {
            this.currentImportId = importId;
        },

        __scrapeFieldValues: function (fieldNamesArray, isBatchField, that) {
            var field;
            var fieldName;
            var fieldValue;
            var typeRequired;
            var hasValue;
            var result = [];

            if (fieldNamesArray === undefined)
                return result;

            for (index = 0; index < fieldNamesArray.length; index++) {
                if (isBatchField) {
                    field = fieldNamesArray[index].batchField.split(' / ');
                }
                else {
                    field = fieldNamesArray[index].indexField.split(' / ');
                }

                //get the name that was returned form the server.
                fieldName = field[0];

                if (isBatchField) {
                    fieldValue = $('#' + that.__replaceWhiteSpace(fieldName) + '_batchFieldInputId').val();
                }
                else {
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
                }
                else {
                    fieldName = "indexField_" + fieldName;
                    that.fieldValuesForImport[fieldName] = encodeURIComponent(fieldValue);
                }

                if (typeRequired[1] === 'true' && !hasValue) {
                    result.push(true);
                }
                else {
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
            }
            else {
                if (that._params.onIndexFieldTypeValidationStatus !== undefined) {
                    that._params.onIndexFieldTypeValidationStatus(that.customValidationCollection);
                }
            }
            return result;
        },

        __getFieldListValuesForImport: function (indexFieldNamesArray, batchFieldNameArray) {
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

        __checkIndexFieldValidationResults: function (requireFieldsHaveValues) {

            var key;
            for (var outer = 0; outer < requireFieldsHaveValues.length; outer++) {
                for (key = 0; key < requireFieldsHaveValues[outer].length; key++) {
                    if (requireFieldsHaveValues[outer][key] === true)
                        return false;
                }
            }

            return true;
        },

        __setIndexFieldsWithNoUi: function (indexFieldNamesAndValues) {
            var that = this;
            var indexFieldNameValuePairs = indexFieldNamesAndValues.split(",");

            if (indexFieldNameValuePairs.length === 1) {
                indexFieldNameValuePairs[0] = $.trim(indexFieldNameValuePairs[0]);
            }
            else {
                for (var index = 0; index < indexFieldNameValuePairs.length; index++) {
                    indexFieldNameValuePairs[index] = $.trim(indexFieldNameValuePairs[index]);
                }
            }

            for (var nameValuesIndex = 0; nameValuesIndex < indexFieldNameValuePairs.length; nameValuesIndex++) {
                var nameValuePair = indexFieldNameValuePairs[nameValuesIndex].split(":");
                that.fieldValuesForImport["indexField_" + nameValuePair[0]] = encodeURIComponent(nameValuePair[1]);
            }

        },

        __setBatchFieldsWithNoUi: function (batchFieldNamesAndValues) {
            var that = this;
            var batchFieldNameValuePairs = batchFieldNamesAndValues.split(",");
            var index;
            //Clean up surrounding whitespaces. 
            for (index = 0; index < batchFieldNameValuePairs.length; index++) {
                batchFieldNameValuePairs[index] = $.trim(batchFieldNameValuePairs[index]);
            }

            //Set the batch field values. 
            for (index = 0; index < batchFieldNameValuePairs.length; index++) {
                var nameValuePair = batchFieldNameValuePairs[index].split(":");
                that.fieldValuesForImport["batchField_" + nameValuePair[0]] = encodeURIComponent(nameValuePair[1]);
            }
        },

        __setLoosePages: function (setting) {
            var loosePageArray = setting.split(',');
            if (loosePageArray[0] === "true") {
                this.loosePages = true;
            }
            if (loosePageArray.length === 2) {
                this.loosePageDisplayName = $.trim(loosePageArray[1]);
            }
        },

        __buildContentTypeList: function (selectionBox, ContentTypeList, that) {
            for (var cType in ContentTypeList) {
                var opt = new Option(ContentTypeList[cType]);
                selectionBox.add(opt);
            }

            if (that._params.onContentTypesCreated !== undefined)
                that._params.onContentTypesCreated();
        },

        __filterContentTypes: function (contentTypes, contentTypesToRemove, defaultContentType) {
            var filteredContentTypes = [];
            var cTypesToRemove = [];

            if (defaultContentType !== undefined) {
                filteredContentTypes.push(defaultContentType);
            }

            var cTypeIndex;
            if (contentTypesToRemove !== undefined) {
                cTypesToRemove = contentTypesToRemove.split(",");


                for (var trimIndex = 0; trimIndex < cTypesToRemove.length; trimIndex++) {
                    cTypesToRemove[trimIndex] = $.trim(cTypesToRemove[trimIndex]);
                }

                for (cTypeIndex = 0; cTypeIndex < contentTypes.length; cTypeIndex++) {
                    if (this.__inArray(contentTypes[cTypeIndex], cTypesToRemove) === -1) {
                        filteredContentTypes.push(contentTypes[cTypeIndex]);
                    }
                }
            }
            else {
                for (cTypeIndex = 0; cTypeIndex < contentTypes.length; cTypeIndex++) {
                    if (contentTypes[cTypeIndex] !== defaultContentType) {
                        filteredContentTypes.push(contentTypes[cTypeIndex]);
                    }
                }
            }

            return filteredContentTypes;
        },

        __beforeImporting: function (that) {
            var result = true;

            if (that._params.onBeforeImport !== undefined) {
                result = that._params.onBeforeImport();
            }
            return result;
        },

        isInitialized: function () {
            return  this._params && this._params.handlerUrl;
        },

        initialize: function (params) {
            this.__resetFields();
            this._params = params;
            var that = this;
            var validationResults = [];
            var validated = false;

            if ($('.atala-content-type-list')[0] !== undefined) {
                this.getContentTypeList(
                    function (contentTypes) {
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
                        }
                        else {
                            that.__buildContentTypeList(contentTypeList, contentTypes, that);
                            that.contentType = contentTypes[0];
                        }

                        //Get doc classes. 
                        that.__getContentTypeDocs(that.contentType);

                        $('.atala-content-type-list').change(function () {
                            that.contentType = $('.atala-content-type-list option:selected').text();
                            that.__getContentTypeDocs(that.contentType);
                        });

                        $('.atala-content-type-document-list').change(function () {
                            that.contentTypeDescription = that.contentTypeDescriptionArray[$('.atala-content-type-document-list')[0].selectedIndex];
                            if ($('.atala-indexfield-list') !== undefined) {
                                that.__getIndexAndBatchFields(that.contentType, that.contentTypeDescription);
                            }
                        });
                        $('.atala-import-button').click(function () {
                            that.importDocument(
                                that.documentFilename, that.contentType, that.contentTypeDescription,
                                that._params.onImportCompleted, that._params.onError);
                        });
                        $('.atala-import-index-field-button').click(function () {
                            //For importing as a normal import.
                            if (that.contentTypeDescription !== undefined) {
                                validationResults = that.__getFieldListValuesForImport(that.indexFieldsForDocumentClassArray, that.batchFieldArray);
                                validated = that.__checkIndexFieldValidationResults(validationResults);

                                if (validated === true) {
                                    that.importIndexFieldDocument(
                                        that.documentFilename, that.contentType, that.contentTypeDescription, that.fieldValuesForImport,
                                        that._params.onImportCompleted, that._params.onError);
                                }
                                else {
                                    //get the specific failing fields form that.customValidationCollection

                                    that._params.onError(Atalasoft.Controls.Capture.Errors.fieldValidationError, that.customValidationCollection);
                                }
                            }
                                //For importing a loose page.  Will only work with KIC/KC.
                            else {
                                validationResults = that.__getFieldListValuesForImport(undefined, that.batchFieldArray);
                                validated = that.__checkIndexFieldValidationResults(validationResults);

                                if (validated === true) {
                                    that.importLoosePageDocument(that.documentFilename, that.contentType, that.fieldValuesForImport,
                                    that._params.onImportCompleted, that._params.onError);
                                }
                                else {
                                    that._params.onError(Atalasoft.Controls.Capture.Errors.indexFieldValidationError, that.customValidationCollection);
                                }
                            }
                        });

                        $('.atala-track-import-button').click(function () {
                            that.trackImportStatus(that.currentImportId, that._params.onTrackStatusReceived);
                        });
                    },
                    function (error, params) {
                        that._params.onError(error, { statusText: params.xhr.statusText + ((params.xhr.responseText.indexOf("LicenseException") != -1) ? " - Licensing" : "") });
                    }
                );
            }
            else {
                if ($('.atala-content-type-list')[0] !== undefined) {
                    $('.atala-content-type-list').change(function () {
                        that.contentType = $('.atala-content-type-list option:selected').text();
                        that.__getContentTypeDocs(that.contentType);
                    });
                }

                if ($('.atala-content-type-document-list')[0] !== undefined) {
                    $('.atala-content-type-document-list').change(function () {
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
                    }
                    else {
                        that.__getIndexAndBatchFields(that._params.contentType, undefined);
                    }
                }
                else {
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

                $('.atala-import-button').click(function () {
                    that.importDocument(
                        that.documentFilename, that._params.contentType, that.contentTypeDescription,
                        that._params.onImportCompleted, that._params.onError);
                });

                $('.atala-import-index-field-button').click(function () {

                    var fieldTypeCheck = false;

                    //Importing when there's no index/batch field UI.
                    if ($('.atala-indexfield-list')[0] === undefined) {
                        if (that._params.indexFields !== undefined) {
                            that.__setIndexFieldsWithNoUi(that._params.indexFields);
                        }
                        else {
                            if (that._params.batchFields !== undefined) {
                                that.__setBatchFieldsWithNoUi(that._params.batchFields);
                            }
                        }
                    }
                    else {
                        if (that._params.contentTypeDescriptionName !== undefined) {
                            validationResults = that.__getIndexFieldListValuesForImport(that.indexFieldsForDocumentClassArray);
                            fieldTypeCheck = true;
                        }
                        else {
                            validationResults = that.__getIndexFieldListValuesForImport(that.batchFieldArray);
                        }
                    }


                    if ($('.atala-indexfield-list')[0] !== undefined) {
                        validated = that.__checkIndexFieldValidationResults(validationResults);
                    }
                    else {
                        validated = true;
                    }

                    if (validated === true) {
                        if (that._params.contentTypeDescriptionName !== undefined) {
                            var cTypeDesc = [];
                            cTypeDesc.documentClass = that._params.contentTypeDescriptionName;
                            that.importIndexFieldDocument(
                                    that.documentFilename, that._params.contentType, cTypeDesc, that.fieldValuesForImport,
                                    that._params.onImportCompleted, that._params.onError);
                        }
                        else {
                            that.importLoosePageDocument(that.documentFilename, that._params.contentType, that.fieldValuesForImport,
                                    that._params.onImportCompleted, that._params.onError);
                        }
                    }
                    else {
                        if (fieldTypeCheck === true) {
                            that._params.onIndexFieldImportValidationError(Atalasoft.Controls.Capture.Errors.indexFieldValidationError, validationResults);
                        }
                        else {
                            that._params.onBatchFieldImportValidationError(Atalasoft.Controls.Capture.Errors.batchFieldValidationError, validationResults);
                        }

                    }
                });

                $('.atala-track-import-button, .atala-import-button').click(function () {
                    that.trackImportStatus(that.currentImportId, that._params.onTrackStatusReceived);
                });
            }
        },

        dispose: function() {
            $('.atala-content-type-list, .atala-content-type-document-list').each(function (i, select) {
                $(select).empty().off('change');
            });

            $('.atala-import-index-field-button, .atala-track-import-button').each(function (i, btn) {
                $(btn).off('click');
            });
            $('.atala-batchfield-list, .atala-indexfield-list').each(function (i, div) {
                $(div).empty();
            });

            this.__resetFields();
        },

        setBatchFieldValues: function (batchFieldValues) {
            var that = this;
            if (batchFieldValues.length > 0 && batchFieldValues !== undefined) {
                that.__setBatchFieldsWithNoUi(batchFieldValues);
            }
        },

        setIndexFieldValues: function (indexFieldValues) {
            var that = this;

            if (indexFieldValues.length > 0 && indexFieldValues !== undefined) {
                that.__setIndexFieldsWithNoUi(indexFieldValues);
            }
        },

        importDocument: function (filename, contentType, contentTypeDescription, onImportCompleted, onErrorImport) {
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
                        function (data, jqXHR) {
                            if (data.success === "true") {
                                onImportCompleted(data, data.id, data.status, jqXHR);
                                that.__setCurrentImportId(data.id);
                            }
                            else {
                                onErrorImport(data.errorMessage, jqXHR);
                            }
                        },
                    error:
                        function (jqXHR) { onErrorImport(Atalasoft.Controls.Capture.Errors.importError, { xhr: jqXHR }); }
                };

                $.ajax(requestObj);
            }

        },

        importIndexFieldDocument: function (filename, contentType, contentTypeDescription, indexFields, onImportCompleted, onErrorImport) {
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
                    function (data, jqXHR) {
                        if (data.success === "true") {
                            onImportCompleted(data, data.id, data.status, jqXHR);
                            that.__setCurrentImportId(data.id);
                        }
                        else {
                            onErrorImport(data.errorMessage, jqXHR);
                        }
                    },
                    error:
                    function (jqXHR) { onErrorImport(Atalasoft.Controls.Capture.Errors.importError, { xhr: jqXHR }); }
                };

                $.ajax(requestObj);
            }
        },

        importLoosePageDocument: function (filename, contentType, batchFields, onImportCompleted, onErrorImport) {
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
                function (data, jqXHR) {
                    if (data.success === "true") {
                        onImportCompleted(data, data.id, data.status, jqXHR);
                        that.__setCurrentImportId(data.id);
                    }
                    else {
                        onErrorImport(data.errorMessage, jqXHR);
                    }
                },
                    error:
                    function (jqXHR) { onErrorImport(Atalasoft.Controls.Capture.Errors.importError, { xhr: jqXHR }); }
                };

                $.ajax(requestObj);
            }
        },

        trackImportStatus: function (theImportId, onTrackStatusReceived) {
            $.get(
                this._params.handlerUrl + '?cmd=trackImportStatus&importId=' + encodeURIComponent(theImportId),
                {},
                function (data) {
                    onTrackStatusReceived(data.status);
                }
            );
        },

        getContentTypeList: function (onReceivedContentTypes, onErrorContentTypes) {
            $.getJSON(
                    this._params.handlerUrl + '?cmd=getContentTypeList', {},
                    function (data) { onReceivedContentTypes(data); }
                )
                .fail(function (jqXHR) { onErrorContentTypes(Atalasoft.Controls.Capture.Errors.contentTypesError, { xhr: jqXHR }); });
        },

        getContentTypeDescription: function (contentType, onReceivedContentDesc, onErrorContentDesc) {
            $.getJSON(
                    this._params.handlerUrl + '?cmd=getContentTypeDescription&contentType=' + contentType, {},
                    function (data) { onReceivedContentDesc(data); }
                )
                .fail(function (jqXHR) { onErrorContentDesc(Atalasoft.Controls.Capture.Errors.contentDescError, { xhr: jqXHR }); });
        },

        getIndexFieldsForDocumentClass: function (contentType, documentClass, onReceivedDocClassIndexFields, onErrorDocClassIndexFields) {
            $.getJSON(
                    this._params.handlerUrl + '?cmd=indexFieldsForDocumentClass&contentType=' + contentType + '&documentClass=' + documentClass, {},
                    function (data) { onReceivedDocClassIndexFields(data); }
            ).
            error(function (jqXHR) { onErrorDocClassIndexFields(Atalasoft.Controls.Capture.Errors.docClassIndexFieldError, { xhr: jqXHR }); });
        },

        getBatchFields: function (contentType, onReceivedBatchFields, onErrorBatchFields) {
            $.getJSON(
                    this._params.handlerUrl + '?cmd=getBatchFields&contentType=' + contentType, {},
                    function (data) { onReceivedBatchFields(data); }
            ).
            error(function (jqXHR) { onErrorBatchFields(Atalasoft.Controls.Capture.Errors.batchFieldsError, { xhr: jqXHR }); });
        }
    };

}(jQuery));
