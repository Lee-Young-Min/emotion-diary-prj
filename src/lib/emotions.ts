import type { Icon } from 'react-feather';
import { CloudRain, Meh, Moon, Smile, Zap } from 'react-feather';

export type Emotion = 'happy' | 'sad' | 'calm' | 'angry' | 'neutral';

export type EmotionTheme = {
  label: string;
  background: string;
  text: string;
  Icon: Icon;
};

export const emotionThemes: Record<Emotion, EmotionTheme> = {
  happy: {
    label: '기쁨',
    background: '#FFFBEB',
    text: '#F59E0B',
    Icon: Smile,
  },
  sad: {
    label: '슬픔',
    background: '#EFF6FF',
    text: '#3B82F6',
    Icon: CloudRain,
  },
  calm: {
    label: '평온',
    background: '#F0FDF4',
    text: '#16A34A',
    Icon: Moon,
  },
  angry: {
    label: '화남',
    background: '#FEF2F2',
    text: '#EF4444',
    Icon: Zap,
  },
  neutral: {
    label: '보통',
    background: '#F9FAFB',
    text: '#6B7280',
    Icon: Meh,
  },
};

export const emotionOrder: Emotion[] = ['happy', 'sad', 'calm', 'angry', 'neutral'];
