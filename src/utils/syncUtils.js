/**
 * Subscribes to real-time worker data update events from admin actions
 */
export const subscribeToWorkerSync = (callback) => {
  let channel = null;
  try {
    if (typeof window !== "undefined" && window.BroadcastChannel) {
      channel = new BroadcastChannel("vew_worker_channel");
      channel.onmessage = (event) => {
        if (event.data?.type === "WORKER_DATA_UPDATED") {
          callback();
        }
      };
    }
  } catch (e) {
    console.warn("BroadcastChannel not supported or error:", e);
  }

  const storageHandler = (e) => {
    if (e.key === "vew_worker_sync_timestamp") {
      callback();
    }
  };
  window.addEventListener("storage", storageHandler);

  return () => {
    if (channel) {
      channel.close();
    }
    window.removeEventListener("storage", storageHandler);
  };
};
