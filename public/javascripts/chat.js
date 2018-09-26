var socket = io();

function scrollToBottom(chat_box){
  //Selectors
  var messages =jQuery(chat_box);
  var newMessage= messages.children('li:last-child')
  console.log('Gagan',messages);
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
    var params = {"name":"gagan","room":"chat"}
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
    if(message.ImpTag){
      var html = Mustache.render(template,{
        text: message.text,
        from: message.from,
        createdAt: formattedTime
      });
    jQuery('#messages').append(html);
    jQuery('#messages1').append(html);
    }else {
      var html = Mustache.render(template,{
        text: message.text,
        from: message.from,
        createdAt: formattedTime
      });
    jQuery('#messages').append(html);
    }

    scrollToBottom('#messages');
    scrollToBottom('#messages1');
  });

  socket.on('disconnect',function(){
    console.log('Disconnected from the server');
  });


  $(function() {

       var buttonpressed;
      $('.submitbutton').click(function() {
            buttonpressed = $(this).attr('name');
      })

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

      })
  })
