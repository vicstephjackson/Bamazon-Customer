let mysql = require('mysql');
let inquirer = require('inquirer');

let connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"Corina08",
    database:"bamazon"
})

connection.connect(function(err){
    if(err) throw err;
    console.log("connection successful!");
    makeTable();
})
 let makeTable = function(){
     connection.query("SELECT * From products", function(err,res){
         for(let i=0; i<res.length; i++){
             console.log(res[i].itemid+" || "+res[i].productname+" || "+
             res[i].departmentname+" || "+res[i].price+" || "+res[i].
             stockquanity+"\n");
         }
         promptCustomer(res);
        })
    }
         let promptCustomer = function(res){
             inquirer.prompt([{
                 type:'input',
                 name:'choice',
                 message:"Please enter the ID of the product you would like to purchase.[Quit with q]"

             }]).then(function(answer){
                 let correct = false;
                 for(let i=0;i<res.length;i++){
                     if(res[i].productname==answer.choice){
                         correct=true;
                         let product=answer.choice;
                         let id=i;
                         inquirer.prompt({
                             type:"input",
                             name:"quant",
                             message:"How many would you like to purchase?",
                             validate: function(value){
                                 if(isNaN(value)==false){
                                     return true;
                                 }else{
                                     return false;
                                 }
                             }
                         }).then(function(answer){
                             if((res[id].stockquanity-answer.quant)>0){
                                 connection.query("Update products SET stockquanity='"+(res[id].stockquanity-
                                 answer.quant)+"' WHERE productname='"+product
                                 +"'", function(err,res2){
                                 console.log("Product Bought!");
                                 makeTable();  
                         })
                        }else{
                            console.log("Not a valid selection!");
                            promptCustomer(res);
                    }
                 })
                }
            }
        })

                   
    }
