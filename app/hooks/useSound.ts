'use client';

import { useContext } from 'react';
import { SoundContext } from '@/app/providers';

export const useSound = () => useContext(SoundContext);
