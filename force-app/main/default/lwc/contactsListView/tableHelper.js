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

export{columns as cols, actions as acts};