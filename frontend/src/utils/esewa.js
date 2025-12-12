/**
 * Redirects the user to the eSewa payment gateway by creating and submitting a form.
 * @param {object} esewaData - The data object received from your backend's /initiate endpoint.
 */
export const postToEsewa = (esewaData) => {
  const esewaForm = document.createElement('form');
  esewaForm.setAttribute('method', 'POST');
  esewaForm.setAttribute('action', 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'); // Use production URL when live

  for (const key in esewaData) {
    if (esewaData.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.setAttribute('type', 'hidden');
      hiddenField.setAttribute('name', key);
      hiddenField.setAttribute('value', esewaData[key]);
      esewaForm.appendChild(hiddenField);
    }
  }

  document.body.appendChild(esewaForm);
  esewaForm.submit();
};