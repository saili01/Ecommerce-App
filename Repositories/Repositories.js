const fs=require('fs');
const crypto=require('crypto');

module.exports=
    class Repositories{
        constructor(filename){
            //check if the filename is passed as an argument to the constructor or is null
            if(!filename){
                throw new Error('Please provide a filename in the repository')
            }
        
         this.filename=filename; //storing the file in our instance variable
         //try and access the filename on hard drive and if it does not exists it will throw error
         //'Sync' method will wait for some amount of time before executing next statements. Can be used since instance of this class wil be created only once and hence affordable to wait for some time
         try{
          fs.accessSync(this.filename);
         }
         //In the try block if error occurs it will be caught in catch block and new file with same filename would be created inside our repository
         catch(err){
             fs.writeFileSync(this.filename,'[]'); 
         }
        }

        async create(attr){
            attr.id=this.randomID();
            const records=await this.getAll();
            records.push(attr);
            await this.writeAll(records);
            return attr;

        }
        
        //This will read all the records saved in users.json file
        async getAll(){
        return  JSON.parse(await fs.promises.readFile(this.filename,{encoding: 'utf8'}));
        //console.log(com);
        
        }
        
        //This will write all the records in users.json file also converting java script values into json objects(stringify)
        async writeAll(records){
            await fs.promises.writeFile(this.filename,JSON.stringify(records,null,2)); //null,2 ->Identation, Better JSON formatting
        }
        
        //generating a random ID using crypto library 
         randomID(){
             const cryp=crypto.randomBytes(4).toString('hex');
             return cryp;
         }
         //accessing a record using ID
         async getById(id){
             const records=await this.getAll();
             return records.find(record=>record.id === id)
         }
         //Write all the records in json file whose IDs does not match with the ID which we want to delete
         async delete(id){
             const records=await this.getAll();
             await this.writeAll(records.filter(record=>record.id !== id)); // write all the records to the json file if their id does not match the required id. The records will get override
         }
        
         //Updating record using Object.assign() and writing all the records
         async update(id,attr){
          const records=await this.getAll();
          const record=records.find(record=>record.id === id)
          if(!record){
              throw new Error(`Record with ID ${id} does not exist`);
          }
          Object.assign(record,attr);
          await this.writeAll(records);
         }
        
         //This function will return first occurence of the matched data
         async getOneBy(filter){
           const records=await this.getAll();
           for(let record of records){
               let found=true;
               for(let key in filter){
                  
                   if(record[key] !== filter[key]){
                       found=false;
                   }
               }
               if(found){
                   return record;
               }
           }
         }
    }
