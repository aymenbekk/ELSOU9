import React, { Component, useState, useEffect } from "react";
import "./moncompte.css";
import axios from '../../../../helpers/axios'
import useFindUser from "../../../../hooks/useFindUser";
import { useTranslation } from 'react-i18next'

function MonCompte(props) {

  const {t} = useTranslation()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState("")
  const [user, setUser] = useState(null)


  const token = localStorage.getItem("token");

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const ress = await axios.post("/auth/check_get_user", { token });
    setUser(ress.data.user);
    setFirstName(ress.data.user.firstName)
    setLastName(ress.data.user.lastName)

  };






  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const submit = async () => {


    if (!firstName) {
      setSuccess(false)
      setError('Nom* champ obligtoire')
      return
    }

    if (!lastName) {
      setSuccess(false)
      setError('Prénom* champ obligtoire')
      return
    }

    const userId = user._id

    const res = await axios.post('account/edit_first_last_name', {userId, firstName, lastName})

    if (res.status == 200) {
      setSuccess(true)
      setError(null)
    }
    

  }

  if (user)
  return (
    <div className="mon-compte">
      <h1>{t('my_account')}</h1>
      <div>
        <div className="nom-prenom">
          <div>
            <label>{t('landing_name')}</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <label>{t('landing_prenom')}</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>
        <div className="email">
          <label>{t('popup_email')}</label>
          <input type="text" value={user.email} disabled />
        </div>
        <div>
            {error && <p>{error}</p>}
            {success && <p>{t('changed_with_success')}</p>}
        </div>
        <button onClick={() => submit()}>{t('save_modifications')}</button>
      </div>
    </div>
  );
}
export default MonCompte;
