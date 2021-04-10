import axios from 'axios';
import { Buffer } from 'buffer';

export default function getCredentials (employeeId, endpoint) {
    return new Promise(( resolve, reject ) => {
      axios.get(`${endpoint}/auth/${employeeId}`)
      .then((res)=>{
        const { id, name, role } = JSON.parse(Buffer.from(res.data.split(".")[1], 'base64'))
        resolve({token: res.data, id, name, role})
      })
      .catch(err => reject(err))
    })
}