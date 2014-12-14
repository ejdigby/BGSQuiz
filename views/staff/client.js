$(document).ready(function() {
    var houseColors = ["#9C27B0", "#EF6C00", "#4CAF50", "#1565C0"]
    $('#house').change(function() {
    if ($(this).val() == "Behn") {
      $('body').css("background-color", houseColors[0]);
    }
    else if ($(this).val() == "Meitner") {
      $('body').css("background-color", houseColors[1]);
    }
    else if ($(this).val() == "Rorschach") {
      $('body').css("background-color", houseColors[2]);
    }
    else if ($(this).val() == "Tinbergen") {
      $('body').css("background-color", houseColors[3]);
    }
    else {
      $('body').css("background-color", "white");
    }
  });
  
  $('#teamname').change(function() {
  if ($(this).val() == "add") {
     var newTeam = prompt('What is the name of the team that you would like to add?')
     $('#teamname').append('<option selected>' + newTeam + '</option>').insertBefore($('#add'));
  }
  }) 
});
