
//addUser(id,name,room)
//removeUser(id)
//getUser(id)
//getUserList(room)

class Users{
  constructor(){
    this.users=[];
  }
  addUser(id,name,room){
    var user = {id,name,room};
    this.users.push(user);
    return user;
  }
removeUser(id){
  var user = this.getUser(id);
  if(user){
    this.users= this.users.filter((user)=>user.id!==id);
  }
  return user;
  }
  getUser(id){
    var users= this.users.filter((user)=>{
      return user.id==id;
    })[0];
    return users;
  }
  getUserList(room){
    var users = this.users.filter((user)=>{
      return user.room === room;
    });
    var namesArray = users.map((user)=>{
     return user.name;
    });
    return namesArray;
  }
}
module.exports={Users};

// //But We will use ES6 classes
// class Person{
//   constructor(name,age){
//     this.name=name;
//     this.age=age;
//   }
//   getUserDescription(){
//     return `${this.name} is ${this.age} year(s) old.`;
//   }
// }
//
// var me = new Person('Gagan',22);
// // console.log('this.name',me.name);
// // console.log('this.age',me.age);
// var description = me.getUserDescription();
// console.log(description);
//



// //standard method
// var users = [];
//
// var addUser=(id,name,room)=>{
//   users.push({})
// }
//
// modules.export ={addUsers}
