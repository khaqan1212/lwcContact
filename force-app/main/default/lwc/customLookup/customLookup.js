
import { LightningElement, api, track } from 'lwc';
import fetchRecords from '@salesforce/apex/CustomLookupController.fetchRecords';
import AccountId from '@salesforce/schema/Case.AccountId';

export default class CustomLookup extends LightningElement {

    @api accountId;
    @api accountName;
    @api objectName;
    @api fieldName;
    @api value;
    @api iconName;
    @api label;
    @api placeholder;
    @api className;
    @api required = false;
    @track searchString;
    @track selectedRecord;
    @track recordsList;
    @track message;
    @track showPill = false;
    @track showSpinner = false;
    @track showDropdown = false;
    @track onEditPill = false;

    connectedCallback() {
        if(this.value)
            this.fetchData();
    }

    searchRecords(event) {
        this.searchString = event.target.value;
        if(this.searchString) {
            this.fetchData();
        } else {
            this.showDropdown = false;
        }
    }

    selectItem(event) {
        if(event.currentTarget.dataset.key) {
    		var index = this.recordsList.findIndex(x => x.value === event.currentTarget.dataset.key)
            if(index != -1) {
                this.selectedRecord = this.recordsList[index];
                this.value = this.selectedRecord.value;
                console.log(this.value);
                this.showDropdown = false;
                this.showPill = true;
                this.onEditPill = false;
                this.dispatchEvent(new CustomEvent('accid', {
                    detail: this.value
                }));
            }
        }
    }

    removeItem() {
        this.showPill = false;
        this.value = '';
        this.selectedRecord = '';
        this.searchString = '';
        this.onEditPill = false;
    }

    showRecords() {
        if(this.recordsList && this.searchString) {
            this.showDropdown = true;
        }
    }

    blurEvent() {
        this.showDropdown = false;
    }

    fetchData() {
        this.showSpinner = true;
        this.message = '';
        this.recordsList = [];
         fetchRecords({
            objectName : this.objectName,
            filterField : this.fieldName,
            searchString : this.searchString,
            value : this.value
        })
        .then(result => {
            if(result && result.length > 0) {
                if(this.value) {
                    this.selectedRecord = result[0];
                    this.showPill = true;
                } else {
                    this.recordsList = result;
                }
            } else {
                this.message = "No Records Found for '" + this.searchString + "'";
            }
            this.showSpinner = false;
        }).catch(error => {
            this.message = error.message;
            this.showSpinner = false;
        })
        if(!this.value) {
            this.showDropdown = true;
        }
    }

    //to clear the field
    @api handleClearField(){
        this.removeItem();
    }

    @api handleEditLookup(accountId, accountName){
        console.log('id:'+accountId + ' Name:'+accountName);

        this.onEditPill = true;
        this.accountId = accountId;
        this.accountName = accountName;
        this.showDropdown = false;
        
       console.log('handleEditLookup in child called');
    }

}