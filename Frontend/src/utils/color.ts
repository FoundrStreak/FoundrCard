const isDarkColor = (hexColor: string): boolean => {
  /*  A utility function to determine if a color is light or dark **/
  const c = hexColor.substring(1); // strip #
  const rgb = parseInt(c, 16); // convert to integer
  const r = (rgb >> 16) & 0xff; // get red
  const g = (rgb >> 8) & 0xff; // get green
  const b = (rgb >> 0) & 0xff; // get blue
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
  return luma < 128;
};

const getTextColor = (bgColor: string) => {
  /**
   * Determine text color based on background color for legibility
   */
  return isDarkColor(bgColor) ? "#ffffff" : "#000000";
};

export default getTextColor;
