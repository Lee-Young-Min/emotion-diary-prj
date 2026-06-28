import { emotionOrder, emotionThemes, type Emotion } from '../lib/emotions';

type EmotionPickerProps = {
  selectedEmotion: Emotion;
  onSelect: (emotion: Emotion) => void;
};

export function EmotionPicker({ selectedEmotion, onSelect }: EmotionPickerProps) {
  return (
    <div className="emotion-picker" aria-label="오늘의 감정 선택">
      {emotionOrder.map((emotion) => {
        const theme = emotionThemes[emotion];
        const isSelected = selectedEmotion === emotion;

        return (
          <button
            aria-label={`오늘의 감정 ${theme.label}`}
            aria-pressed={isSelected}
            className="emotion-button"
            key={emotion}
            onClick={() => onSelect(emotion)}
            style={{
              color: theme.text,
              borderColor: isSelected ? theme.text : 'transparent',
              backgroundColor: isSelected ? theme.background : 'transparent',
            }}
            title={theme.label}
            type="button"
          >
            <span aria-hidden="true" className="emotion-face">
              {theme.face}
            </span>
            <span className="emotion-label">{theme.label}</span>
          </button>
        );
      })}
    </div>
  );
}
