const fs=require('fs');
const crypto=require('crypto');
const util=require('util');
const Repositories=require('./Repositories');

const scrypt=util.promisify(crypto.scrypt);
class UserRepository extends Repositories {
     //This will create a record with given attributes and will assign a randomly generated ID to make each record unique
    async createUser(attr){
        attr.id=this.randomID();
        const salt=crypto.randomBytes(8).toString('hex');
        const hashed=await scrypt(attr.password,salt,64);
        
        const record=await this.getAll();
        
        record.push({
            ...attr,
            password:`${hashed.toString('hex')}.${salt}`
        });
        await this.writeAll(record);
        return record;
        }

        async comparePass(saved,supplied){
            const [hashed,salt]=saved.split('.');  //destructuring saved password (hashed.salt)
            const suppliedHashed=await scrypt(supplied,salt,64);   //hasing the entered signin password and salt using scrypt
            return hashed === suppliedHashed.toString('hex');    
        }
        
}


//Another file can import this repository class using require in their own file
module.exports=new UserRepository('users.json');
