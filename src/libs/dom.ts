import { isClient } from './is-client';

/* istanbul ignore next */
export const on = (function() {
    if (!isClient) return;
    if (typeof document.addEventListener === 'function') {
        return function(element: any, event: string, handler: any, useCapture?: boolean) {
            if (element && event && handler) {
                element.addEventListener(event, handler, useCapture);
            }
        };
    } else {
        return function(element: any, event: string, handler: any) {
            if (element && event && handler) {
                element.attachEvent('on' + event, handler);
            }
        };
    }
})();

/* istanbul ignore next */
export const off = (function() {
    if (isClient && typeof document.removeEventListener === 'function') {
        return function(element: any, event: string, handler: EventListenerOrEventListenerObject, useCapture: boolean = false) {
            if (element && event) {
                element.removeEventListener(event, handler, useCapture);
            }
        };
    } else {
        return function(element:any, event:any, handler:any) {
            if (element && event) {
                element.detachEvent('on' + event, handler);
            }
        };
    }
})();
