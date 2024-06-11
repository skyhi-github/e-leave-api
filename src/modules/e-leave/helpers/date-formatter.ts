export function dateFormatter (timetamp){

        const date = new Date(timetamp);
      
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
        const day = date.getDay();
        const hour = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const adjustedHours = hour % 12 || 12;
      
        const formattedDate = date.toLocaleDateString('en-US');
      
        const dateAndTime = `${daysOfWeek[day]} ${formattedDate} ${adjustedHours}:${minutes} ${ampm}`
      
        return dateAndTime;

}

export function excelGetDate (timetamp){


   const date = new Date(timetamp);

   const year = date.getUTCFullYear();
   const month = date.getUTCMonth() + 1;
   const day = date.getUTCDate();

   const formattedDate = `${year}-${month.toString()}-${day.toString()}`;

   return formattedDate;
}

export function excelGetTime(timetamp){


   const date = new Date(timetamp);
   const hours = date.getHours().toString().padStart(2, '0');
   const minutes = date.getMinutes().toString().padStart(2, '0');
   

   const formattedTime = `${hours}${minutes}`;

   return formattedTime;
}

export function reportGetDate (timetamp){


   const date = new Date(timetamp);

   const year = date.getUTCFullYear();
   const month = date.getUTCMonth() + 1;
   const day = date.getUTCDate();

   const formattedDate = `${year}/${month.toString()}/${day.toString()}`;

   return formattedDate;
}

export function reportGetTime(timetamp){


   const date = new Date(timetamp);
   const hours = date.getHours().toString().padStart(2, '0');
   const minutes = date.getMinutes().toString().padStart(2, '0');
   const seconds = date.getSeconds().toString().padStart(2, '0');


   const formattedTime = `${hours}:${minutes}:${seconds}`;

   return formattedTime;
}

export function dateFormatterNoday (timetamp){

        const date = new Date(timetamp);
        const hour = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const adjustedHours = hour % 12 || 12;
      
        const formattedDate = date.toLocaleDateString('en-US');
      
        const dateAndTime = `${formattedDate} ${adjustedHours}:${minutes} ${ampm}`
      
        return dateAndTime;

}

export function dateFormatterDOB (timetamp){

   const date = new Date(timetamp);
   const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
   return `${date.getDate()}/${months[date.getMonth()]}`;

}

export function leave_track_color (status){

        if (status == 'Application Created') {
           return '#FFCC33';
        }

        if (status == 'Rejected') {
         return '#ff1744';
      }

        if (status == 'Manager Approved') {
           return 'teal-lighten-2';
        }

        if (status == 'HR Approved') {
           return 'blue-lighten-1';
        }

        if (status == 'Success') {
           return 'green-darken-1';
        }

}