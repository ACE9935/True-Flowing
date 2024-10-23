export function generateRandomCode(length: number): string {
    // Calculate the minimum and maximum values based on the desired length
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
  
    // Generate a random number between min and max
    const randomNumber = Math.floor(min + Math.random() * (max - min + 1));
    return randomNumber.toString();
  }