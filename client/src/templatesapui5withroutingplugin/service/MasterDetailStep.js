define(["templatesapui5withroutingplugin/control/MasterDetailStep"], function(MasterDetailStep){
       "use strict"
       return{
        getContent : function() {
              var oMyStepContent = new MasterDetailStep({
                     context : this.context
              });
 
              var sTitle = this.context.i18n.getText("Config_template_mycustomwizard_desc");
              var sDescription = this.context.i18n.getText("myStep_description");
  
              return this.context.service.wizard.createWizardStep(oMyStepContent,sTitle, sDescription);
        }
    }
});