import { LightningElement, api } from 'lwc';
import fetchAllContacts from '@salesforce/apex/LWCContactsController.fetchAllContacts';
import deleteContact from '@salesforce/apex/LWCContactsController.deleteContact';
import {cols, acts} from './tableHelper';

const columns = cols;


export default class ContactsListView extends LightningElement {

    @api loaded = false;

    @api handleRefreshList(){
        this.loaded = false;
        fetchAllContacts()
        .then(result => {
            this.loaded = true;
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
            this.loaded = true;
            this.data = result;
        })
        .catch(error => {
            this.loaded = true;
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