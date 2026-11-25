import { useState } from 'react';

import { OTP_LENGTH } from '../../../constants/auth';
import { useAppDispatch, useAppSelector } from '../../../hooks/use-store';
import { selectChallenge, selectError, selectPhone } from '../../../store/selectors/auth.selectors';
import { formatNational, otpDigits } from '../../../utils/phone';
import { sendOtp, verifyOtp } from '../store/auth.slice';

export function useVerifyOtp() {
  const dispatch = useAppDispatch();
  const phone = useAppSelector(selectPhone);
  const error = useAppSelector(selectError);
  const challenge = useAppSelector(selectChallenge);
  const [code, setCodeState] = useState('');
  const busy = challenge === 'verifying' || challenge === 'sending';
  const ready = code.length === OTP_LENGTH;

  const setCode = (value: string) => {
    setCodeState(otpDigits(value));
  };

  const submit = () => {
    if (!ready || challenge === 'verifying') return;
    void dispatch(verifyOtp(code));
  };

  const resend = () => {
    if (challenge === 'sending') return;
    void dispatch(sendOtp());
  };

  return {
    phoneLabel: `+91 ${formatNational(phone)}`.trim(),
    code,
    setCode,
    submit,
    resend,
    busy,
    ready,
    error,
  };
}
