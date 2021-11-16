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
                console.log(error);
            });
    }

    handleChange(event) {
        this.contact[event.target.name]=event.detail.value;
        /*
        if(event.target.name == 'firstName')
        {
            this.contact.LastName = event.detail.value;
            console.log('nameObje:'+this.contact.LastName);
        }
        else if(event.target.name == 'Email')
        {
            this.contact.Email = event.detail.value;
            console.log('emailObject:'+this.contact.Email);
        }
        else if(event.target.name == 'status'){
            this.contact.Status__c = event.detail.value;
            console.log('statusObje:'+this.contact.Status__c);
        }else if(event.target.name == 'Phone'){
            this.contact.Phone = event.detail.value;
            console.log('phoneObj:'+this.contact.Phone);
        }else if(event.target.name == 'id'){
            this.contact.Id = event.detail.value;
            console.log('id:'+this.contact.Id);
        }
        */
    }

    saveContact(){

        console.log('contact is: '+this.contact.LastName)
        console.log('contact is: '+this.contact.Email)
        console.log('contact is: '+this.contact.Phone)
        console.log('contact is: '+this.contact.Status__c)
        
        //console.log('hello');
        //console.log('contact: ' + this.contact.LastName);
       // console.log('helloAfter');
        //console.log('before saving: '+ this.contact.LastName);
        /*
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
        */
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
        

        /*
        try{
            const result = await getAccountName({accountId:accountId});
            this.template.querySelector('c-custom-lookup').handleEditLookup(this.contact.AccountId, result);
        }
        catch(err){
            console.log(err);
        }
        */
        
        async function doFetchAccountName(accountId, _this){
            try{
                const result = await getAccountName({accountId:accountId});
                console.log('Account Name is: ' + result);
                _this.template.querySelector('c-custom-lookup').handleEditLookup(_this.contact.AccountId, result);
            } 
            catch(err){
                console.log(err);
            }
        }
        doFetchAccountName(contact.AccountId,this);
        
    }
}