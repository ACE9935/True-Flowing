
export function getCurrentDateInDMYFormat(includeTime = false) {
    const currentDate = new Date();
  
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
    const year = currentDate.getFullYear();
  
    let formattedDate = `${day}/${month}/${year}`;
  
    if (includeTime) {
      const hour = currentDate.getHours();
      const minute = currentDate.getMinutes();
      const second = currentDate.getSeconds();
  
      // Format the time as hour:min:sec
      const formattedTime = `${hour}:${minute}:${second}`;
  
      formattedDate += ` ${formattedTime}`;
    }
  
    return formattedDate;
  }