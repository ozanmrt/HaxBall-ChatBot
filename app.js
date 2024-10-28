const HaxballJS = require("haxball.js");
const axios = require("axios");
require('dotenv').config()

const sendSimSimiMessage = async (message) => {

    try {
      const response = await axios.post(
        'https://api.simsimi.vn/v1/simtalk',
        new URLSearchParams({
          text: message,
          lc: "tr" // Language: en
          
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("SimSimi API hatası:", error.message);
      return "Bir hata oluştu. Lütfen tekrar deneyin.";
    }
}

 
HaxballJS.then((HBInit) => {
  const room = HBInit({
    roomName: "HaxBall ChatBot | GitHub Link",
    maxPlayers: 10,
    public: true,
    token: process.env.HEADLESS_TOKEN, // Configure .env doc | https://www.haxball.com/headlesstoken
    playerName: "🤖"
  });

  room.setDefaultStadium("Big");
  room.setScoreLimit(5);
  room.setTimeLimit(0);

  room.onRoomLink = function (link) {
    console.log(link);
  };

  room.onPlayerJoin = function (player) {
    console.log(`${player.name} Giriş Yaptı!`);
    room.sendAnnouncement(`Hoş Geldin! ${player.name}`, player.id, 0xFFFFFF);
    room.sendAnnouncement(`Botun kaynak kodları için (YILDIZLAMAYI UNUTMA); https://github.com/ozanmrt/HaxBall-ChatBot `, null, 0xFFFFFF);
player.id
  };

  room.onPlayerChat = async (plr,msg)=>{
    console.log(`${plr.name}: ${msg}`);
    sendSimSimiMessage(msg)
      .then((response) => {
        console.log("🤖:", response.message);
        if (!response.message){
            room.sendChat(`Ne diyon la anlamadım?`);
            return;
        }
        room.sendChat(`${response.message}`);
      })
      .catch((error) => {
        console.error("Hata:", error.message);
      });

  }
});
