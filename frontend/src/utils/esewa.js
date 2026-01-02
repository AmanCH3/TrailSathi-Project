/**
 * Redirects the user to the eSewa payment gateway by creating and submitting a form.
 * @param {object} esewaData - The data object received from your backend's /initiate endpoint.
 */
export const postToEsewa = (esewaData) => {
  try {
    const esewaForm = document.createElement('form');
    esewaForm.setAttribute('method', 'POST');
    // Using the Test Environment URL as requested/implied by "rc-epay"
    esewaForm.setAttribute('action', 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'); 
    esewaForm.style.display = 'none';

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
  } catch (error) {
    console.error("eSewa Form Submit Error:", error);
    alert("Failed to redirect to payment gateway: " + error.message);
  }
};