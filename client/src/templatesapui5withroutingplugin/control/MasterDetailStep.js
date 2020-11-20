define(["sap.watt.ideplatform.template/ui/wizard/WizardStepContent",
	"sap/ui/model/json/JSONModel"
],
	function (WizardStepContent,JSONModel) {
	"use strict";

	jQuery.sap.declare("templatesapui5withroutingplugin.control.MasterDetailStep");
	return WizardStepContent.extend("templatesapui5withroutingplugin.control.MasterDetailStep", {

		init: function () {
			var oPageStepContent = this._createPageContent();
			this.addContent(oPageStepContent);
		},
		renderer: {},
		onBeforeRendering: function () {
		},
		_createPageContent: function () {
			var lVLayout = new sap.ui.layout.VerticalLayout({
				width:"100%",
				class:"sapUiContentPadding"
			});
			
			var hBox = new sap.m.HBox({
				width:"100%",
				class:"sapUiContentPadding"
			});
			var oLabel = new sap.m.Label({
				text: "Service명을 입력하세요."
			});
			var oInput = new sap.m.Input({
				value:"{/CustomInputValue}",
				change: function() { 
					this.fireValidation({
						isValid: true
					});
				}.bind(this)
			});
			var that = this;
			var oBtn = new sap.m.Button({
				text: "테스트",
				press: function(){
					var oModel = new sap.ui.model.json.JSONModel();
					var jsonTemplate = new sap.ui.model.json.JSONModel(jQuery.sap.getModulePath("test/data", "/jsonData.json"));
					jsonTemplate.attachRequestCompleted(function(oJsonEvent){  
						oModel= oJsonEvent.getSource(); 
						// that.getView().setModel(oModel);
					});
				}
			});
			
			hBox.addItem(oLabel);
			hBox.addItem(oInput);
			hBox.addItem(oBtn);
			
			lVLayout.addContent(hBox);
			
			return lVLayout;
		},
		
		
		validateStepContent: function () {
			// Return a Q-promise which is resolved if the step content 
			// is currently in valid state, and is rejected if not.
		},
		cleanStep: function () {
			// 1. Clean properties that were added to this.getModel().getData().
			// 2. Clean the control's private members.
			// 3. Clean the UI controls created by this control
			//    that are not currently displayed.
			//    Currently displayed content is destroyed by the wizard before
			//    this step is displayed again.
		}
	});
});