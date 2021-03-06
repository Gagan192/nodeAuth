var socket = io();
var past, now;
var count = 0;

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
  //Scroll to bottom of Chat on Page load
  $("#messages").scrollTop($('#messages')[0].scrollHeight - $('#messages')[0].clientHeight);
  $("#messages1").scrollTop($('#messages1')[0].scrollHeight - $('#messages1')[0].clientHeight);

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

  socket.on('updateCount',function(count){
  $('#count').text('#'+count);
  });

  socket.on('newMessage',function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template =jQuery('#message-template').html();
    var voteNormal= "<span class='btn btn-info btn-sm fa fa-thumbs-up upvote upNormal impMessageStyle' id='"+ message.messageId +"'> 0</span><span class='btn btn-info btn-sm fa fa-thumbs-down downvote downNormal impMessageStyle' id='"+ message.messageId +"'> 0</span>";
    var voteImp= "<span class='btn btn-info btn-sm fa fa-thumbs-up upvote upImp impMessageStyle' id='"+ message.messageId +"'> 0</span><span class='btn btn-info btn-sm fa fa-thumbs-down downvote downImp impMessageStyle' id='"+ message.messageId +"'> 0</span>";
    if(message.ImpTag){
      var html = Mustache.render(template,{
        text: message.text,
        from: message.from,
        createdAt: formattedTime,
        messageId: message.messageId,
        identity: 'impMessageStyle'
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
        messageId: message.messageId,
        identity: 'normalMessageStyle'
      });
    jQuery('#messages').append(html);
    jQuery("#"+message.messageId).children().append(voteNormal).html();
    }
    document.getElementById('notification').play();
    scrollToBottom('#messages');
    scrollToBottom('#messages1');
  });

  socket.on('upgradeImp',function(message){
    var template =jQuery('#message-template').html();
    var voteImp= "<span class='btn btn-info btn-sm fa fa-thumbs-up upvote upImp impMessageStyle' id='"+ message._Id +"'> 0</span><span class='btn btn-info btn-sm fa fa-thumbs-down downvote downImp impMessageStyle' id='"+ message._id +"'> 0</span>";
    var html = Mustache.render(template,{
      text: message.message,
      from: message.authName,
      createdAt: message.date,
      messageId: message._id,
      identity: 'impMessageStyle'
  });
  jQuery('#messages1').append(html);
  jQuery("#"+message._id).children().append(voteImp).html();
});

  socket.on('downgradeImp',function(id){
    $('li#'+id).remove();
  });

  socket.on('updateQuestionvote',function(like,id){
    // console.log('number of likes',like);
    $('.impQuestion').text(' '+like);
  });

  socket.on('updateVote',function(like,id){
    $('li#'+id+' .upImp').text(' '+like);
    $('li#'+id+' .upNormal').text(' '+like);
  });

  socket.on('updateDownvote',function(unlike,id){
    $('li#'+id+' .downImp').text(' '+unlike);
    $('li#'+id+' .downNormal').text(' '+unlike);
  });

  socket.on('updateIncLikeDecUnlike',function(like,unlike,id){
    $('li#'+id+' .upImp').text(' '+like);
    $('li#'+id+' .upNormal').text(' '+like);
    $('li#'+id+' .downImp').text(' '+unlike);
    $('li#'+id+' .downNormal').text(' '+unlike);
  });

  socket.on('updateIncUnlikeDecLike',function(like,unlike,id){
    $('li#'+id+' .upImp').text(' '+like);
    $('li#'+id+' .upNormal').text(' '+like);
    $('li#'+id+' .downImp').text(' '+unlike);
    $('li#'+id+' .downNormal').text(' '+unlike);
  });

  socket.on('disconnect',function(){
    console.log('Disconnected from the server');
  });

  $(function() {

       var buttonpressed;
      $('.submitbutton').click(function() {
            buttonpressed = $(this).attr('name');

        var messageTextbox = $('[name=message]');
        // var html = text.replace(/\n/g,"<br>");
            if(buttonpressed == 'Normal'){

              socket.emit('createMessage',{
                text:messageTextbox.val(),
                ImpTag:0,
                createdAt: moment().format('h:mm a')
              },function(){
              messageTextbox.val("")
              $('#txtarea').height("25px");
              });
                buttonpressed='';
            }
            else if(buttonpressed == 'Important'){
              count++;
              if(count==1){
                 past = new Date().getTime();
              }
              if(count==5){
                 now = new Date().getTime();
                 count = 0;
                 var total = (5*60*1000)-(now-past);
                // no more clicks until timer expires
                if(total>0)
                {
                  $(this).attr("disabled", "disabled");

                  // set timer to re-enable the button
                  setTimeout(function() {
                      $("#markBtn").removeAttr("disabled");
                  }, total);

                }

              }

              socket.emit('createMessage',{
                text:messageTextbox.val(),
                ImpTag:1,
                createdAt: moment().format('h:mm a')
              },function(){
              messageTextbox.val("")
              $('#txtarea').height("25px");
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

      $(document).delegate('.downvote','click',function() {
          var downvoteId = $(this).attr('id');
          socket.emit('downvote',{
            downvoteId:downvoteId
          },function(){
        //  messageTextbox.val("")
          });
      });

      $(document).delegate('.voteQuestion','click',function() {
          var voteQuestionId = $(this).attr('id');
          socket.emit('voteQuestion',{
            voteQuestionId:voteQuestionId
          },function(){
        //  messageTextbox.val("")
          });
      });
  });
