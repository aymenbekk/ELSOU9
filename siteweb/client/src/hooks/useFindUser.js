import { useState, useEffect } from 'react';
import axios from '../helpers/axios';

export default function useFindUser() {

   const [user, setUser] = useState(null);
   const [isLoading, setLoading] = useState(true);

   const token = localStorage.getItem('token')

useEffect(() => {

   async function findUser() {
     await axios.post('/auth/check_get_user', {
        token
     })
        .then(res => {
         console.log('1')
         const {_id, firstName, lastName, email, role, verified, picture} = res.data.user
         const user = {_id, firstName, lastName, email, role, verified, picture}
        setUser(user);
        setLoading(false);
     }). catch(err => {
      console.log('2')
        setLoading(false);
    });
  }

   findUser();

}, []);

return {
   user,
   isLoading
   }
}