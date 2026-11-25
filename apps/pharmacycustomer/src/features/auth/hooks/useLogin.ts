import { useAppDispatch, useAppSelector } from '../../../hooks/use-store';
import { selectChallenge, selectError, selectPhone } from '../../../store/selectors/auth.selectors';
import { formatNational, isIndianMobile } from '../../../utils/phone';
import { phoneChanged, sendOtp } from '../store/auth.slice';

export function useLogin() {
  const dispatch = useAppDispatch();
  const phone = useAppSelector(selectPhone);
  const error = useAppSelector(selectError);
  const challenge = useAppSelector(selectChallenge);
  const valid = isIndianMobile(phone);
  const busy = challenge === 'sending';

  const changePhone = (value: string) => {
    dispatch(phoneChanged(value));
  };

  const submit = () => {
    if (!valid || busy) return;
    void dispatch(sendOtp());
  };

  return {
    phone,
    displayPhone: formatNational(phone),
    valid,
    busy,
    error,
    changePhone,
    submit,
  };
}
