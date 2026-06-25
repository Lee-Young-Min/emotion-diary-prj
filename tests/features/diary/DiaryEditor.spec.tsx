import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DiaryEditor } from '../../../src/components/DiaryEditor';
import type { DiaryEntry } from '../../../src/lib/diaryStorage';

const entry: DiaryEntry = {
  id: '2026-06-25',
  date: new Date('2026-06-25T21:00:00+09:00').getTime(),
  emotion: 'neutral',
  text: '',
};

describe('DiaryEditor', () => {
  it('lets the user write a diary entry', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DiaryEditor entry={entry} onChange={onChange} />);

    await user.type(screen.getByLabelText('오늘의 생각'), '조용한 하루였다.');

    expect(onChange).toHaveBeenCalled();
  });
});
