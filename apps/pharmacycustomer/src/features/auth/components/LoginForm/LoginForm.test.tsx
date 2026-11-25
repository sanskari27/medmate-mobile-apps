import { fireEvent, render } from '@testing-library/react-native';

import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('asks for an Indian mobile, then enables the code button', () => {
    const onChangePhone = jest.fn();
    const onSubmit = jest.fn();
    const view = render(
      <LoginForm
        phone=""
        error={null}
        busy={false}
        onChangePhone={onChangePhone}
        onSubmit={onSubmit}
      />,
    );
    expect(view.queryByText("We'll send a 6-digit code to +91 .")).toBeNull();
    fireEvent.press(view.getByLabelText('Get code'));
    expect(onSubmit).not.toHaveBeenCalled();

    view.rerender(
      <LoginForm
        phone="5876543210"
        error={null}
        busy={false}
        onChangePhone={onChangePhone}
        onSubmit={onSubmit}
      />,
    );
    expect(view.getByText('Enter an Indian mobile number')).toBeTruthy();

    view.rerender(
      <LoginForm
        phone="9876543210"
        error="OTP could not be sent"
        busy={false}
        onChangePhone={onChangePhone}
        onSubmit={onSubmit}
      />,
    );
    expect(view.getByText('OTP could not be sent')).toBeTruthy();
    expect(view.getByText("We'll send a 6-digit code to +91 98765 43210.")).toBeTruthy();

    view.rerender(
      <LoginForm
        phone="9876543210"
        error={null}
        busy={false}
        onChangePhone={onChangePhone}
        onSubmit={onSubmit}
      />,
    );
    fireEvent.changeText(view.getByLabelText('Mobile number'), '9876543210');
    expect(onChangePhone).toHaveBeenCalledWith('9876543210');
    fireEvent.press(view.getByLabelText('Get code'));
    expect(onSubmit).toHaveBeenCalledTimes(1);

    view.rerender(
      <LoginForm
        phone="9876543210"
        error={null}
        busy
        onChangePhone={onChangePhone}
        onSubmit={onSubmit}
      />,
    );
    fireEvent.press(view.getByLabelText('Get code'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
