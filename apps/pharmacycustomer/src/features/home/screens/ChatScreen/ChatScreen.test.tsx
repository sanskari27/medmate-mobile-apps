import { renderWithStore } from '../../../../../test/render';
import { chatTitle } from '../../utils/copy';
import { ChatScreen } from './ChatScreen';

describe('ChatScreen', () => {
  it('shows the chat title', () => {
    const view = renderWithStore(<ChatScreen />);
    expect(view.getByText(chatTitle)).toBeTruthy();
  });
});
