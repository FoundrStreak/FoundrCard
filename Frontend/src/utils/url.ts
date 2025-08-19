export const replaceUrlParams = (url: string, params: Record<string, string | number>): string => {
    let result = url;
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(`{${key}}`, String(value));
    });
    return result;
  };