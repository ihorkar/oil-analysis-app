declare module 'html2pdf.js' {
  function html2pdf(): {
    from(element: HTMLElement): {
      set(options: any): {
        output(type: string): Promise<string>;
      };
    };
  }

  export default html2pdf;
}