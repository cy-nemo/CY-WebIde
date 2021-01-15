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
		
		setFocusOnFirstItem : function() {
   
                  // Call the focus() method for your first UI element.                        
    	},
        validateStepContent : function() {
              
	    	// Return a Q-promise which is resolved if the step content 
	        // is currently in valid state, and is rejected if not.
	    },
	
	    cleanStep : function() {
	
	    	// 1. Clean properties that were added to this.getModel().getData().
	        // 2. Clean the control's private members.
	        // 3. Clean the UI controls created by this control
	        //    that are not currently displayed.
	        //    Currently displayed content is destroyed by the wizard before
	        //    this step is displayed again.
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
			var oBtn = new sap.m.Button({
				text: "테스트",
				press: function(){
					// var oModel = new sap.ui.model.json.JSONModel();
					// var jsonTemplate = new sap.ui.model.json.JSONModel(jQuery.sap.getModulePath("test/data", "/jsonData.json"));
					// jsonTemplate.attachRequestCompleted(function(oJsonEvent){  
					// 	oModel= oJsonEvent.getSource(); 
					// 	// that.getView().setModel(oModel);
					// });
					var oThat = this;
					
					$.ajax({
					    url: "https://sapui5.hana.ondemand.com/test-resources/sap/suite/ui/commons/demokit/sample/Timeline/data.json",
					    type: "GET",
					    data: "",
					    success: function(response){
					        var oModel= oThat.getModel();
					        var oParentLayout = oThat.getParent().getParent();
					        oModel.setProperty("/basicSAPUI5ApplicationProject/parameters/responseData",response.Employees[0]);
					        
					        
					        var aEntry = Object.keys(response.Employees[0]);
					        
					        var aFieldKey = [];
					        var lhBox = new sap.m.HBox({
								width:"100%",
								class:"sapUiContentPadding"
							});
					        
					        // var cbWizardTypesTemplate = new sap.ui.core.ListItem({
					        //     key: "{name}",
					        //     text: "{value}"
					        // });
					        
					        aEntry.forEach(function(val,idx,arr){
					        	aFieldKey.push({"name":val,"value" : val});
					        	
					        });
					        
					        oModel.setProperty("/ComboData",aFieldKey);
					        
					   //     aFieldKey.forEach(function(val,idx,arr){
					   //     	var oSearchLabel = new sap.m.Label({
								// 	text: val.name
								// });
								// // var sPath = "{/SearchCondition/"+val.name+"}"
					   // 		var oSearchInput = new sap.m.Input();
					   // 		oSearchInput.bindProperty("value", "SearchCondition>/" + val.name); 
	       //                     lhBox.addItem(oSearchLabel);
	       //                     lhBox.addItem(oSearchInput);
	       //                     oParentLayout.addContent(lhBox);
					   //     });
					        
					        oModel.setProperty("/basicSAPUI5ApplicationProject/parameters/ObjectCollection/binding",aFieldKey);
					        oModel.setProperty("/basicSAPUI5ApplicationProject/parameters/ObjectCollection1/binding",aFieldKey);
					        oModel.setProperty("/basicSAPUI5ApplicationProject/parameters/ObjectCollection2/binding",aFieldKey);
					        
					        
					        sap.ui.commons.MessageBox.alert("Service 정보 가져오기 성공.");
					    }
					});
				}
			});
			
			hBox.addItem(oLabel);
			hBox.addItem(oInput);
			hBox.addItem(oBtn);
			
			lVLayout.addContent(hBox);
			
			return lVLayout;
		}
	
	});
});