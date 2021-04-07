import axios from 'axios';

export default function getCredentials (employeeId, endpoint) {
    return new Promise(( resolve, reject ) => {
      axios.get(`${endpoint}/auth/${employeeId}`)
      .then((res)=>{
        resolve(res.data)
      })
      .catch(err => reject(err))
    })
}