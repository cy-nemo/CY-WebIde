define([], function () {
	return function () {
		return {
			/**
			 *	SAPUI5 Web IDE templates 1.34
			 */

			/**
			 * Applies template logic before generating the template resources in the provided zip file.
			 *
			 * This method is executed before passing the model into the template resources,
			 * and is therefore ideal for model manipulations.
			 *
			 * Note that this method is not called for templates that do not include resources.
			 *
			 * @param templateZip The zip bundle containing the template resources that are about to be generated,
			 * as provided by the template.
			 *
			 * @param model The template model as passed from the generation wizard based on the user selections.
			 */
			onBeforeTemplateGenerate: function (templateZip, model) {
				return [templateZip, model];
			},

			/**
			 * Applies template logic after generating the template resources according to the template model
			 * and bundling the generated resources into the provided zip file.
			 *
			 * This method is executed after passing the model into the template resources
			 * but before extracting the generated project zip file to the SAP RDE workspace.
			 * Therefore, this method is ideal for manipulating the generated project files
			 * (for example, renaming files according to the template model).
			 *
			 * @param projectZip The zip bundle containing all the generated project resources,
			 * after applying the model parameters on the template resources.
			 *
			 * @param model The template model as passed from the generation wizard based on the user selections.
			 */
			onAfterGenerate: function (projectZip, model) {
				var that = this;
				var aProjectSettings = [
					"sap.watt.uitools.ide.fiori"
				];
				return this.context.service.filesystem.documentProvider.getDocument("/" + model.projectName).then(function (oProjectDocument) {
					if (oProjectDocument) {
						if (!sap.watt.getEnv("internal")) {
							// remove files which are only relevant for SAP-internal usage - this part will only be executed for external builds
							projectZip.remove("pom.xml");
							var oBuildSettings = {
								"targetFolder": "dist",
								"sourceFolder": "webapp",
								"excludedFolders": ["test"],
								"excludedFiles": ["test.html"]
							};
							that.context.service.setting.project.setProjectSettings("build", oBuildSettings, oProjectDocument).done();
						}
						that.context.service.projectType.setProjectTypes(oProjectDocument, aProjectSettings).done();
					}
					return [projectZip, model];
				});
			}
		};
	};
});