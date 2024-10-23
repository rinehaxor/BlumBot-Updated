import axios from 'axios';
import fs from 'fs';
import readline from 'readline';
import randomUseragent from 'random-useragent';

let authToken = null;
let gameId = null;
let amount = null;
let userAgent = randomUseragent.getRandom();

const readQueriesFromFile = async (filePath) => {
   const queries = [];
   const fileStream = fs.createReadStream(filePath);
   const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
   });

   for await (const line of rl) {
      if (line.trim()) {
         queries.push(line.trim());
      }
   }
   return queries;
};

async function generateToken(query) {
   const url = 'https://user-domain.blum.codes/api/v1/auth/provider/PROVIDER_TELEGRAM_MINI_APP';
   const payload = { query };

   try {
      const response = await axios.post(url, payload, {
         headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            Lang: 'en',
            Origin: 'https://telegram.blum.codes',
            Pragma: 'no-cache',
            'Sec-Ch-Ua': '"Microsoft Edge";v="129", "Not=A?Brand";v="8", "Chromium";v="129", "Microsoft Edge WebView2";v="129"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': userAgent,
         },
      });

      authToken = `Bearer ${response.data.token.access}`;
      const username = response.data.token.user.username;
      console.log('Username:', username);
      console.log('Mendapatkan Token');
   } catch (error) {
      console.error('Error generate token:', error.response ? error.response.data : error.message);
      throw error;
   }
}

async function playGame() {
   const url = 'https://game-domain.blum.codes/api/v2/game/play';

   try {
      const response = await axios.post(
         url,
         {},
         {
            headers: {
               Authorization: authToken,
               'Content-Type': 'application/json',
               'Content-Type': 'application/json',
               'Cache-Control': 'no-cache',
               'Content-Type': 'application/json',
               Lang: 'en',
               Origin: 'https://telegram.blum.codes',
               Pragma: 'no-cache',
               'Sec-Ch-Ua': '"Microsoft Edge";v="129", "Not=A?Brand";v="8", "Chromium";v="129", "Microsoft Edge WebView2";v="129"',
               'Sec-Ch-Ua-Mobile': '?0',
               'Sec-Ch-Ua-Platform': '"Windows"',
               'Sec-Fetch-Dest': 'empty',
               'Sec-Fetch-Mode': 'cors',
               'Sec-Fetch-Site': 'same-site',
               'User-Agent': userAgent,
            },
         }
      );

      gameId = response.data.gameId;
      console.log('Game ID:', gameId);
   } catch (error) {
      console.error('Error saat play game:', error.response ? error.response.data : error.message);
   }
}

const generateRandomPoints = () => Math.floor(Math.random() * (280 - 260 + 1)) + 260;

const getPayloadHash = async () => {
   amount = generateRandomPoints().toString();
   const data = {
      gameId: gameId,
      earnedAssets: {
         CLOVER: { amount: amount },
      },
   };

   try {
      const response = await axios.post('https://blum-payload-generator.hariistimewa.my.id/process?apiKey=etl1', data, {
         headers: {
            'Content-Type': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            Lang: 'en',
            Origin: 'https://telegram.blum.codes',
            Pragma: 'no-cache',
            'Sec-Ch-Ua': '"Microsoft Edge";v="129", "Not=A?Brand";v="8", "Chromium";v="129", "Microsoft Edge WebView2";v="129"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': userAgent,
         },
      });

      return response.data.pack.hash;
   } catch (error) {
      console.error('Error fetching payload hash:', error);
      throw error;
   }
};

const claimGame = async (payload) => {
   const url = 'https://game-domain.blum.codes/api/v2/game/claim';

   try {
      const response = await axios.post(
         url,
         { payload },
         {
            headers: {
               Authorization: authToken,
               'Content-Type': 'application/json',
               'Content-Type': 'application/json',
               'Cache-Control': 'no-cache',
               'Content-Type': 'application/json',
               Lang: 'en',
               Origin: 'https://telegram.blum.codes',
               Pragma: 'no-cache',
               'Sec-Ch-Ua': '"Microsoft Edge";v="129", "Not=A?Brand";v="8", "Chromium";v="129", "Microsoft Edge WebView2";v="129"',
               'Sec-Ch-Ua-Mobile': '?0',
               'Sec-Ch-Ua-Platform': '"Windows"',
               'Sec-Fetch-Dest': 'empty',
               'Sec-Fetch-Mode': 'cors',
               'Sec-Fetch-Site': 'same-site',
               'User-Agent': userAgent,
            },
         }
      );

      console.log(`Klaim berhasil: ${amount} Point`);
   } catch (error) {
      console.error('Error saat klaim game:', error.response ? error.response.data : error.message);
   }
};

