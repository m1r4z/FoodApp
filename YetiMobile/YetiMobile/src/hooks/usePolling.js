import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef } from 'react';

/**
 * A reusable polling hook that automatically fetches data at specified intervals
 * when the screen is focused and optionally when the app is in foreground.
 *
 * @param {Function} fetchFunction - The async function to call for fetching data
 * @param {Object} options - Configuration options
 * @param {number} options.interval - Polling interval in milliseconds (default: 10000ms = 10s)
 * @param {boolean} options.pollOnFocus - Whether to poll when screen comes into focus (default: true)
 * @param {boolean} options.immediate - Whether to fetch immediately on mount (default: true)
 * @param {boolean} options.enabled - Whether polling is enabled (default: true)
 */
const usePolling = (
  fetchFunction,
  { interval = 10000, pollOnFocus = true, immediate = true, enabled = true } = {}
) => {
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);

  // Clear interval on unmount
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Start polling when enabled
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Immediate fetch on mount if enabled
    if (immediate && isMountedRef.current) {
      fetchFunction();
    }

    // Set up polling interval
    intervalRef.current = setInterval(() => {
      if (isMountedRef.current) {
        fetchFunction();
      }
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, interval, immediate, fetchFunction]);

  // Optionally fetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (pollOnFocus && enabled) {
        fetchFunction();
      }
    }, [pollOnFocus, enabled, fetchFunction])
  );
};

export default usePolling;
