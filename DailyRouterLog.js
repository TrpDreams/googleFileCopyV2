let date = new Date();
let monthIndex = 0;
let monthNumber = 0;
let dayNumber = 0;
const FILE = '16tUpNQbNftn348-41NFdlZw4h5ty1TFkBqroVbtDaJI'; //File ID of the file to be copied - PLEASE DO NOT TOUCH THIS FILE - 16tUpNQbNftn348-41NFdlZw4h5ty1TFkBqroVbtDaJI
const FOLDER = '1FNgoD1XIsw1jeYkuXPEJezO8ZLarwBD9'; //Folder ID of the base Daily Shift Router Logs folder
const TWO_DIGIT_YEAR = date.getFullYear().toString().substr(-2);

function doGet(){
    const NEW_FILE = DriveApp.getFileById(FILE); 
    buildFileName();

    //Checking the folder iterator looking for a folder Id of the folder that matches the string folder name
    var files = DriveApp.getFolderById(getFolder()).getFilesByName('' + getPaddedMonthNumber() + '-' + getPaddedDayNumber() + '-' + date.getFullYear().toString().substr(-2)); //.getFilesByName(monthNumber + '-' + day + '-' + date.getFullYear().toString().substr(-2));
    if(!files.hasNext()) {

        NEW_FILE.makeCopy(getPaddedMonthNumber() + '-' + getPaddedDayNumber() + '-' + TWO_DIGIT_YEAR, folderId);
        var HTMLString = "<style> h1,p {font-family: 'Helvitica', 'Arial'}</style>" + "<h1>" + getPaddedMonthNumber() + "-" + getPaddedDayNumber() + "-" + TWO_DIGIT_YEAR + " successfully created!</h1>";
        HTMLOutput = HtmlService.createHtmlOutput(HTMLString);
        return HTMLOutput;
      
    }
    else {
    // Output to let the user know folder creation was successful
    var HTMLString = "<style> h1,p {font-family: 'Helvitica', 'Arial'}</style>" + "<h1>" + getPaddedMonthNumber() + "-" + getPaddedDayNumber() + "-" + TWO_DIGIT_YEAR + " file already exists, no new file created.</h1>";
    HTMLOutput = HtmlService.createHtmlOutput(HTMLString);
    return HTMLOutput;
    }
  
}

function checkLeapYear(year) {
    var leapYear = true;
    if(year % 4 != 0 || (year % 100 == 0 && year % 400 != 0)) {
        leapYear = false;
    }
    return leapYear;
}

function buildFileName() {
    setMonthIndex(date.getMonth());
    setMonthNumber((date.getMonth() + 1).toString());
    var year = date.getFullYear();
    var time = date.getUTCHours();
    leapYear = checkLeapYear(year);

    //Handling Mid shift date requirements
    if(time >= 4 && time < 7) {
        setDayNumber(date.getDate() + 1);
        day = '' + getPaddedDayNumber();
        if(monthIndex === 0 || monthIndex === 2 || monthIndex === 4 || monthIndex === 6 || monthIndex === 7 || monthIndex === 9 || monthIndex === 11) {
            if(day === '32') {
            setMonthIndex(getMonthIndex() + 1);
            setMonthNumber((date.getMonth() + 2).toString());
            setDayNumber('01');
            }
        }
        if(monthIndex === 1) {
        if(day === '29' && leapYear === false) {
            setMonthIndex(getMonthIndex() + 1);
            setMonthNumber((date.getMonth() + 2).toString());
            setDayNumber('01');
        }
        else if(day === '30') {
            setMonthIndex(getMonthIndex() + 1);
            setMonthNumber((date.getMonth() + 2).toString());
            setDayNumber('01');
        }
        }
        if(monthIndex === 3 || monthIndex === 5 || monthIndex === 8 || monthIndex === 10) {
        if(day === '31') {
            setMonthIndex(getMonthIndex() + 1);
            setMonthNumber((date.getMonth() + 2).toString());
            setDayNumber('01');
        }
        }
    }
    else {
        setDayNumber(date.getDate().toString());
    }
}
function setDayNumber(num) {
    dayNumber = num;
}
function getDayNumber() {
    return dayNumber;
}
function getPaddedDayNumber() {
    var day = getDayNumber();
    if (day.length === 1) {
        day = '0' + day; // Padding single digit days with a 0
    }
    return day;
}
function setMonthNumber(num) {
    monthNumber = num;
}
function getMonthNumber() {
    return monthNumber;
}
function getPaddedMonthNumber() {
    var monthNum = getMonthNumber();
    if(monthNum.length === 1) {
        monthNum = '0' + monthNum; // Padding single digit months with a 0
    }
    return monthNum;
}
function setMonthIndex(index) {
    monthIndex = index;
}
function getMonthIndex() {
    return monthIndex;
}
function getMonthName(index) {
  // String array to convert numerical month to string
  const MONTHS = ['January', 'February',
                'March', 'April',
                'May', 'June',
                'July', 'August',
                'September', 'October',
                'November', 'December'];
  return MONTHS[index];
}

function getFolder() {
    var checkMonth = '' + getPaddedMonthNumber() + ' - ' + getMonthName(getMonthIndex());
    var folder;
    var checkFolder;
    // Starting from the daily log folder, find the year, then month
    var folderYear = DriveApp.getFolderById(FOLDER).getFolders();
    while (folderYear.hasNext()) {
        folder = folderYear.next();
        // When found, get the Id and load to folderID
        if(folder.getName() === '' + date.getFullYear()) {
        checkFolder = folder.getId();
        folderId = DriveApp.getFolderById(folder.getId()).getFolders();
        }
    }
    var folderMonth = DriveApp.getFolderById(checkFolder).getFolders();
    while (folderMonth.hasNext()) {
        folder = folderMonth.next();
        if(folder.getName() === checkMonth) {
        checkFolder = folder.getId();
        folderId = DriveApp.getFolderById(folder.getId());
        }
    }
    return checkFolder;
}