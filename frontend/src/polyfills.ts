/***************************************************************************************************
 * Global shim (needed for some libraries like sockjs-client / stompjs that expect Node "global")
 ***************************************************************************************************/
(globalThis as any).global = globalThis;
(window as any).global = window;