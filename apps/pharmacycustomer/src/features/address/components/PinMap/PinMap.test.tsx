import { fireEvent, render } from '@testing-library/react-native';

import { webViewInject } from '../../../../../test/webview-mock';
import { mapLabel } from '../../utils/copy';
import { PinMap } from './PinMap';
import { pinMapTestId } from './pin-map';

const gesture = { onGestureStart: jest.fn(), onGestureEnd: jest.fn() };

describe('PinMap', () => {
  beforeEach(() => {
    webViewInject.mockClear();
    gesture.onGestureStart.mockClear();
    gesture.onGestureEnd.mockClear();
  });

  it('keeps the opening center until the shopper pans', () => {
    const onMove = jest.fn();
    const view = render(
      <PinMap
        center={{ latitude: 12.9716, longitude: 77.5946 }}
        onMove={onMove}
        onGestureStart={gesture.onGestureStart}
        onGestureEnd={gesture.onGestureEnd}
      />,
    );
    expect(webViewInject).not.toHaveBeenCalled();
    expect(view.getByLabelText(mapLabel)).toBeTruthy();

    fireEvent(view.getByLabelText(mapLabel), 'touchStart');
    fireEvent(view.getByLabelText(mapLabel), 'touchEnd');
    fireEvent(view.getByLabelText(mapLabel), 'touchCancel');
    expect(gesture.onGestureStart).toHaveBeenCalled();
    expect(gesture.onGestureEnd).toHaveBeenCalled();

    fireEvent(view.getByTestId(pinMapTestId), 'message', { nativeEvent: { data: '{' } });
    expect(onMove).not.toHaveBeenCalled();
    fireEvent(view.getByTestId(pinMapTestId), 'message', {
      nativeEvent: { data: JSON.stringify({ latitude: 12.95, longitude: 77.61 }) },
    });
    expect(onMove).toHaveBeenCalledWith({ latitude: 12.95, longitude: 77.61 });
  });

  it('moves the map when the center changes', () => {
    const onMove = jest.fn();
    const view = render(
      <PinMap
        center={{ latitude: 12.9716, longitude: 77.5946 }}
        onMove={onMove}
        onGestureStart={gesture.onGestureStart}
        onGestureEnd={gesture.onGestureEnd}
      />,
    );
    view.rerender(
      <PinMap
        center={{ latitude: 12.98, longitude: 77.5946 }}
        onMove={onMove}
        onGestureStart={gesture.onGestureStart}
        onGestureEnd={gesture.onGestureEnd}
      />,
    );
    expect(webViewInject).toHaveBeenCalledWith('window.setPin(12.98, 77.5946); true;');
    view.rerender(
      <PinMap
        center={{ latitude: 12.98, longitude: 77.7 }}
        onMove={onMove}
        onGestureStart={gesture.onGestureStart}
        onGestureEnd={gesture.onGestureEnd}
      />,
    );
    expect(webViewInject).toHaveBeenCalledWith('window.setPin(12.98, 77.7); true;');
  });
});
