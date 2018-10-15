
//addUser(id,name,room)
//removeUser(id)
//getUser(id)
//getUserList(room)

class Users{
  constructor(){
    this.users=[];
  }
  addUser(id,name,authId,questionId){
    var user = {id,name,authId,questionId};
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
  getUserList(questionId){
    var users = this.users.filter((user)=>{
      return user.questionId === questionId;
    });
    var namesArray = users.map((user)=>{
     return user.name;
    });
    return namesArray;
  }
  getCountUser(questionId){
    var users = this.users.length;
    return users;
  }
}
module.exports={Users};
