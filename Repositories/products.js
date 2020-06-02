const Repositories=require('./Repositories');

class ProductRepository extends Repositories{

}

module.exports=new ProductRepository('products.json');