import { useMemo } from "react";

export type CustomEventPayload = {
  detail: {
    key: string;
    value: string;
  };
};
export type CustomEventData = (data: Event & CustomEventPayload) => void;

const SET_ITEM_EVENT_NAME = "INTERNAL_SET_ITEM_EVENT_DO_NOT_USE_DIRECTLY";

class CustomEventListener {
  element: EventTarget;
  listeners: Map<string, CustomEventData | null>;
  constructor() {
    this.element = new EventTarget();
    this.listeners = new Map();
  }

  on(eventName: string, callback: CustomEventData | null) {
    this.listeners.set(eventName, this.listeners.get(eventName) ?? callback);
    this.element.addEventListener(
      eventName,
      (this.listeners.get(eventName) ?? callback) as EventListener,
    );
  }

  off(eventName: string, callback?: () => void) {
    if (callback) {
      callback();
    }
    const listener = this.listeners.get(eventName) as EventListener;
    if (listener) {
      this.element.removeEventListener(eventName, listener);
      this.listeners.delete(eventName);
    }
  }

  emit(eventName: string, data?: CustomEventPayload) {
    this.element.dispatchEvent(new CustomEvent(eventName, data));
  }
}

export default function useLocalStorageObservable() {
  if (typeof window === "undefined") {
    throw new Error(
      "useLocalStorageObservable must be used in a browser environment",
    );
  }

  const customEventListener = useMemo(() => new CustomEventListener(), []);
  const localStorage = useMemo(() => window.localStorage, []);

  const observableLocalStorage = useMemo(
    () =>
      new Proxy(localStorage, {
        get(target, prop) {
          if (prop === "setItem") {
            return (key: string, value: string) => {
              customEventListener.emit(SET_ITEM_EVENT_NAME, {
                detail: { key, value },
              });
              target.setItem(key, value);
            };
          }
          const value = target[prop as keyof typeof target];
          return typeof value === "function" ? value.bind(target) : value;
        },
      }),
    [customEventListener, localStorage],
  );

  function on(callback: CustomEventData) {
    customEventListener.on.call(
      customEventListener,
      SET_ITEM_EVENT_NAME,
      callback,
    );
  }

  function off(callback: () => void) {
    customEventListener.off.call(
      customEventListener,
      SET_ITEM_EVENT_NAME,
      callback,
    );
  }

  return {
    on,
    off,
    observableLocalStorage,
  };
}
