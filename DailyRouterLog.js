function doGet(){
  // String array to convert numerical month to string
  const MONTHS = ['January', 'February',
                'March', 'April',
                'May', 'June',
                'July', 'August',
                'September', 'October',
                'November', 'December'];
  // Setting up variables
  var folderId;
  const NEW_FILE = DriveApp.getFileById('16tUpNQbNftn348-41NFdlZw4h5ty1TFkBqroVbtDaJI'); //File ID of the file to be copied - PLEASE DO NOT TOUCH THIS FILE - 16tUpNQbNftn348-41NFdlZw4h5ty1TFkBqroVbtDaJI
  var date = new Date();
  var numMonth = date.getMonth();
  var monthNum = (date.getMonth() + 1).toString();
  var time = date.getUTCHours();
  var year = date.getFullYear();
  
  leapYear = checkLeapYear(year);
  getDayOfMonth(time, numMonth);
  
  //Handling Mid shift date requirements
  if(time >= 5 && time < 7) {
    var day = date.getDate() + 1;
    day = '' + day;
    if(numMonth === 0 || numMonth === 2 || numMonth === 4 || numMonth === 6 || numMonth === 7 || numMonth === 9 || numMonth === 11) {
        if(day === '32') {
          numMonth += 1;
          monthNum = (date.getMonth() + 2).toString();
          day = '01';
        }
    }
    if(numMonth === 1) {
      if(day === '29' && leapYear === false) {
        numMonth += 1;
        monthNum = (date.getMonth() + 2).toString();
        day = '01';
      }
      else if(day === '30') {
        day = '01';
        numMonth += 1;
        monthNum = (date.getMonth() + 2).toString();
      }
    }
    if(numMonth === 3 || numMonth === 5 || numMonth === 8 || numMonth === 10) {
      if(day === '31') {
        numMonth += 1;
        monthNum = (date.getMonth() + 2).toString();
        day = '01';
      }
    }
  }
  else {
    var day = date.getDate().toString();
  }
  var month = MONTHS[numMonth];

  if(monthNum.length === 1) {
    monthNum = '0' + monthNum; // Padding single digit months with a 0
  }
  if (day.length === 1) {
    day = '0' + day; // Padding single digit days with a 0
  }

  // String for the name of the current month
  var checkMonth = '' + monthNum + ' - ' + month;

  // Starting from the daily log folder, find the year, then month
  var folderYear = DriveApp.getFolderById('1FNgoD1XIsw1jeYkuXPEJezO8ZLarwBD9').getFolders();
  while (folderYear.hasNext()) {
    var folder = folderYear.next();
    // When found, get the Id and load to folderID
    if(folder.getName() === '' + date.getFullYear()) {
      checkFolder = folder.getId();
      folderId = DriveApp.getFolderById(folder.getId()).getFolders();
    }
  }
  var folderMonth = DriveApp.getFolderById(checkFolder).getFolders();
  while (folderMonth.hasNext()) {
    var folder = folderMonth.next();
    if(folder.getName() === checkMonth) {
      checkFolder = folder.getId();
      folderId = DriveApp.getFolderById(folder.getId());
    }
  }

  //Checking the folder iterator looking for a folder Id of the folder that matches the string folder name
  var files = DriveApp.getFolderById(checkFolder).getFilesByName('' + monthNum + '-' + day + '-' + date.getFullYear().toString().substr(-2)); //.getFilesByName(monthNum + '-' + day + '-' + date.getFullYear().toString().substr(-2));
  if(!files.hasNext()) {

    NEW_FILE.makeCopy(monthNum + '-' + day + '-' + date.getFullYear().toString().substr(-2), folderId);
    var HTMLString = "<style> h1,p {font-family: 'Helvitica', 'Arial'}</style>" + "<h1>" + monthNum + "-" + day + "-" + date.getFullYear().toString().substr(-2) + " successfully created!</h1>";
    HTMLOutput = HtmlService.createHtmlOutput(HTMLString);
    return HTMLOutput;
  }
  else {
  // Output to let the user know folder creation was successful
  var HTMLString = "<style> h1,p {font-family: 'Helvitica', 'Arial'}</style>" + "<h1>" + monthNum + "-" + day + "-" + date.getFullYear().toString().substr(-2) + " file already exists, no new file created.</h1>";
  HTMLOutput = HtmlService.createHtmlOutput(HTMLString);
  return HTMLOutput;
  }
  
};

function checkLeapYear(year) {
    leapYear = true;
    if(year % 4 != 0 || (year % 100 == 0 && year % 400 != 0)) {
        var leapYear = false;
    }
    return leapYear;
}

function getDayOfMonth(time, numMonth) {

}