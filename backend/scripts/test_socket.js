const axios = require('axios');
const { io } = require('socket.io-client');

const BASE = 'http://localhost:5000';

async function main(){
  try{
    const login = async (identifier,password) => {
      const res = await axios.post(`${BASE}/api/auth/login`,{ identifier, password });
      return res.data;
    };

    console.log('Logging in users...');
    const u1 = await login('testuser1','NewPassword123A');
    const u2 = await login('bulkstu1','BulkPass123A');

    console.log('Tokens obtained. Connecting sockets...');

    const c1 = io(BASE, { auth: { token: u1.token }, transports: ['websocket'] });
    const c2 = io(BASE, { auth: { token: u2.token }, transports: ['websocket'] });

    c2.on('receiveMessage', (data) => {
      console.log('c2 receiveMessage:', data);
    });

    c1.on('connect', () => console.log('c1 connected', c1.id));
    c2.on('connect', () => {
      console.log('c2 connected', c2.id);
      console.log('c1 sending message to c2...');
      c1.emit('sendMessage', { receiverId: u2.user._id, senderId: u1.user._id, message: 'Hello from testuser1' });
    });

    // wait a bit then disconnect
    setTimeout(()=>{
      c1.disconnect();
      c2.disconnect();
      console.log('Sockets disconnected');
      process.exit(0);
    }, 5000);

  } catch(err){
    console.error('TEST SOCKET ERROR', err.message || err);
    process.exit(1);
  }
}

main();
