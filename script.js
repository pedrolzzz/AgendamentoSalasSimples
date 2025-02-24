window.onload = function() {
    var Rooms = localStorage.getItem('occupants') ? JSON.parse(localStorage.getItem('occupants')) : [],
       totalRooms = 25,
       checkRoomAvail = document.getElementById('checkRoomAvail'),
       checkRoomAvailBtn = document.getElementById('checkRoomAvailBtn'),
       checkRoomAvailStatus = document.getElementById('checkRoomAvailStatus'),
       addOccupantName = document.getElementById('addOccupantName'),
       addOccupantRoomNo = document.getElementById('addOccupantRoomNo'),
       addOccupantBtn = document.getElementById('addOccupantBtn'),
       addOccupantStatus = document.getElementById('addOccupantStatus'),
       clearRoomNo = document.getElementById('clearRoomNo'),
       clearRoomBtn = document.getElementById('clearRoomBtn'),
       clearRoomStatus = document.getElementById('clearRoomStatus'),
       searchOccupant = document.getElementById('searchOccupant'),
       searchOccupantBtn = document.getElementById('searchOccupantBtn'),
       searchOccupantStatus = document.getElementById('searchOccupantStatus'),
       clearAllBtn = document.getElementById('clearAllBtn'),
       recordList = document.getElementById('recordList'),
       hideStatusTimer;
 
    document.getElementById('showTotalRooms').innerHTML = "Total de Salas: " + totalRooms;
 
    function Occupant(occupantName, roomNumber) {
       this.name = occupantName;
       this.room = roomNumber;
    }
 
    function sortRooms(arr) {
       var len = arr.length;
       for (var i = len - 1; i >= 0; i--) {
          for (var j = 1; j <= i; j++) {
             var a = Number(arr[j - 1].room),
                b = Number(arr[j].room);
             if (a > b) {
                var temp = arr[j - 1];
                arr[j - 1] = arr[j];
                arr[j] = temp;
             }
          }
       }
       return arr;
    }
 
    function updateLocalStorage() {
       sortRooms(Rooms);
       console.log(Rooms);
       localStorage.setItem('occupants', JSON.stringify(Rooms));
    }
 
    function updateRecord() {
       sortRooms(Rooms);
       var storageData = JSON.parse(localStorage.getItem('occupants')),
          recordItem,
          recordData = '';
       for (var i = 0; i < storageData.length; i++) {
          recordItem = 'A sala ' + storageData[i].room + ' : ' + storageData[i].name + '.';
          recordData += '<span>' + recordItem + '</span>';
       }
       recordList.innerHTML = recordData;
       console.log(Rooms);
    }
 
    function clearOtherQueriesStatuses(currentQueryStatus) {
       window.clearTimeout(hideStatusTimer);
       if (currentQueryStatus !== checkRoomAvailStatus) {
          checkRoomAvailStatus.innerHTML = "";
       }
       if (currentQueryStatus !== addOccupantStatus) {
          addOccupantStatus.innerHTML = "";
       }
       if (currentQueryStatus !== clearRoomStatus) {
          clearRoomStatus.innerHTML = "";
       }
       if (currentQueryStatus !== searchOccupantStatus) {
          searchOccupantStatus.innerHTML = "";
       }
       hideStatusTimer = window.setTimeout(function() {
          currentQueryStatus.innerHTML = "";
       }, 10000);
    }
 
    function checkRoomAvailability(roomNoInput) {
       var roomNo = roomNoInput,
          roomAvailable;
       if (Rooms.length !== 0 && roomNo <= totalRooms && roomNo >= 1) {
          for (var i = 0; i < Rooms.length; i++) {
             if (roomNo === Rooms[i].room) {
                roomAvailable = false;
                break;
             } else {
                roomAvailable = true;
             }
          }
       } else if (roomNo <= totalRooms && roomNo >= 1) {
          roomAvailable = true;
       } else {
          roomAvailable = false;
          console.log('Só Existe ' + totalRooms + ' salas para Agendamentos.');
       }
       console.log(roomAvailable);
       return roomAvailable;
    }
 
    checkRoomAvailBtn.onclick = function() {
       checkRoomAvailStatus.innerHTML = '';
       var roomToCheck = checkRoomAvail.value !== '' ? Number(checkRoomAvail.value) : checkRoomAvail.value,
          isRoomAvailable = checkRoomAvailability(roomToCheck);
       if (isRoomAvailable === true && roomToCheck <= totalRooms && roomToCheck >= 1) {
          checkRoomAvailStatus.innerHTML = 'A sala ' + roomToCheck + ' está disponivel.';
       } else if (isRoomAvailable !== true && roomToCheck <= totalRooms && roomToCheck >= 1) {
          checkRoomAvailStatus.innerHTML = 'A sala ' + roomToCheck + ' NÃO está disponivel.';
       } else if (roomToCheck !== '' && (roomToCheck > totalRooms || roomToCheck < 1)) {
          checkRoomAvailStatus.innerHTML = 'Só Existe ' + totalRooms + ' salas para Agendamentos.';
       }
       clearOtherQueriesStatuses(checkRoomAvailStatus);
       checkRoomAvail.value = "";
    };
 
    addOccupantBtn.onclick = function() {
       addOccupantStatus.innerHTML = '';
       var occName = addOccupantName.value,
          occRoom = addOccupantRoomNo.value !== '' ? Number(addOccupantRoomNo.value) : addOccupantRoomNo.value,
          isRoomAvailable = checkRoomAvailability(occRoom);
       if ((occName !== '' && occRoom !== '' && !(/\d/.test(occName))) && (occRoom <= totalRooms && occRoom >= 1) && Rooms.length < totalRooms && isRoomAvailable === true) {
          var tempOccupantObj = new Occupant(occName, occRoom);
          Rooms.push(tempOccupantObj);
          addOccupantStatus.innerHTML = 'A sala ' + occRoom + ' foi agendada para ' + occName + '.';
          addOccupantName.value = "";
          addOccupantRoomNo.value = "";
       } else if ((occName !== '' && occRoom !== '' && !(/\d/.test(occName))) && (occRoom <= totalRooms && occRoom >= 1) && Rooms.length < totalRooms && isRoomAvailable !== true) {
          addOccupantStatus.innerHTML = 'A sla ' + occRoom + ' já está ocupada.';
       } else if ((occName !== '' && occRoom !== '' && !(/\d/.test(occName))) && (occRoom > totalRooms || occRoom < 1)) {
          addOccupantStatus.innerHTML = 'Temos ' + totalRooms + ' salas para agendamentos.';
       } else if (Rooms.length === totalRooms) {
          addOccupantStatus.innerHTML = 'Todas as Salas estão ocupadas.';
       }
       if (/\d/.test(occName)) {
          addOccupantStatus.innerHTML = 'Inserir um nome valido.';
       }
       clearOtherQueriesStatuses(addOccupantStatus);
       updateLocalStorage();
       updateRecord();
    };
 
    clearRoomBtn.onclick = function() {
       clearRoomStatus.innerHTML = '';
       var roomToClear = clearRoomNo.value !== '' ? Number(clearRoomNo.value) : clearRoomNo.value;
       if (Rooms.length !== 0 && roomToClear <= totalRooms && roomToClear >= 1) {
          for (var i = 0; i < Rooms.length; i++) {
             if (roomToClear === Rooms[i].room) {
                Rooms.splice(i, 1);
                clearRoomStatus.innerHTML = 'A sala ' + roomToClear + ' agora está livre.';
                break;
             } else if (checkRoomAvailability(roomToClear) === true) {
                clearRoomStatus.innerHTML = 'A sala ' + roomToClear + ' já estava livre.';
             }
          }
       } else if (Rooms.length === 0 && roomToClear <= totalRooms && roomToClear >= 1) {
          clearRoomStatus.innerHTML = 'A sala ' + roomToClear + ' não tem agendamento.';
       } else if (roomToClear !== '' && (roomToClear > totalRooms || roomToClear < 1)) {
          clearRoomStatus.innerHTML = 'Temos ' + totalRooms + ' sals para agendamentos.';
       }
       clearRoomNo.value = "";
       clearOtherQueriesStatuses(clearRoomStatus);
       updateLocalStorage();
       updateRecord();
    };
 
    searchOccupantBtn.onclick = function() {
       searchOccupantStatus.innerHTML = '';
       var roomToSearch;
       if (!(/\d/.test(searchOccupant.value))) {
          roomToSearch = searchOccupant.value;
          if (roomToSearch !== '') {
             var found,
                nameInRecord,
                nameToSearch;
             for (var j = 0; j < Rooms.length; j++) {
                nameToSearch = roomToSearch.toLowerCase();
                nameInRecord = Rooms[j].name.toLowerCase();
                if (nameToSearch === nameInRecord) {
                   searchOccupantStatus.innerHTML += Rooms[j].name + ' está ocupando a sala ' + Rooms[j].room + '.<br>';
                   found = true;
                }
             }
             if (found !== true) {
                searchOccupantStatus.innerHTML = roomToSearch + ' sala não registrada.';
             }
          }
       } else {
          roomToSearch = searchOccupant.value !== '' ? Number(searchOccupant.value) : searchOccupant.value;
          if (Rooms.length !== 0 && roomToSearch <= totalRooms && roomToSearch >= 1) {
             for (var i = 0; i < Rooms.length; i++) {
                if (roomToSearch === Rooms[i].room) {
                   searchOccupantStatus.innerHTML = 'A sala ' + roomToSearch + ' está agendada para ' + Rooms[i].name + '.';
                } else if (checkRoomAvailability(roomToSearch) === true) {
                   searchOccupantStatus.innerHTML = 'A sala ' + roomToSearch + ' está Livre.';
                }
             }
          } else if (Rooms.length === 0 && roomToSearch <= totalRooms && roomToSearch >= 1) {
             searchOccupantStatus.innerHTML = 'A sala ' + roomToSearch + ' está livre.';
          } else if (roomToSearch !== '' && (roomToSearch > totalRooms || roomToSearch < 1)) {
             searchOccupantStatus.innerHTML = 'Temos ' + totalRooms + ' salas para agendamentos.';
          }
       }
       clearOtherQueriesStatuses(searchOccupantStatus);
       searchOccupant.value = "";
    };
 
    clearAllBtn.onclick = function() {
       Rooms = [];
       updateLocalStorage();
       updateRecord();
    };
 
    updateLocalStorage();
    updateRecord();
 };