// Fungsi untuk menjalankan proses klaim
const startClaimProcess = async () => {
   try {
      const payloadHash = await getPayloadHash(); // Dapatkan hash dari payload
      await claimGame(payloadHash); // Gunakan payload hash untuk klaim game
   } catch (error) {
      console.error('Error in claim process:', error);
   }
};

const dailyReward = async () => {
   const url = 'https://game-domain.blum.codes/api/v1/daily-reward?offset=-420';
   try {
      const response = await axios.get(url, {
         headers: {
            Authorization: authToken, // Gunakan token yang di-generate
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            Lang: 'en',
            Origin: 'https://telegram.blum.codes',
            'Sec-Ch-Ua': '"Microsoft Edge";v="129", "Not=A?Brand";v="8", "Chromium";v="129", "Microsoft Edge WebView2";v="129"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': userAgent,
         },
      });

      console.log('Berhasil Daily Reward:');
   } catch (error) {
      console.error('Sudah Melakukan Daily Reward:');
   }
};
const claimFarming = async () => {
   const url = 'https://game-domain.blum.codes/api/v1/farming/claim';
   try {
      const response = await axios.post(url, {
         headers: {
            Authorization: authToken,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            Lang: 'en',
            Origin: 'https://telegram.blum.codes',
            'Sec-Ch-Ua': '"Microsoft Edge";v="129", "Not=A?Brand";v="8", "Chromium";v="129", "Microsoft Edge WebView2";v="129"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': userAgent,
         },
      });

      console.log('Berhasil Claim Farming');
   } catch (error) {
      console.error('Gagal Claim Farming');
   }
};
const startFarming = async () => {
   const url = 'https://game-domain.blum.codes/api/v1/farming/start';
   try {
      const response = await axios.post(url, {
         headers: {
            Authorization: authToken,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            Lang: 'en',
            Origin: 'https://telegram.blum.codes',
            'Sec-Ch-Ua': '"Microsoft Edge";v="129", "Not=A?Brand";v="8", "Chromium";v="129", "Microsoft Edge WebView2";v="129"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': userAgent,
         },
      });

      console.log('Berhasil Start Farming');
   } catch (error) {
      console.error('Gagal Start Farming');
   }
};

const checkBalanceAndPlayPasses = async () => {
   const url = 'https://game-domain.blum.codes/api/v1/user/balance';
   try {
      const response = await axios.get(url, {
         headers: {
            Authorization: authToken,
            'Content-Type': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            Lang: 'en',
            Origin: 'https://telegram.blum.codes',
            Pragma: 'no-cache',
            'Sec-Ch-Ua': '"Microsoft Edge";v="129", "Not=A?Brand";v="8", "Chromium";v="129", "Microsoft Edge WebView2";v="129"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': userAgent,
         },
      });

      const { playPasses } = response.data;

      console.log(`Jumlah playPasses: ${playPasses}`);

      // Jika playPasses tidak 0, lakukan playGame dan klaim
      if (playPasses > 0) {
         for (let i = 0; i < playPasses; i++) {
            console.log(`Menjalankan play game ke-${i + 1}`);
            await playGame(); // Fungsi playGame
            console.log('Menunggu 45 detik sebelum klaim...');
            await delay(45000); // Delay 45 detik
            await startClaimProcess(); // Klaim game menggunakan hash
         }
      } else {
         console.log('Tidak ada playPasses yang tersedia.');
      }
   } catch (error) {
      console.error('Error saat memeriksa balance:', error.response ? error.response.data : error.message);
   }
};

// Fungsi untuk memproses tiap akun dari file queries.txt
const processAccounts = async (queries) => {
   for (const query of queries) {
      await generateToken(query);
      await dailyReward();
      await claimFarming();
      await startFarming();
      await checkBalanceAndPlayPasses();
   }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const startProcess = async () => {
   try {
      while (true) {
         const queries = await readQueriesFromFile('queries.txt');
         await processAccounts(queries);
      }
   } catch (error) {
      console.error('Error dalam proses utama:', error);
   }
};

startProcess();
