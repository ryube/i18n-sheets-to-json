declare module 'log-beautify' {
  let useSymbols: boolean;
  let useLabels: boolean;
  function setLevel(number: -1 | 1 | 2 | 3 | 4 | 5);
  function info(message?: any, ...optionalParams: any[]): void;
  function success(message?: any, ...optionalParams: any[]): void;
  function success_(message?: any, ...optionalParams: any[]): void;
  function ok(message?: any, ...optionalParams: any[]): void;
  function ok_(message?: any, ...optionalParams: any[]): void;
  function debug(message?: any, ...optionalParams: any[]): void;
  function debug_(message?: any, ...optionalParams: any[]): void;
  function info(message?: any, ...optionalParams: any[]): void;
  function info_(message?: any, ...optionalParams: any[]): void;
  function warning(message?: any, ...optionalParams: any[]): void;
  function warning_(message?: any, ...optionalParams: any[]): void;
  function warn(message?: any, ...optionalParams: any[]): void;
  function warn_(message?: any, ...optionalParams: any[]): void;
  function error(message?: any, ...optionalParams: any[]): void;
  function error_(message?: any, ...optionalParams: any[]): void;
  function setSymbols(param: any);
  /**
   * (default console.log())
   * @param (message?: any, ...optionalParams: any[]): void
   */
  function show(message?: any, ...optionalParams: any[]): void;
}
