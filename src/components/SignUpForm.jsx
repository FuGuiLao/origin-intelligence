import { useId, useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { Button } from '@/components/Button';

export function SignUpForm() {
  const [emailAddress, setEmailAddress] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [formStartTime, setFormStartTime] = useState(Date.now());
  const [honeypot, setHoneypot] = useState('');
  let id = useId();

  useEffect(() => {
    // Initialize form start time
    setFormStartTime(Date.now());

    // Set JavaScript validation field
    const jsCheckField = document.getElementById('jsCheck');
    if (jsCheckField) {
      jsCheckField.value = 'passed';
      console.log('JavaScript check set:', jsCheckField.value); // Debugging
    } else {
      console.error('JavaScript check field not found!'); // Debugging
    }
  }, []);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleChangeEmail = (e) => {
    setEmailAddress(e.target.value);
    if (!!e.target.value && !validateEmail(e.target.value)) {
      setErrorText('Invalid Email Address');
    } else {
      setErrorText('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Honeypot value:', honeypot); // Debugging
    if (honeypot) {
      setErrorText('Spam detected. Please try again.');
      return;
    }

    const timeElapsed = Date.now() - formStartTime;
    console.log('Time elapsed since form load:', timeElapsed); // Debugging
    if (timeElapsed < 2000) {
      setErrorText('Form submission too fast. Please try again.');
      return;
    }

    const jsCheckField = document.getElementById('jsCheck');
    console.log('JavaScript check value:', jsCheckField?.value); // Debugging
    if (!jsCheckField || jsCheckField.value !== 'passed') {
      setErrorText('Spam detected. Please try again.');
      return;
    }

    if (!validateEmail(emailAddress)) {
      setErrorText('Invalid Email Address');
      return;
    }

    console.log('All validations passed!'); // Debugging

    const serviceID = 'service_9eddj4w';
    const templateID = 'template_4hdqwxt';
    const userID = 'njnJ53uqzX5AysTcD';

    emailjs
      .send(serviceID, templateID, { emailAddress }, userID)
      .then((response) => {
        setIsSent(true);
        setEmailAddress('A representative will contact you.');
        console.log('Email sent successfully!', response);
      })
      .catch((error) => {
        console.error('Error sending email:', error); // Debugging
        setErrorText('Error Sending Email');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="relative isolate mt-8 flex items-center pr-1">
      {/* Honeypot Field */}
      <input
        type="text"
        name="anti_spam_field"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden-field"
        tabIndex="-1"
        autoComplete="off"
        style={{ position: 'absolute', left: '-9999px' }}
      />
      {/* JavaScript Check Hidden Field */}
      <input type="hidden" name="jsCheck" id="jsCheck" value="" />
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <input
        required
        type="email"
        autoComplete="email"
        name="email"
        id={id}
        placeholder="Email Address"
        className="peer w-0 flex-auto bg-transparent px-4 py-2.5 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-[0.8125rem]/6"
        disabled={isSent}
        value={emailAddress}
        onChange={handleChangeEmail}
      />
      {!!errorText && (
        <span className="absolute left-2 bottom-[-28px] text-sm text-red-800">
          {errorText}
        </span>
      )}
      <Button type="submit" arrow={!isSent} disabled={isSent}>
        {isSent ? 'Thank You' : 'Get Access'}
      </Button>
      <div className="absolute inset-0 -z-10 rounded-lg transition peer-focus:ring-4 peer-focus:ring-sky-300/15" />
      <div className="absolute inset-0 -z-10 rounded-lg bg-white/2.5 ring-1 ring-white/15 transition peer-focus:ring-sky-300" />
    </form>
  );
}
