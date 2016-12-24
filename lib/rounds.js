module.exports = {
     changeround: function(room, newround){
        newround = parseInt(newround)
	if (room == "Main Hall"){
	    roomround.Main_Hall[0] = newround
	} else if (room == "Sports Hall"){
	    roomround.Sports_Hall[0] = newround
	} else if (room == "Drama Studio"){
	    roomround.Drama_Studio[0] = newround
        }
    },
     roomround: {
	"Main_Hall":[1],
	"Sports_Hall":[1],
	"Drama_Studio":[1]
    }
}
