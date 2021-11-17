import { LightningElement, api,track } from 'lwc';
import createContact from '@salesforce/apex/LWCContactsController.createContact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAccountName from '@salesforce/apex/LWCContactsController.getAccountName';
import getStatusPickListValues from '@salesforce/apex/LWCContactsController.getStatusPickListValues';


export default class lWCContact extends LightningElement {

    @track contact = {LastName:'', Email:'', Phone:'', AccountId:'',Status__c:'', Id:''};
    accountName;
    statusPickListValues = [];

    connectedCallback(){
        this.callGetStatusPickListValues();
    }

    handleChange(event) {
        this.contact[event.target.name]=event.detail.value;
    }

    saveContact(){ 
        createContact({
            contactObject:this.contact
        })
        .then(result => {
            console.log('result is: '+result);
            this.handleRefreshList();
            this.handleClearForm();
            this.showNotification();
        })
        .catch(error => {
            console.log(error);
        });;
        
    }
    handleRefreshList(){
        this.template.querySelector('c-contacts-list-view').handleRefreshList();
    }

    handleAccId(event){
        this.contact.AccountId = event.detail;
        console.log('From Parent: '+ this.contact.AccountId);
    }

    handleClearForm(){
        console.log('Clear form is called');
        this.template.querySelector('c-custom-lookup').handleClearField();
        this.contact = {};
    }

    _title = 'Success';
    message = 'Contact has been saved successfully!';
    variant = 'success';

    titleChange(event) {
        this._title = event.target.value;
    }

    messageChange(event) {
        this.message = event.target.value;
    }

    variantChange(event) {
        this.variant = event.target.value;
    }
    showNotification() {
        const evt = new ShowToastEvent({
            title: this._title,
            message: this.message,
            variant: this.variant,
        });
        this.dispatchEvent(evt);
    }

    async editActionHandler(event){
        console.log('parent action handler');
        let contact = event.detail;
        this.contact.LastName = contact.Name;
        this.contact.Phone = contact.Phone;
        this.contact.Email = contact.Email;
        this.contact.Id = contact.Id;
        this.contact.Status__c = contact.Status__c;
        this.contact.AccountId = contact.AccountId;
        console.log('status: '+contact.Status__c)
        
        try{
            const result = await getAccountName({accountId:this.contact.AccountId});
            this.template.querySelector('c-custom-lookup').handleEditLookup(this.contact.AccountId, result);
        }
        catch(err){
            console.log('Error: '+err);
        }    
    }


    callGetStatusPickListValues(){
        getStatusPickListValues()
            .then(result => {
                console.log(result);
                for(let i = 0; i < result.length; i++){
                    const option = {
                        label : result[i],
                        value : result[i]
                    };
                    this.statusPickListValues = [...this.statusPickListValues, option];
                }
            })
            .catch(error => {
                console.log('Error: '+error);
            });
    }
}