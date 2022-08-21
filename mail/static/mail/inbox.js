document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  

  


  document.querySelector('#compose-form').addEventListener('submit', (event) => {
    event.preventDefault();
    send_mail();
    return false;
  });

  // By default, load the inbox
  load_mailbox('inbox');

  
  

  
});

function compose_email() {
  
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#archive').style.display = 'none';
  document.querySelector('#unarchive').style.display = 'none';
  document.querySelector('#reply').style.display = 'none';


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
 
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';

  document.querySelector('#archive').style.display = 'none';
  document.querySelector('#unarchive').style.display = 'none';
  document.querySelector('#reply').style.display = 'none';

 
  // Show the mailbox name
   document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

   let url = '/emails/' + mailbox;
   fetch(url)
   .then(response => response.json())
   .then(emails => {
       // Print emails

       for (var i=0; i < emails.length; i++) {
          let sender = emails[i]['sender'];
          let subject = emails[i]['subject'];
          let timestamp  = emails[i]['timestamp'];
          const element = document.createElement('tr');
          let id  = emails[i]['id'];
          element.addEventListener('click', function() {
            viewMail(mailbox,id);
          });
          element.setAttribute('class', 'row');
          if (emails[i]['read']){
            element.style.backgroundColor = "gray";
          }
          else {
            element.style.backgroundColor = "white";
          }
          element.innerHTML = `<td class = "left" style="font-weight:bold; padding-right : 50px"> ${sender}</td><td class="mid" style = "width :300px">${subject}</td> &nbsp<td style = "font-style: italic; padding-left : 300px; " class = "right"> ${timestamp}
              </td> `
          document.querySelector('#emails-view').append(element);

          
        
     }
   
       // ... do something else with emails ...
       console.log(emails);
       console.log("hi");
       const rows  = document.querySelectorAll(".row");
       rows.forEach((row) => {
          row.style.border = "thin solid";
          row.style.width = "1000px";     
       });
       
     

   });
   
}

function send_mail() {
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: document.querySelector('#compose-recipients').value,
          subject: document.querySelector('#compose-subject').value,
          body: document.querySelector('#compose-body').value
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
        load_mailbox('sent');
    }); 
    return false; 
}

function viewMail(mail,id){

  
  document.querySelector('#archive').style.display = 'none';
  document.querySelector('#unarchive').style.display = 'none';

  //document.querySelector('#archive').addEventListener('click', () => archive(id));
  //document.querySelector('#unarchive').addEventListener('click', () => unarchive(id));
  document.querySelector('#archive').onclick = () => archive(id);
  document.querySelector('#unarchive').onclick = () =>unarchive(id);
  document.querySelector('#reply').onclick = () =>reply(id);
  

  let url = '/emails/' + id;
  fetch(url)
  .then(response => response.json())
  .then(email => {
      // Print email
      if (mail === "inbox"){
        document.querySelector('#archive').style.display = 'block';
        document.querySelector('#reply').style.display = 'block';
      }
      else if (mail === "archive"){
        document.querySelector('#unarchive').style.display = 'block';
      }
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#email-view').style.display = 'block';
      //const element = document.createElement('div');
      //element.setAttribute('class', 'email');
      let sender = email['sender'];
      let subject = email['subject'];
      let reciever = email['recipients'];
      let timestamp  = email['timestamp'];
      let body = email['body'];
      // element.innerHTML = `<p> <b>From : </b> ${sender}</p><p><b>To: </b> ${reciever}</p>  <p><b>Subject:</b>
      //     ${subject}</p><p> <b>TimeStamp: </b>${timestamp}</p><hr> <div>${body}</div>`
      let replacement  = `<p> <b>From : </b> ${sender}</p><p><b>To: </b> ${reciever}</p>  <p><b>Subject:</b>
          ${subject}</p><p> <b>TimeStamp: </b>${timestamp}</p><hr> <div>${body}</div>`
      // document.querySelector('#email-view').append(element);
      document.querySelector('#email-view').innerHTML = replacement;

      fetch(url, {
        method: 'PUT',
        body: JSON.stringify({
            read: true
        })
      });


      console.log(email);
      

      // ... do something else with email ...
  });

}
function archive (id){
  let url = '/emails/' + id;
  fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
    
  }).then(response => {
    load_mailbox('inbox');
    //location.reload();    
    })
}

function unarchive (id){
  let url = '/emails/' + id;
  fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  }).then(response => {
    load_mailbox('inbox');
    
    })
}

function reply(id){
  compose_email();
  let url = '/emails/' + id;
  fetch(url)
    .then(response => response.json())
    .then(email => {

        document.querySelector('#emails-view').style.display = 'none';
        document.querySelector('#compose-view').style.display = 'block';
        document.querySelector('#email-view').style.display = 'none';
        document.querySelector('#archive').style.display = 'none';
        document.querySelector('#unarchive').style.display = 'none';
        document.querySelector('#reply').style.display = 'none';

        let sender = email['sender'];
        let subject = email['subject'];
        let reciever = email['recipients'];
        let timestamp  = email['timestamp'];
        let body = email['body'];
        let Resubject = subject.slice(0,4)==="Re: "? subject: "Re: " + subject;
        let reBody = timestamp + " " + sender + " wrote: \n" + body;

        document.querySelector('#compose-recipients').value = sender;
        document.querySelector('#compose-subject').value = Resubject;
        document.querySelector('#compose-body').value = reBody;
        // Print email
        console.log(email);

        // ... do something else with email ...
  });
  
}
