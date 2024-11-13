function capitalizeFirstLetter(string: string) {
    const stringFormat = string.toLowerCase();
    return stringFormat.charAt(0).toUpperCase() + stringFormat.slice(1);
  }
  
  export default capitalizeFirstLetter;