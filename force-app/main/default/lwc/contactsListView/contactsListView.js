import { LightningElement, api } from 'lwc';
import fetchAllContacts from '@salesforce/apex/LWCContactsController.fetchAllContacts';
import deleteContact from '@salesforce/apex/LWCContactsController.deleteContact';

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];


const columns = [
    { label: 'Id', fieldName: 'Id', type:'text' },
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Phone', fieldName: 'Phone', type: 'text' },
    { label: 'Status__c', fieldName: 'Status__c' },
    { label: 'Email', fieldName: 'Email', type: 'text' },
    { label: 'AccountId', fieldName: 'AccountId', type: 'text' },
    { type: 'action', typeAttributes: { rowActions: actions } }
    
];



export default class ContactsListView extends LightningElement {
    @api handleRefreshList(){
        fetchAllContacts()
        .then(result => {
            this.data = result;
            console.log('list refreshed');
        })
        .catch(error => {
            this.error = error;
        });
    }
    data = [];
    columns = columns;

    
    connectedCallback(){
        fetchAllContacts()
        .then(result => {
            this.data = result;
        })
        .catch(error => {
            this.error = error;
        });

    }
    

    handleRowAction(event)
    {
        console.log('zyx')
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        console.log("row "+row.Status);
        //console.log("row "+row);
        switch (actionName) {
            case 'edit':
                console.log('edit action called');
                this.editContact(row);
                break;
            case 'delete':
                this.deleteContact(row);
                console.log('delete action called');
                break;
            default:
        }
    }

    deleteContact(row){
        console.log('row is: '+row.Id);
        
        deleteContact({
            contactId:row.Id
        })
        .then(result => {
            console.log('deleted successfully'+result);
            this.handleRefreshList();
        })
        .catch(error => {
            console.log(error);
        });
        
    }

    editContact(row){

        this.dispatchEvent(new CustomEvent('editaction',{
            detail:row
        }));
    }
}