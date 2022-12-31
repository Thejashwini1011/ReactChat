import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import 'tinymce/icons/default/index.js';
import 'tinymce/icons/default/icons.js';


function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const editorRef = useRef(null);
  const log = () => {
     if (editorRef.current) {
       console.log(editorRef.current.getContent());
     }
   };

  const sendMessage = async () => {
    debugger;
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">                    
                    <div dangerouslySetInnerHTML={{__html: messageContent.message}} />
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer1">
        
      <Editor 
         onInit={(evt, editor) => editorRef.current = editor}
         value={currentMessage}
         init={{
          
   setup:function(ed) {
    ed.on('keyup', function(e) {
      //alert('keyup occured');
      //console.log('init event', e);
      console.log('Editor contents was modified. Contents: ' + ed.getContent());
      let c=ed.getContent().replaceAll(']','>');
      c=c.replaceAll('[','<');
      setCurrentMessage(c);
      
  });
  /*
    ed.on('change', function(e) {
      debugger;
      
        console.log('the event object ', e);
        console.log('the editor object ', ed);
        console.log('the content ', ed.getContent());
        setCurrentMessage(ed.getContent());
    });*/
},
          selector: 'input',
          branding:false,
           height: 200,
           width:1400, 
           elementpath: false,
           menubar: false,//'insert'
           plugins: [
            'emoticons advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks bbcode code fullscreen',
            'insertdatetime media table paste code help mentions' 
          ],//wordcount
          toolbar: 'bold | italic | strikethrough | link | bullist | numlist | blockquote | visualblocks | code |'+
          ' media | emoticons |' ,
          //' undo redo | formatselect | alignleft aligncenter ' +
          //'alignright alignjustify | bullist numlist outdent indent | ' +
          //'removeformat | help',
          blockquote: { block: 'blockquote', classes: 'foo' },
          mentions_item_type: 'name',
           content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
           
         }}

       />
        <div className="msgsend">
        <button className="msgsend" onClick={sendMessage}>&#9658;</button>
        </div>

        


      </div>
    </div>
  );
}

export default Chat;
