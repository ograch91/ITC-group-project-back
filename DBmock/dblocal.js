/**
 * create mock object data for testing/ui purposes
 * implement local usage with local json files
 */
 const { v4: uuidv4 } = require('uuid');
 const fs = require('fs');

 const path = 'DBmock';
 
 class DbCollection {
   constructor(name) {
     this.path = `${path}/${name}.json`;
   }
 
   save = list => {
     fs.writeFileSync(this.path, JSON.stringify(list));
   };
 
   get = () => {
     try {
       const content = fs.readFileSync(this.path, 'utf-8');
       return JSON.parse(content);
     }
     catch (err) {
       return [];
     }
   };
 
   getById = id => {
     const list = this.get();
     const item = list.find(i => i.id === parseInt(id));
 
     return item;
     //return the item with that id
   };
 
   add = json => {
     const list = this.get();
 
     const newItem = {
       ...json,
       id: uuidv4(),
     };
 
     list.push(newItem);
 
     this.save(list);
 
     return newItem;
   };
 
   deleteById = id => {
     const list = this.get();
     const filteredList = list.filter(i => i.id !== parseInt(id));
     this.save(filteredList);
   };
 
   updateItem = (id, json) => {
     const list = this.get();
     const index = list.findIndex(i => i.id === parseInt(id));
     if (index === -1) {
       return;
     }
     list[index] = { ...json, id: parseInt(id) };
     this.save(list);
   };
 }
 
 module.exports = DbCollection;
