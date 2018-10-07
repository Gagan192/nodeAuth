var socket = io();

function scrollToBottom(chat_box){
  //Selectors
  var messages =jQuery(chat_box);
  var newMessage= messages.children('li:last-child')

  //Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight =newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
//    $(window).scrollTop(scrollHeight);
    messages.scrollTop(scrollHeight);
  }

}

  socket.on('connect',function(){
    //var params = jQuery.deparam(window.location.search);
    var params = {"questionId":localStorage.question,"token":localStorage.token}
    socket.emit('join',params,function(err){
      if(err){
        alert(err);
        window.location.href='/users/login';
      }else{
        console.log("No error");
      }
    });
  });


  socket.on('newMessage',function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template =jQuery('#message-template').html();
    var voteNormal= "<span class='btn btn-info btn-sm fa fa-thumbs-up upvote normal' id='"+ message.messageId +"'> 0</span>";
    var voteImp= "<span class='btn btn-info btn-sm fa fa-thumbs-up upvote imp' id='"+ message.messageId +"'> 0</span>";
    if(message.ImpTag){
      var html = Mustache.render(template,{
        text: message.text,
        from: message.from,
        createdAt: formattedTime,
        messageId: message.messageId
      });
    jQuery('#messages').append(html);
    jQuery("#"+message.messageId).children().append(voteNormal).html();
    jQuery('#messages1').append(html);
    jQuery("#"+message.messageId).children().append(voteImp).html();
    }else {
      var html = Mustache.render(template,{
        text: message.text,
        from: message.from,
        createdAt: formattedTime,
        messageId: message.messageId
      });
    jQuery('#messages').append(html);
    }

    scrollToBottom('#messages');
    scrollToBottom('#messages1');
  });

  socket.on('updateVote',function(like,id){
    $('li#'+id+' .imp').text(' '+like);
    $('li#'+id+' .normal').text(' '+like);
  });

  socket.on('disconnect',function(){
    console.log('Disconnected from the server');
  });


  $(function() {

       var buttonpressed;
      $('.submitbutton').click(function() {
            buttonpressed = $(this).attr('name');
      });

      $('#message-form').on('submit',function(e) {
        e.preventDefault();
        var messageTextbox = $('[name=message]');
            if(buttonpressed == 'Normal'){

              socket.emit('createMessage',{
                text:messageTextbox.val(),
                ImpTag:0
              },function(){
              messageTextbox.val("")
              });
                buttonpressed='';
            }
            else if(buttonpressed == 'Important'){
              socket.emit('createMessage',{
                text:messageTextbox.val(),
                ImpTag:1
              },function(){
              messageTextbox.val("")
              });
                buttonpressed='';
            }

      });

      $(document).delegate('.upvote','click',function() {
          var upvoteId = $(this).attr('id');
          socket.emit('upvote',{
            upvoteId:upvoteId
          },function(){
        //  messageTextbox.val("")
          });
      });
  });
