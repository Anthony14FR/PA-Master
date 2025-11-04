'use client';

import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Preferences } from '@capacitor/preferences';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { useCapacitor } from '@/hooks/use-capacitor';

export function Page() {
  const { isNative } = useCapacitor();

  const triggerHaptic = async () => {
    if (isNative) {
      await Haptics.impact({ style: ImpactStyle.Medium });
    }
  };

  const saveData = async () => {
    if (isNative) {
      await Preferences.set({
        key: 'user-preference',
        value: JSON.stringify({ theme: 'dark' })
      });
    }
  };

  const loadData = async () => {
    if (isNative) {
      const { value } = await Preferences.get({ key: 'user-preference' });
      if (value) {
        const data = JSON.parse(value);
        console.log('Loaded data:', data);
      }
    }
  };

  const changeStatusBar = async () => {
    if (isNative) {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#000000' });
    }
  };

  const hideKeyboard = async () => {
    if (isNative) {
      await Keyboard.hide();
    }
  };
  const showKeyboard = async () => {
    if (isNative) {
      await Keyboard.hide();
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Capacitor Examples</h2>
      
      <button 
        onClick={triggerHaptic}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Trigger Haptic
      </button>

      <button 
        onClick={saveData}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Save Data
      </button>

      <button 
        onClick={loadData}
        className="px-4 py-2 bg-purple-500 text-white rounded"
      >
        Load Data
      </button>

      <button 
        onClick={changeStatusBar}
        className="px-4 py-2 bg-yellow-500 text-white rounded"
      >
        Change Status Bar
      </button>

      <button 
        onClick={hideKeyboard}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Hide Keyboard
      </button>
      <button 
        onClick={showKeyboard}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Show Keyboard
      </button>
    </div>
  );
}