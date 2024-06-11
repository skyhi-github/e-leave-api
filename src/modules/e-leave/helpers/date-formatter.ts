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

export function dateFormatterNoday (timetamp){

        const date = new Date(timetamp);
      
        const day = date.getDay();
        const hour = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const adjustedHours = hour % 12 || 12;
      
        const formattedDate = date.toLocaleDateString('en-US');
      
        const dateAndTime = `${formattedDate} ${adjustedHours}:${minutes} ${ampm}`
      
        return dateAndTime;

}

export function leave_track_color (status){

        if (status == 'Application Created') {
           return 'pink';
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