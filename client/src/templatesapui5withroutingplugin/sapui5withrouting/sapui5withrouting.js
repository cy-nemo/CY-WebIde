define(["sap/watt/lib/jszip/jszip-shim","./shared"], function(JSZip,shared) {
	return function() {

		var NEW_TEMPLATE_VERSION = "1.40.12";
		var OLD_DEFAULT_THEME = "sap_bluecrystal";
		var NEW_DEFAULT_THEME = "sap_belize";
		var OLD_AVAILABLE_THEMES = ["sap_hcb", "sap_bluecrystal"];
		var NEW_AVAILABLE_THEMES = ["sap_hcb", "sap_belize"];

		return {

			configWizardSteps: function(oTemplateCustomizationStep) {},

			onBeforeTemplateGenerate: function(templateZip, model) {
				shared.registerHandlebarHelpers();
				if (model.selectedTemplate.getVersion() === NEW_TEMPLATE_VERSION) {
					model.ui5Config = {
						Theme: NEW_DEFAULT_THEME,
						AvailableThemes: NEW_AVAILABLE_THEMES
					};
				} else {
					model.ui5Config = {
						Theme: OLD_DEFAULT_THEME,
						AvailableThemes: OLD_AVAILABLE_THEMES
					};
				}
				model.sapUI5Url = "../../resources/sap-ui-core.js";
				//replace filename from wizard
				templateZip.files["webapp/controller/pages/Page1.controller.js.tmpl"].name = "webapp/controller/pages/"+model.basicSAPUI5ApplicationProject.parameters.name1.value+".controller.js.tmpl";
				templateZip.files["webapp/controller/pages/Page2.controller.js.tmpl"].name = "webapp/controller/pages/"+model.basicSAPUI5ApplicationProject.parameters.name2.value+".controller.js.tmpl";
				templateZip.files["webapp/view/pages/Page1.view.xml.tmpl"].name = "webapp/view/pages/"+model.basicSAPUI5ApplicationProject.parameters.name1.value+".view.xml.tmpl";
				templateZip.files["webapp/view/pages/Page2.view.xml.tmpl"].name = "webapp/view/pages/"+model.basicSAPUI5ApplicationProject.parameters.name2.value+".view.xml.tmpl";
				return [templateZip, model];
			},

			onAfterGenerate: function(projectZip, model) {
				if (!sap.watt.getEnv("internal")) {
					// remove files which are only relevant for SAP-internal usage
					projectZip.remove("pom.xml");
				}
				return [projectZip, model];
			}
		};
	};
});