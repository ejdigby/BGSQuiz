$(document).ready(function() {
    var houseColors = ["#9C27B0", "#EF6C00", "#4CAF50", "#1565C0"]
    $('#house').change(function() {
    if ($(this).val() == "behn") {
      $('body').css("background-color", houseColors[0]);
    }
    else if ($(this).val() == "meitner") {
      $('body').css("background-color", houseColors[1]);
    }
    else if ($(this).val() == "rorschach") {
      $('body').css("background-color", houseColors[2]);
    }
    else if ($(this).val() == "tinbergen") {
      $('body').css("background-color", houseColors[3]);
    }
    else {
      $('body').css("background-color", "white");
    }
  })
});
