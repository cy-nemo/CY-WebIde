define({

	/**
	 * determines if we are running in "SAP internal" mode
	 */
	_internal : function () {
		var iIndex = document.location.search.indexOf("sap-ide-xx-tmpl-external");
		return (iIndex !== -1) ? false : sap.watt.getEnv("internal");
	},

	/**
	 * determines if we are running in "mobile enablement" mode
	 * (i.e. the mobile plugin active and the user has chosen to use it in the previous wizard step)
	 */
	_mobile : function (oWizModel) {
		var iIndex = document.location.search.indexOf("sap-ide-xx-tmpl-mobile");
		return (iIndex !== -1) ? true : oWizModel.getData().bMobileEnabled === true;
	},

	/**
	 * changes the default FLP setting to false
	 */
	modifyModelMobile : function(oWizModel, oTmplModel, sTemplateName) {

		// TODO: this hook only gets invoked once if a user goes back in the wizart changes the mobile checkbox it will have no effect

		if (!this._mobile(oWizModel)) {
			return;
		}

		// change FLP default value
		oTmplModel.oData[sTemplateName].parameters.FLP.defaultValue = {
			"name": "Standalone App",
			"value": false
		};
	},

	/**
	 * remove SAP internal parameters in the external mode.
	 *
	 * when groups in model.json are re-arranged, update this selection of the group !!!
	 *
	 * the function might be called several times !! it's necessary to check if the modifications have already been done.
	 */
	modifyModelExternally : function(oTmplModel, sTemplateName) {

		if (this._internal()) {
			return;
		}

		// remove the "Application Component Hierarchy" parameter
		// (assumptions: it's in the first group titled "Application Settings")
		var sParamToRemove = sTemplateName + ".parameters.ApplicationComponentHierarchy"; // leading "@" needs to be removed!
		var aGroups = oTmplModel.oData[sTemplateName].forms[0].groups;
		var aParameters = aGroups[0].parameters;
		var iParamIndex = aParameters.indexOf(aParameters.resolve(sParamToRemove));
		if (iParamIndex > -1) {
			aParameters.splice(iParamIndex, 1);
		}

		// remove the "SAP Fiori ID" parameter
		// (assumptions: it's in the first group titled "Application Settings")
		sParamToRemove = sTemplateName + ".parameters.FioriID";
		iParamIndex = aParameters.indexOf(aParameters.resolve(sParamToRemove));
		if (iParamIndex > -1) {
			aParameters.splice(iParamIndex, 1);
		}
	},

	/**
	 * no whitespace / \ . -
	 * cast to string is a hack for ticket #1570474199 if it is fixed, we can remove it
	 */
	modifyModelNavigationHack : function (oModel, sTemplateName) {
		var oParameters = oModel[sTemplateName].parameters;
		oParameters.append("NavigationIntent", ("" + oParameters.ApplicationTitle.value).replace(new RegExp("\\.|/|\\\\|-|\\s", "g"), ""));
	},

	/**
	 * set environment with additional information not supplied by user in wizard
	 */
	modifyModelAddEnvironment : function (oModel, sTemplateName) {
		if (!this._internal()) {
			return;
		}
		oModel[sTemplateName].environment.internal = "true";
		oModel[sTemplateName].environment.uuid = this._generateUUID();
	},

	modifyModelDatasource: function(oModel) {
		if (oModel.connectionData && oModel.connectionData.destination && oModel.connectionData.destination.additionalData) {
			oModel.isFullUrl = oModel.connectionData.destination.additionalData.indexOf("full_url") !== -1 ? true : false;
		} else {
			oModel.isFullUrl = false;
		}
	},

	_generateUUID : function() {
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		});
		return uuid;
	},

	/**
	 * Register misc helpers for handlebars templating
	 */
	registerHandlebarHelpers : function() {

		// helper that is used to identify if no objectNumber and no UoM are selected to
		// strip out the respective HTML-Tags
		Handlebars.registerHelper("cleanObjectNumber", function(data, options) {
			var number = data.parameters.Object_Number.value,
				unit = data.parameters.Object_UnitOfMeasure.value;
			if(number || unit){
				return options.fn(this);
			}
			return options.inverse(this);
		});

		Handlebars.registerHelper("formatNamespace", function(namespace) {
			// cast to string is a hack for ticket #1570474199 if it is fixed, we can remove it
			return ("" + namespace).replace(/\./g, "\/");
		});

		Handlebars.registerHelper("formatUrl", function(url) {
			if (url === undefined){
				return "/here/goes/your/serviceurl/";
			} else {
				// add a trailing slash, since mockserver will break if there is no /
				if (url.lastIndexOf("/") !== (url.length - 1)) {
					url = url + "/";
				}
				return url;
			}
		});
		Handlebars.registerHelper("needQuots", function(sType, oOptions) {
			if (sType === "String" || sType === "LargeString"){
				return oOptions.fn(this);
			}
			return oOptions.inverse(this);
		});

		Handlebars.registerHelper("doubleCurlyBrackets", function(sString) {
			return "{{" + sString + "}}";
		});

		Handlebars.registerHelper("singleCurlyBracket", function(sString) {
			return "{" + sString;
		});

		Handlebars.registerHelper("sevenDigitRandomNumber", function () {
			// according to the webIDE a 1 is also a valid id it is up to seven digits
			return Math.floor((Math.random() * 9999999) + 1);
		});

		Handlebars.registerHelper("if_eq", function(s1, s2, oOptions) {
			if (s1 === s2) {
				return oOptions.fn(this);
			} else {
				return oOptions.inverse(this);
			}
		});
	},

	/**
	 * workaround for ticket 1570573232 metadata got lost when it was specified in plugin.json in some cases
	 */
	modifyZipMetadataWorkaround : function (oProjectZip, oModel) {
		oProjectZip.file("webapp/localService/metadata.xml", oModel.connectionData.metadataContent, {createFolders : true});
	},

	/**
	 * get rid of the mockdata since it is not matching the service of the created app
	 */
	modifyZipRemoveMockdata : function (oProjectZip) {
		oProjectZip.remove("webapp/localService/mockdata");
	},

	/**
	 * remove files which are only relevant for SAP-internal usage
	 */
	modifyZipExternally : function (oProjectZip) {
		if (this._internal()) {
			return;
		}
		oProjectZip.remove("pom.xml");
		oProjectZip.remove("extensionDocu.properties");
		oProjectZip.remove("webapp/WEB-INF");
	},

	/**
	 * remove all edit related files
	 */
	modifyZipEdit : function (oProjectZip, oModel, sTemplateName ) {
		if (oModel[sTemplateName].parameters.Edit.value) {
			return;
		}
		oProjectZip.remove("webapp/controller/Edit.controller.js");
		oProjectZip.remove("webapp/view/Edit.view.xml");
		oProjectZip.remove("webapp/view/MessagePopover.fragment.xml");
		oProjectZip.remove("webapp/test/integration/CrudJourney.js");
		oProjectZip.remove("webapp/test/integration/pages/Edit.js");
	},

	/**
	 * add additional information to the project for builds (only external)
	 */
	modifyProjectExternalBuild : function (oContext, oModel) {
		if (this._internal()) {
			return;
		}
		var oBuildSettings = {
				"targetFolder": "dist",
				"sourceFolder": "webapp",
				"excludedFolders": ["test"],
				"excludedFiles": ["test.html"]
			},
			aProjectTypes = [
				"com.watt.common.builder.sapui5clientbuild"
			];
		oContext.service.filesystem.documentProvider.getDocument("/" + oModel.projectName).then(function (oProjectDocument) {
			oContext.service.projectType.addProjectTypes(oProjectDocument, aProjectTypes);
			oContext.service.setting.project.setProjectSettings("build", oBuildSettings, oProjectDocument);
		});
	},

	/**
	 * remove launch HTML files depending on FLP or FLP-free variant
	 */
	modifyZipFLP : function (oProjectZip, oModel, sTemplateName) {
		var oFLPValue = oModel[sTemplateName].parameters.FLP.value;
		if (oFLPValue && oFLPValue.value) {
			oProjectZip.remove("webapp/index.html");
			oProjectZip.remove("webapp/test/mockServer.html");
		} else {
			oProjectZip.remove("webapp/test/flpSandbox.html");
			oProjectZip.remove("webapp/test/flpSandboxMockServer.html");
			oProjectZip.remove("webapp/test/integration/FLPIntegrationJourney.js");
		}
	},

	addNeoDestinations: function(model) {
		var localResources = {
			"path": "/webapp/resources",
			"target": {
				"type": "service",
				"name": "sapui5",
				"entryPath": "/resources"
			},
			"description": "SAPUI5 Resources"
		};
		var localTestResources = {
			"path": "/webapp/test-resources",
			"target": {
				"type": "service",
				"name": "sapui5",
				"entryPath": "/test-resources"
			},
			"description": "SAPUI5 Test Resources"
		};

		model.neoapp.destinations.push(localResources);
		model.neoapp.destinations.push(localTestResources);
	}

});
