/**
 * Triggers a subtle haptic pulse on supported devices.
 */
export function triggerHaptic(type: 'light' | 'medium' | 'success' | 'warning' = 'light') {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    switch (type) {
      case 'light':
        window.navigator.vibrate(15);
        break;
      case 'medium':
        window.navigator.vibrate(25);
        break;
      case 'success':
        window.navigator.vibrate([10, 50, 10]);
        break;
      case 'warning':
        window.navigator.vibrate([30, 100, 30]);
        break;
      default:
        window.navigator.vibrate(15);
    }
  }
}
