import React, { Component, useState } from "react";
import "./password.css";
import axios from '../../../../helpers/axios'
import { useTranslation } from 'react-i18next'

function PasswordEdit(props) {

  const user = props.user

  const {t} = useTranslation()

  const [oldPass, setOldPass] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const submit = async () => {

    if (!oldPass) {
      setSuccess(false)
      setError(t('old_password_obligation'))
      return
    }

    if (!password) {
      setSuccess(false)
      setError(t('new_password_obligation'))
      return
    }

    if (!confirmPass) {
      setSuccess(false)
      setError(t('confirm_password_obligation'))
      return
    }

    if (password !== confirmPass) {
      setSuccess(false)
      setError(t('identique'))
      return
    }

    try {
      await axios.post('account/edit_password', {
        userId: user._id,
        oldPassword: oldPass,
        password: password
      })
      setSuccess(true)
      setError(null)

    } catch (error) {
      if (error.response) {
        if (error.response.status == 400) {
          setSuccess(false)
          setError(error.response.data.error);
        }
      }
    }





  }

  return (
    <div className="edit-password">
      <h1>{t('password')}</h1>

      <div>
        <label>{t('old_password')}</label>
        <input type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} />
      </div>
      <div>
        <label>{t('new_password')}</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label>{t('confirm_new_paswword')}</label>
        <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
      </div>
      <div>
          {error && <p>{error}</p>}
          {success && <p>{t('changed_with_success')}</p>}
      </div>
      <button onClick={() => submit()}>{t('save_modifications')}</button>
    </div>
  );
}
export default PasswordEdit;
